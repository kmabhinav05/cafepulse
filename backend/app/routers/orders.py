from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.order import Order, OrderItem, OrderItemModifier
from app.models.inventory import InventoryItem
from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderSummaryResponse,
    OrderStatusUpdate,
)

router = APIRouter(prefix="/orders", tags=["Orders & POS"])

TAX_RATE = 0.0825  # 8.25% standard cafe tax


def auto_deduct_inventory(db: Session, order: Order):
    """Smart deduction of cafe inventory when orders are submitted."""
    try:
        # 1. Deduct cups
        cup_item = db.query(InventoryItem).filter(InventoryItem.name.ilike("%12oz%")).first()
        if cup_item and cup_item.current_stock > 0:
            total_items = sum(item.quantity for item in order.items)
            cup_item.current_stock = max(0.0, cup_item.current_stock - total_items)

        # 2. Deduct espresso coffee beans (~18g per coffee item)
        bean_item = db.query(InventoryItem).filter(InventoryItem.name.ilike("%Espresso Beans%")).first()
        if bean_item and bean_item.current_stock > 0:
            coffee_count = sum(
                item.quantity
                for item in order.items
                if any(w in item.item_name.lower() for w in ["espresso", "cortado", "latte", "flat white", "cappuccino"])
            )
            bean_item.current_stock = max(0.0, bean_item.current_stock - (coffee_count * 0.018))

        # 3. Deduct Oat Milk if modifier chosen
        oat_milk_item = db.query(InventoryItem).filter(InventoryItem.name.ilike("%Oat Milk%")).first()
        if oat_milk_item and oat_milk_item.current_stock > 0:
            for item in order.items:
                for mod in item.modifiers:
                    if "oat" in mod.modifier_name.lower():
                        oat_milk_item.current_stock = max(0.0, oat_milk_item.current_stock - (0.24 * item.quantity))

        db.flush()
    except Exception as e:
        print(f"Warning: inventory auto-deduction non-fatal error: {e}")


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
):
    """
    Place a new order.
    Public endpoint: Used for both Customer Online Ordering (Guest) and in-store POS Register.
    """
    if not payload.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item",
        )

    order = Order(
        order_type=payload.order_type,
        status="pending",
        customer_name=payload.customer_name.strip(),
        customer_phone=payload.customer_phone.strip() if payload.customer_phone else None,
        customer_email=payload.customer_email.strip() if payload.customer_email else None,
        pickup_time=payload.pickup_time or "ASAP (10-15 min)",
        notes=payload.notes,
        payment_method=payload.payment_method,
        payment_status="paid" if payload.payment_method != "counter" else "pending",
        discount=payload.discount,
    )

    subtotal = 0.0
    for item_data in payload.items:
        item_unit_price = item_data.unit_price
        mod_total = sum(m.price_adjustment for m in item_data.modifiers)
        line_item_unit_total = item_unit_price + mod_total
        line_total = line_item_unit_total * item_data.quantity
        subtotal += line_total

        order_item = OrderItem(
            menu_item_id=item_data.menu_item_id,
            item_name=item_data.item_name,
            size_name=item_data.size_name,
            unit_price=item_unit_price,
            quantity=item_data.quantity,
            total_price=line_total,
            notes=item_data.notes,
        )

        for mod_data in item_data.modifiers:
            order_mod = OrderItemModifier(
                modifier_name=mod_data.modifier_name,
                price_adjustment=mod_data.price_adjustment,
            )
            order_item.modifiers.append(order_mod)

        order.items.append(order_item)

    order.subtotal = round(subtotal, 2)
    order.tax = round((order.subtotal - order.discount) * TAX_RATE, 2)
    order.total = round(order.subtotal - order.discount + order.tax, 2)

    db.add(order)
    db.flush()

    # Link inventory consumption
    auto_deduct_inventory(db, order)

    db.commit()
    db.refresh(order)
    return order


@router.get("", response_model=List[OrderResponse])
def list_orders(
    status_filter: Optional[str] = Query(None, alias="status"),
    order_type: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List orders for POS and Kitchen Display System (Staff & Admin)."""
    query = (
        db.query(Order)
        .options(
            joinedload(Order.items).joinedload(OrderItem.modifiers),
        )
        .order_by(Order.created_at.desc())
    )

    if status_filter:
        query = query.filter(Order.status == status_filter)

    if order_type:
        query = query.filter(Order.order_type == order_type)

    orders = query.limit(limit).all()
    return orders


@router.get("/track/{order_number}", response_model=OrderResponse)
def track_customer_order(
    order_number: str,
    db: Session = Depends(get_db),
):
    """Public customer order live tracker (e.g. /track/CP-1042)."""
    clean_number = order_number.strip().upper()
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.modifiers))
        .filter(Order.order_number == clean_number)
        .first()
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No order found matching number '{clean_number}'",
        )
    return order


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: str,
    db: Session = Depends(get_db),
):
    """Retrieve full details of an order."""
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.modifiers))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    return order


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: str,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Kitchen lifecycle update (Staff/Barista/Admin)."""
    order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.modifiers))
        .filter(Order.id == order_id)
        .first()
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    order.status = payload.status
    if payload.status == "completed" and order.payment_status == "pending":
        order.payment_status = "paid"

    db.commit()
    db.refresh(order)
    return order
