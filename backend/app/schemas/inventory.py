from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class InventoryItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    sku: str = Field(..., min_length=1, max_length=50)
    category: str
    current_stock: float = Field(default=0.0, ge=0.0)
    unit: str = Field(..., min_length=1, max_length=30)
    reorder_threshold: float = Field(default=5.0, ge=0.0)
    cost_per_unit: float = Field(default=0.0, ge=0.0)
    supplier: Optional[str] = None


class InventoryItemCreate(InventoryItemBase):
    pass


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    current_stock: Optional[float] = Field(default=None, ge=0.0)
    unit: Optional[str] = None
    reorder_threshold: Optional[float] = Field(default=None, ge=0.0)
    cost_per_unit: Optional[float] = Field(default=None, ge=0.0)
    supplier: Optional[str] = None


class StockAdjustment(BaseModel):
    quantity_change: float # Positive to restock, negative to deduct
    reason: Optional[str] = "Manual restock"


class InventoryItemResponse(InventoryItemBase):
    id: str
    is_low_stock: bool
    last_restocked_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
