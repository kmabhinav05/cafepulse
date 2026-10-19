from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class OrderItemModifierCreate(BaseModel):
    modifier_name: str
    price_adjustment: float = 0.0


class OrderItemModifierResponse(OrderItemModifierCreate):
    id: str

    class Config:
        from_attributes = True


class OrderItemCreate(BaseModel):
    menu_item_id: Optional[str] = None
    item_name: str
    size_name: Optional[str] = None
    unit_price: float = Field(..., ge=0.0)
    quantity: int = Field(default=1, ge=1)
    notes: Optional[str] = None
    modifiers: List[OrderItemModifierCreate] = []


class OrderItemResponse(OrderItemCreate):
    id: str
    total_price: float
    modifiers: List[OrderItemModifierResponse] = []

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    order_type: str = Field(default="online_pickup") # 'online_pickup', 'dine_in', 'takeaway'
    customer_name: str = Field(..., min_length=1, max_length=100)
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    pickup_time: Optional[str] = "ASAP (10-15 min)"
    notes: Optional[str] = None
    payment_method: str = Field(default="card")
    items: List[OrderItemCreate] = Field(..., min_items=1)
    discount: float = 0.0


class OrderStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(pending|preparing|ready|completed|cancelled)$")


class OrderResponse(BaseModel):
    id: str
    order_number: str
    order_type: str
    status: str
    customer_name: str
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    pickup_time: Optional[str] = None
    notes: Optional[str] = None
    subtotal: float
    tax: float
    discount: float
    total: float
    payment_method: str
    payment_status: str
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True


class OrderSummaryResponse(BaseModel):
    id: str
    order_number: str
    order_type: str
    status: str
    customer_name: str
    total: float
    items_count: int
    created_at: datetime
    pickup_time: Optional[str] = None
    payment_status: str

    class Config:
        from_attributes = True
