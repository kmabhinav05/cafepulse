from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_admin
from app.models.user import User
from app.models.inventory import InventoryItem
from app.schemas.inventory import (
    InventoryItemCreate,
    InventoryItemUpdate,
    InventoryItemResponse,
    StockAdjustment,
)

router = APIRouter(prefix="/inventory", tags=["Inventory Management"])


@router.get("", response_model=List[InventoryItemResponse])
def list_inventory(
    category: Optional[str] = None,
    low_stock_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List inventory raw materials and packaging (Staff & Admin)."""
    query = db.query(InventoryItem)

    if category:
        query = query.filter(InventoryItem.category == category)

    items = query.order_by(InventoryItem.category, InventoryItem.name).all()

    if low_stock_only:
        items = [i for i in items if i.is_low_stock]

    return items


@router.post("", response_model=InventoryItemResponse, status_code=status.HTTP_201_CREATED)
def create_inventory_item(
    payload: InventoryItemCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Add a new inventory tracked item (Admin only)."""
    existing = db.query(InventoryItem).filter((InventoryItem.name == payload.name) | (InventoryItem.sku == payload.sku)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Item with this name or SKU already exists",
        )

    item = InventoryItem(
        name=payload.name,
        sku=payload.sku,
        category=payload.category,
        current_stock=payload.current_stock,
        unit=payload.unit,
        reorder_threshold=payload.reorder_threshold,
        cost_per_unit=payload.cost_per_unit,
        supplier=payload.supplier,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/{item_id}/adjust", response_model=InventoryItemResponse)
def adjust_inventory_stock(
    item_id: str,
    payload: StockAdjustment,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Restock or adjust inventory level (Staff & Admin)."""
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )

    new_stock = item.current_stock + payload.quantity_change
    if new_stock < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Adjustment would result in negative stock ({new_stock} {item.unit})",
        )

    item.current_stock = round(new_stock, 2)
    if payload.quantity_change > 0:
        item.last_restocked_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inventory_item(
    item_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Remove item from inventory tracking (Admin only)."""
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )
    db.delete(item)
    db.commit()
    return None
