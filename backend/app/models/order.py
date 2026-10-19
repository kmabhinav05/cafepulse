import uuid
from datetime import datetime, timezone
import random
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from app.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def generate_order_number() -> str:
    # e.g. CP-1084
    return f"CP-{random.randint(1000, 9999)}"


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    order_number = Column(String(20), unique=True, index=True, default=generate_order_number, nullable=False)
    
    # Types: 'online_pickup', 'dine_in', 'takeaway'
    order_type = Column(String(30), default="online_pickup", nullable=False, index=True)
    
    # Lifecycle: 'pending' -> 'preparing' -> 'ready' -> 'completed' -> 'cancelled'
    status = Column(String(30), default="pending", nullable=False, index=True)
    
    # Customer Details (Essential for online order & pickup)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(30), nullable=True)
    customer_email = Column(String(100), nullable=True)
    pickup_time = Column(String(50), nullable=True, default="ASAP (10-15 min)")
    notes = Column(Text, nullable=True)
    
    # Financials
    subtotal = Column(Float, default=0.0, nullable=False)
    tax = Column(Float, default=0.0, nullable=False)
    discount = Column(Float, default=0.0, nullable=False)
    total = Column(Float, default=0.0, nullable=False)
    
    # Payment info: 'card', 'cash', 'apple_pay', 'counter'
    payment_method = Column(String(30), default="card", nullable=False)
    payment_status = Column(String(30), default="paid", nullable=False) # 'paid', 'pending', 'refunded'
    
    # Optional staff member who rang up the order (null for online orders)
    created_by_user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
        order_by="OrderItem.id",
    )
    user = relationship("User")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    order_id = Column(
        String(36),
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    menu_item_id = Column(String(36), ForeignKey("menu_items.id"), nullable=True)
    item_name = Column(String(120), nullable=False)
    size_name = Column(String(60), nullable=True)
    unit_price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    total_price = Column(Float, nullable=False)
    notes = Column(String(250), nullable=True)

    order = relationship("Order", back_populates="items")
    modifiers = relationship(
        "OrderItemModifier",
        back_populates="order_item",
        cascade="all, delete-orphan",
    )


class OrderItemModifier(Base):
    __tablename__ = "order_item_modifiers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    order_item_id = Column(
        String(36),
        ForeignKey("order_items.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    modifier_name = Column(String(100), nullable=False)
    price_adjustment = Column(Float, default=0.0, nullable=False)

    order_item = relationship("OrderItem", back_populates="modifiers")
