from sqlalchemy.orm import Session
from app.models.menu import (
    Category,
    MenuItem,
    ItemSize,
    ModifierGroup,
    ModifierOption,
)


def seed_menu_catalog(db: Session):
    """Seed authentic cafe menu categories, items, sizes, and modifier groups."""
    print("Checking menu catalog...")

    # Check if categories already exist
    existing_cat = db.query(Category).first()
    if existing_cat:
        print("Menu catalog already seeded. Skipping...")
        return

    print("Seeding modifier groups...")
    # 1. Milk Options
    milk_group = ModifierGroup(
        name="Milk Alternative",
        min_selections=0,
        max_selections=1,
        is_required=False,
    )
    milk_group.options = [
        ModifierOption(name="Whole Milk", price_adjustment=0.0),
        ModifierOption(name="Oat Milk (Oatly Barista)", price_adjustment=0.75),
        ModifierOption(name="Almond Milk", price_adjustment=0.75),
        ModifierOption(name="Soy Milk", price_adjustment=0.60),
    ]

    # 2. Espresso Extraction
    espresso_group = ModifierGroup(
        name="Espresso Extraction",
        min_selections=0,
        max_selections=1,
        is_required=False,
    )
    espresso_group.options = [
        ModifierOption(name="Standard Double Shot", price_adjustment=0.0),
        ModifierOption(name="Extra Double Shot", price_adjustment=1.20),
        ModifierOption(name="Decaf (Swiss Water Process)", price_adjustment=0.0),
        ModifierOption(name="Ristretto (Short pull)", price_adjustment=0.0),
    ]

    # 3. Artisanal Syrups
    syrup_group = ModifierGroup(
        name="Artisanal Syrups & Sweeteners",
        min_selections=0,
        max_selections=2,
        is_required=False,
    )
    syrup_group.options = [
        ModifierOption(name="Madagascar Vanilla", price_adjustment=0.65),
        ModifierOption(name="Salted Sea Caramel", price_adjustment=0.65),
        ModifierOption(name="Roasted Hazelnut", price_adjustment=0.65),
        ModifierOption(name="Raw Wildflower Honey", price_adjustment=0.50),
    ]

    db.add_all([milk_group, espresso_group, syrup_group])
    db.flush()

    print("Seeding menu categories and items...")
    # Category 1: Hot Coffee & Espresso
    cat_coffee = Category(
        name="Hot Coffee & Espresso",
        slug="hot-coffee",
        description="Freshly ground, single-origin and house blend espresso drinks handcrafted with precision.",
        icon="coffee",
        display_order=1,
    )

    item_cortado = MenuItem(
        name="Cortado",
        description="Double shot of rich espresso cut with an equal part velvety steamed milk. Intense yet smooth.",
        base_price=4.25,
        prep_time_minutes=3,
        calories=80,
        display_order=1,
        sizes=[
            ItemSize(name="Single (3oz)", price_adjustment=-0.50),
            ItemSize(name="Double (4oz)", price_adjustment=0.0),
        ],
        modifier_groups=[milk_group, espresso_group],
    )

    item_flat_white = MenuItem(
        name="Flat White",
        description="Pure ristretto double shot topped with velvety micro-foam milk for a dense, silky texture.",
        base_price=4.75,
        prep_time_minutes=3,
        calories=120,
        display_order=2,
        sizes=[
            ItemSize(name="Regular (8oz)", price_adjustment=0.0),
            ItemSize(name="Large (12oz)", price_adjustment=0.75),
        ],
        modifier_groups=[milk_group, espresso_group, syrup_group],
    )

    item_cappuccino = MenuItem(
        name="Classic Cappuccino",
        description="Traditional equal parts espresso, hot milk, and a thick cushion of steamed foam with Dutch cocoa dusting.",
        base_price=4.50,
        prep_time_minutes=3,
        calories=110,
        display_order=3,
        sizes=[
            ItemSize(name="Regular (8oz)", price_adjustment=0.0),
            ItemSize(name="Large (12oz)", price_adjustment=0.65),
        ],
        modifier_groups=[milk_group, espresso_group],
    )

    item_latte = MenuItem(
        name="Caffe Latte",
        description="Subtle, balanced espresso enveloped in steamed milk with a light layer of micro-foam.",
        base_price=4.95,
        prep_time_minutes=3,
        calories=150,
        display_order=4,
        sizes=[
            ItemSize(name="Regular (12oz)", price_adjustment=0.0),
            ItemSize(name="Large (16oz)", price_adjustment=0.85),
        ],
        modifier_groups=[milk_group, espresso_group, syrup_group],
    )

    cat_coffee.items = [item_cortado, item_flat_white, item_cappuccino, item_latte]

    # Category 2: Cold Brew & Iced Drinks
    cat_iced = Category(
        name="Cold Brew & Iced",
        slug="cold-brew-iced",
        description="Slow-steeped 18-hour cold brews, chilled draft pours, and sparkling coffee refreshments.",
        icon="cup-soda",
        display_order=2,
    )

    item_nitro = MenuItem(
        name="Nitro Draft Cold Brew",
        description="Cascading micro-bubbles of pure nitrogen create a naturally sweet, stout-like head without added dairy.",
        base_price=5.50,
        prep_time_minutes=1,
        calories=5,
        display_order=1,
        sizes=[
            ItemSize(name="Regular (12oz)", price_adjustment=0.0),
            ItemSize(name="Large (16oz)", price_adjustment=0.80),
        ],
        modifier_groups=[syrup_group],
    )

    item_brown_sugar = MenuItem(
        name="Iced Brown Sugar Oat Latte",
        description="Shaken blonde espresso, organic brown sugar syrup, and cinnamon dust poured over ice and creamy oat milk.",
        base_price=6.25,
        prep_time_minutes=3,
        calories=180,
        display_order=2,
        sizes=[
            ItemSize(name="Regular (16oz)", price_adjustment=0.0),
            ItemSize(name="Large (24oz)", price_adjustment=0.90),
        ],
        modifier_groups=[espresso_group],
    )

    cat_iced.items = [item_nitro, item_brown_sugar]

    # Category 3: Artisan Teas & Botanicals
    cat_tea = Category(
        name="Artisan Teas & Botanicals",
        slug="artisan-teas",
        description="Single-origin whole leaf teas, botanical infusions, and ceremonial stone-ground matchas.",
        icon="leaf",
        display_order=3,
    )

    item_amber_tea = MenuItem(
        name="Golden Amber Herbal Tea",
        description="Steeped high-mountain amber herbal tea infused with fresh citrus lemon wheel and garden mint leaves.",
        base_price=4.60,
        prep_time_minutes=4,
        calories=35,
        display_order=1,
        sizes=[
            ItemSize(name="Regular (12oz)", price_adjustment=0.0),
            ItemSize(name="Large (16oz)", price_adjustment=0.60),
        ],
        modifier_groups=[syrup_group],
    )

    item_matcha = MenuItem(
        name="Kyoto Ceremonial Matcha",
        description="First-harvest ceremonial green tea from Uji, whisked to a jade froth with silky milk and honey.",
        base_price=5.90,
        prep_time_minutes=4,
        calories=140,
        display_order=2,
        sizes=[
            ItemSize(name="Regular (12oz)", price_adjustment=0.0),
            ItemSize(name="Large (16oz)", price_adjustment=0.75),
        ],
        modifier_groups=[milk_group, syrup_group],
    )

    cat_tea.items = [item_amber_tea, item_matcha]

    # Category 4: Fresh Bakery & Toast
    cat_bakery = Category(
        name="Bakery & Fresh Kitchen",
        slug="bakery-kitchen",
        description="Daily oven-baked French viennoiserie, sourdough toasts, and wholesome morning plates.",
        icon="cake",
        display_order=4,
    )

    item_croissant = MenuItem(
        name="Almond Frangipane Croissant",
        description="Flaky double-baked French butter croissant filled with almond crème and toasted California almonds.",
        base_price=4.85,
        prep_time_minutes=1,
        calories=380,
        display_order=1,
        sizes=[],
        modifier_groups=[],
    )

    item_toast = MenuItem(
        name="Avocado Sourdough Tartine",
        description="Poached egg, Haas avocado puree, micro-greens, chili crunch, and Maldon salt on toasted sourdough.",
        base_price=9.50,
        prep_time_minutes=5,
        calories=420,
        display_order=2,
        sizes=[],
        modifier_groups=[],
    )

    cat_bakery.items = [item_croissant, item_toast]

    db.add_all([cat_coffee, cat_iced, cat_tea, cat_bakery])
    db.commit()
    print("Menu catalog seeded successfully with categories and handcrafted items!")
