import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_admin
from app.models.user import User
from app.models.menu import (
    Category,
    MenuItem,
    ItemSize,
    ModifierGroup,
    ModifierOption,
)
from app.schemas.menu import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    CategoryWithCountResponse,
    MenuItemCreate,
    MenuItemUpdate,
    MenuItemResponse,
    MenuItemDetailResponse,
    AvailabilityToggleResponse,
    ModifierGroupCreate,
    ModifierGroupResponse,
    ModifierOptionCreate,
    ModifierOptionResponse,
)

router = APIRouter(prefix="/menu", tags=["Menu & Catalog"])


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_-]+", "-", text)


# ============================================================================
# 1. CATEGORY ENDPOINTS
# ============================================================================
@router.get("/categories", response_model=List[CategoryWithCountResponse])
def list_categories(
    include_inactive: bool = False,
    db: Session = Depends(get_db),
):
    """Retrieve all categories with their active item count."""
    query = db.query(Category)
    if not include_inactive:
        query = query.filter(Category.is_active == True)

    categories = query.order_by(Category.display_order, Category.name).all()

    result = []
    for cat in categories:
        count = (
            db.query(MenuItem)
            .filter(MenuItem.category_id == cat.id, MenuItem.is_available == True)
            .count()
        )
        cat_data = CategoryWithCountResponse(
            id=cat.id,
            name=cat.name,
            slug=cat.slug,
            description=cat.description,
            icon=cat.icon,
            display_order=cat.display_order,
            is_active=cat.is_active,
            created_at=cat.created_at,
            item_count=count,
        )
        result.append(cat_data)
    return result


