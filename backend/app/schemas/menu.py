from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# -------------------------------------------------------------
# 1. MODIFIER SCHEMAS
# -------------------------------------------------------------
class ModifierOptionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    price_adjustment: float = Field(default=0.0, ge=0.0)
    is_available: bool = True


class ModifierOptionCreate(ModifierOptionBase):
    pass


class ModifierOptionResponse(ModifierOptionBase):
    id: str
    modifier_group_id: str

    class Config:
        from_attributes = True


class ModifierGroupBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    min_selections: int = Field(default=0, ge=0)
    max_selections: int = Field(default=1, ge=1)
    is_required: bool = False


class ModifierGroupCreate(ModifierGroupBase):
    options: List[ModifierOptionCreate] = []


class ModifierGroupResponse(ModifierGroupBase):
    id: str
    options: List[ModifierOptionResponse] = []

    class Config:
        from_attributes = True


# -------------------------------------------------------------
# 2. SIZE SCHEMAS
# -------------------------------------------------------------
class ItemSizeBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=60)
    price_adjustment: float = Field(default=0.0, ge=-100.0)


class ItemSizeCreate(ItemSizeBase):
    pass


class ItemSizeResponse(ItemSizeBase):
    id: str
    menu_item_id: str

    class Config:
        from_attributes = True


# -------------------------------------------------------------
# 3. CATEGORY SCHEMAS
# -------------------------------------------------------------
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = "coffee"
    display_order: int = 0
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class CategoryResponse(CategoryBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class CategoryWithCountResponse(CategoryResponse):
    item_count: int = 0


# -------------------------------------------------------------
# 4. MENU ITEM SCHEMAS
# -------------------------------------------------------------
class MenuItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    category_id: str
    description: Optional[str] = None
    base_price: float = Field(..., ge=0.0)
    image_url: Optional[str] = None
    is_available: bool = True
    prep_time_minutes: int = Field(default=3, ge=1)
    calories: Optional[int] = Field(default=None, ge=0)
    display_order: int = 0


class MenuItemCreate(MenuItemBase):
    sizes: Optional[List[ItemSizeCreate]] = []
    modifier_group_ids: Optional[List[str]] = []


class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[float] = Field(default=None, ge=0.0)
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    prep_time_minutes: Optional[int] = Field(default=None, ge=1)
    calories: Optional[int] = Field(default=None, ge=0)
    display_order: Optional[int] = None
    modifier_group_ids: Optional[List[str]] = None


class MenuItemResponse(MenuItemBase):
    id: str
    created_at: datetime
    category_name: Optional[str] = None
    sizes: List[ItemSizeResponse] = []

    class Config:
        from_attributes = True


class MenuItemDetailResponse(MenuItemResponse):
    modifier_groups: List[ModifierGroupResponse] = []

    class Config:
        from_attributes = True


class AvailabilityToggleResponse(BaseModel):
    id: str
    name: str
    is_available: bool
    message: str
