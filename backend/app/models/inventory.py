import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Float,
    DateTime,
)
from app.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(120), nullable=False, unique=True, index=True)
    sku = Column(String(50), nullable=False, unique=True, index=True)
    category = Column(String(50), nullable=False, index=True) # 'coffee_beans', 'dairy', 'syrups', 'packaging', 'tea'
    current_stock = Column(Float, nullable=False, default=0.0)
    unit = Column(String(30), nullable=False) # 'kg', 'liters', 'units', 'bottles'
    reorder_threshold = Column(Float, nullable=False, default=5.0)
    cost_per_unit = Column(Float, nullable=False, default=0.0)
    supplier = Column(String(100), nullable=True)
    last_restocked_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now, nullable=False)

    @property
    def is_low_stock(self) -> bool:
        return self.current_stock <= self.reorder_threshold