@router.post(
    "/categories",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_category(
    payload: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Create a new category (Admin only)."""
    slug = payload.slug or slugify(payload.name)
    existing = db.query(Category).filter((Category.name == payload.name) | (Category.slug == slug)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category '{payload.name}' or slug '{slug}' already exists",
        )

    category = Category(
        name=payload.name,
        slug=slug,
        description=payload.description,
        icon=payload.icon or "coffee",
        display_order=payload.display_order,
        is_active=payload.is_active,
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: str,
    payload: CategoryUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Update category properties (Admin only)."""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    update_data = payload.model_dump(exclude_unset=True)
    if "name" in update_data and not update_data.get("slug"):
        update_data["slug"] = slugify(update_data["name"])

    for key, value in update_data.items():
        setattr(category, key, value)

    db.commit()
    db.refresh(category)
    return category


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Delete a category and its items (Admin only)."""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    db.delete(category)
    db.commit()
    return None


# ============================================================================
# 2. MENU ITEM ENDPOINTS
# ============================================================================
@router.get("/items", response_model=List[MenuItemResponse])
def list_menu_items(
    category_id: Optional[str] = None,
    q: Optional[str] = None,
    available_only: bool = False,
    db: Session = Depends(get_db),
):
    """Retrieve menu items with optional category filtering, availability, and search."""
    query = db.query(MenuItem).join(Category)

    if category_id:
        query = query.filter(MenuItem.category_id == category_id)

    if available_only:
        query = query.filter(MenuItem.is_available == True)

    if q:
        search_filter = f"%{q.strip()}%"
        query = query.filter(
            (MenuItem.name.ilike(search_filter))
            | (MenuItem.description.ilike(search_filter))
            | (Category.name.ilike(search_filter))
        )

    items = (
        query.options(joinedload(MenuItem.category), joinedload(MenuItem.sizes))
        .order_by(MenuItem.display_order, MenuItem.name)
        .all()
    )

    result = []
    for item in items:
        resp = MenuItemResponse(
            id=item.id,
            name=item.name,
            category_id=item.category_id,
            category_name=item.category.name if item.category else None,
            description=item.description,
            base_price=item.base_price,
            image_url=item.image_url,
            is_available=item.is_available,
            prep_time_minutes=item.prep_time_minutes,
            calories=item.calories,
            display_order=item.display_order,
            created_at=item.created_at,
            sizes=item.sizes,
        )
        result.append(resp)
    return result


@router.get("/items/{item_id}", response_model=MenuItemDetailResponse)
def get_menu_item(item_id: str, db: Session = Depends(get_db)):
    """Retrieve detailed item information including sizes and modifier groups."""
    item = (
        db.query(MenuItem)
        .options(
            joinedload(MenuItem.category),
            joinedload(MenuItem.sizes),
            joinedload(MenuItem.modifier_groups).joinedload(ModifierGroup.options),
        )
        .filter(MenuItem.id == item_id)
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found",
        )

    return MenuItemDetailResponse(
        id=item.id,
        name=item.name,
        category_id=item.category_id,
        category_name=item.category.name if item.category else None,
        description=item.description,
        base_price=item.base_price,
        image_url=item.image_url,
        is_available=item.is_available,
        prep_time_minutes=item.prep_time_minutes,
        calories=item.calories,
        display_order=item.display_order,
        created_at=item.created_at,
        sizes=item.sizes,
        modifier_groups=item.modifier_groups,
    )


@router.post(
    "/items",
    response_model=MenuItemResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_menu_item(
    payload: MenuItemCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Create a new menu item with optional size variations and modifier groups (Admin only)."""
    # Verify category exists
    cat = db.query(Category).filter(Category.id == payload.category_id).first()
    if not cat:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category does not exist",
        )

    item = MenuItem(
        name=payload.name,
        category_id=payload.category_id,
        description=payload.description,
        base_price=payload.base_price,
        image_url=payload.image_url,
        is_available=payload.is_available,
        prep_time_minutes=payload.prep_time_minutes,
        calories=payload.calories,
        display_order=payload.display_order,
    )

    # Attach sizes if provided
    if payload.sizes:
        for size_data in payload.sizes:
            size_obj = ItemSize(
                name=size_data.name,
                price_adjustment=size_data.price_adjustment,
            )
            item.sizes.append(size_obj)

    # Attach modifier groups if provided
    if payload.modifier_group_ids:
        mod_groups = (
            db.query(ModifierGroup)
            .filter(ModifierGroup.id.in_(payload.modifier_group_ids))
            .all()
        )
        item.modifier_groups = mod_groups

    db.add(item)
    db.commit()
    db.refresh(item)

    return MenuItemResponse(
        id=item.id,
        name=item.name,
        category_id=item.category_id,
        category_name=cat.name,
        description=item.description,
        base_price=item.base_price,
        image_url=item.image_url,
        is_available=item.is_available,
        prep_time_minutes=item.prep_time_minutes,
        calories=item.calories,
        display_order=item.display_order,
        created_at=item.created_at,
        sizes=item.sizes,
    )


@router.put("/items/{item_id}", response_model=MenuItemResponse)
def update_menu_item(
    item_id: str,
    payload: MenuItemUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Update menu item details (Admin only)."""
    item = (
        db.query(MenuItem)
        .options(joinedload(MenuItem.category), joinedload(MenuItem.sizes))
        .filter(MenuItem.id == item_id)
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found",
        )

    update_data = payload.model_dump(exclude_unset=True)
    mod_ids = update_data.pop("modifier_group_ids", None)

    for key, value in update_data.items():
        setattr(item, key, value)

    if mod_ids is not None:
        mod_groups = (
            db.query(ModifierGroup).filter(ModifierGroup.id.in_(mod_ids)).all()
        )
        item.modifier_groups = mod_groups

    db.commit()
    db.refresh(item)

    return MenuItemResponse(
        id=item.id,
        name=item.name,
        category_id=item.category_id,
        category_name=item.category.name if item.category else None,
        description=item.description,
        base_price=item.base_price,
        image_url=item.image_url,
        is_available=item.is_available,
        prep_time_minutes=item.prep_time_minutes,
        calories=item.calories,
        display_order=item.display_order,
        created_at=item.created_at,
        sizes=item.sizes,
    )


@router.patch(
    "/items/{item_id}/toggle-availability",
    response_model=AvailabilityToggleResponse,
)
def toggle_item_availability(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Instant 1-click availability toggle for baristas and managers."""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found",
        )

    item.is_available = not item.is_available
    db.commit()
    db.refresh(item)

    status_str = "In Stock" if item.is_available else "Sold Out"
    return AvailabilityToggleResponse(
        id=item.id,
        name=item.name,
        is_available=item.is_available,
        message=f"'{item.name}' is now marked as {status_str}",
    )


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_menu_item(
    item_id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Delete a menu item (Admin only)."""
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Menu item not found",
        )
    db.delete(item)
    db.commit()
    return None


# ============================================================================
# 3. MODIFIER GROUPS & OPTIONS
# ============================================================================
@router.get("/modifiers", response_model=List[ModifierGroupResponse])
def list_modifier_groups(db: Session = Depends(get_db)):
    """List all modifier groups with their options."""
    groups = (
        db.query(ModifierGroup)
        .options(joinedload(ModifierGroup.options))
        .order_by(ModifierGroup.name)
        .all()
    )
    return groups


@router.post(
    "/modifiers",
    response_model=ModifierGroupResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_modifier_group(
    payload: ModifierGroupCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """Create a new modifier group with initial options (Admin only)."""
    group = ModifierGroup(
        name=payload.name,
        min_selections=payload.min_selections,
        max_selections=payload.max_selections,
        is_required=payload.is_required,
    )
    for opt in payload.options:
        group.options.append(
            ModifierOption(
                name=opt.name,
                price_adjustment=opt.price_adjustment,
                is_available=opt.is_available,
            )
        )

    db.add(group)
    db.commit()
    db.refresh(group)
    return group
