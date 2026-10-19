import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
    Table,
)
from sqlalchemy.orm import relationship
from app.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


# Association Table: Many-to-Many between MenuItem and ModifierGroup
menu_item_modifier_groups = Table(
    "menu_item_modifier_groups",
    Base.metadata,
    Column(
        "menu_item_id",
        String(36),
        ForeignKey("menu_items.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "modifier_group_id",
        String(36),
        ForeignKey("modifier_groups.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Category(Base):
    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False, unique=True, index=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True, default="coffee")
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    # Relationship to Items
    items = relationship(
        "MenuItem",
        back_populates="category",
        cascade="all, delete-orphan",
        order_by="MenuItem.display_order",
    )


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    category_id = Column(
        String(36),
        ForeignKey("categories.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String(120), nullable=False, index=True)
    description = Column(Text, nullable=True)
    base_price = Column(Float, nullable=False, default=0.0)
    image_url = Column(String(500), nullable=True)
    is_available = Column(Boolean, default=True, nullable=False)
    prep_time_minutes = Column(Integer, default=3, nullable=False)
    calories = Column(Integer, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    # Relationships
    category = relationship("Category", back_populates="items")
    sizes = relationship(
        "ItemSize",
        back_populates="menu_item",
        cascade="all, delete-orphan",
    )
    modifier_groups = relationship(
        "ModifierGroup",
        secondary=menu_item_modifier_groups,
        back_populates="menu_items",
    )


class ItemSize(Base):
    __tablename__ = "item_sizes"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    menu_item_id = Column(
        String(36),
        ForeignKey("menu_items.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String(60), nullable=False)  # e.g., "Regular", "Large"
    price_adjustment = Column(Float, default=0.0, nullable=False)

    menu_item = relationship("MenuItem", back_populates="sizes")


class ModifierGroup(Base):
    __tablename__ = "modifier_groups"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False, unique=True)
    min_selections = Column(Integer, default=0, nullable=False)
    max_selections = Column(Integer, default=1, nullable=False)
    is_required = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    # Relationships
    options = relationship(
        "ModifierOption",
        back_populates="group",
        cascade="all, delete-orphan",
    )
    menu_items = relationship(
        "MenuItem",
        secondary=menu_item_modifier_groups,
        back_populates="modifier_groups",
    )


class ModifierOption(Base):
    __tablename__ = "modifier_options"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    modifier_group_id = Column(
        String(36),
        ForeignKey("modifier_groups.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String(100), nullable=False)
    price_adjustment = Column(Float, default=0.0, nullable=False)
    is_available = Column(Boolean, default=True, nullable=False)

    group = relationship("ModifierGroup", back_populates="options")
