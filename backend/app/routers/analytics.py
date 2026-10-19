from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.inventory import InventoryItem

router = APIRouter(prefix="/analytics", tags=["Business Analytics"])


@router.get("/dashboard")
def get_dashboard_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Executive metrics for CafePulse dashboard cards."""
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    # 1. Total revenue all time and today
    total_rev = db.query(func.coalesce(func.sum(Order.total), 0.0)).filter(Order.status != "cancelled").scalar()
    today_rev = (
        db.query(func.coalesce(func.sum(Order.total), 0.0))
        .filter(Order.created_at >= today_start, Order.status != "cancelled")
        .scalar()
    )

    # 2. Total orders and active kitchen orders
    total_orders = db.query(Order).count()
    active_kitchen_orders = (
        db.query(Order).filter(Order.status.in_(["pending", "preparing", "ready"])).count()
    )

    # 3. Average ticket size
    avg_ticket = round(total_rev / total_orders, 2) if total_orders > 0 else 0.0

    # 4. Low stock inventory alert count
    all_inv = db.query(InventoryItem).all()
    low_stock_count = sum(1 for item in all_inv if item.is_low_stock)

    # 5. Order Type split
    online_count = db.query(Order).filter(Order.order_type == "online_pickup").count()
    dine_in_count = db.query(Order).filter(Order.order_type == "dine_in").count()
    takeaway_count = db.query(Order).filter(Order.order_type == "takeaway").count()

    return {
        "today_revenue": round(today_rev, 2),
        "total_revenue": round(total_rev, 2),
        "total_orders": total_orders,
        "active_kitchen_orders": active_kitchen_orders,
        "average_ticket": avg_ticket,
        "low_stock_count": low_stock_count,
        "order_types": {
            "online_pickup": online_count,
            "dine_in": dine_in_count,
            "takeaway": takeaway_count,
        },
    }


@router.get("/sales-trend")
def get_sales_trend(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[Dict[str, Any]]:
    """Hourly sales trend data formatted directly for Recharts."""
    # Pre-populate hours 7 AM to 8 PM (Standard Cafe Hours)
    hours_map = {f"{h:02d}:00": {"hour": f"{h:02d}:00", "revenue": 0.0, "orders": 0} for h in range(7, 21)}

    orders = db.query(Order).filter(Order.status != "cancelled").all()
    for o in orders:
        h_str = f"{o.created_at.hour:02d}:00"
        if h_str in hours_map:
            hours_map[h_str]["revenue"] += o.total
            hours_map[h_str]["orders"] += 1

    result = list(hours_map.values())
    for r in result:
        r["revenue"] = round(r["revenue"], 2)
    return result


@router.get("/popular-items")
def get_popular_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[Dict[str, Any]]:
    """Top selling handcrafted beverages and food items."""
    results = (
        db.query(
            OrderItem.item_name,
            func.sum(OrderItem.quantity).label("total_sold"),
            func.sum(OrderItem.total_price).label("total_revenue"),
        )
        .group_by(OrderItem.item_name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(6)
        .all()
    )

    return [
        {
            "name": row[0],
            "total_sold": int(row[1]),
            "revenue": round(float(row[2]), 2),
        }
        for row in results
    ]
