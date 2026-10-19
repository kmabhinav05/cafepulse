from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.inventory import InventoryItem
from app.models.order import Order, OrderItem, OrderItemModifier
from app.models.menu import MenuItem


def seed_inventory_and_orders(db: Session):
    """Seed baseline inventory stock and realistic live orders."""
    print("Checking inventory items...")
    existing_inv = db.query(InventoryItem).first()
    if not existing_inv:
        print("Seeding inventory raw materials...")
        inv_items = [
            InventoryItem(
                name="Espresso Beans (Guatemala Antigua)",
                sku="COF-GUA-01",
                category="coffee_beans",
                current_stock=18.5,
                unit="kg",
                reorder_threshold=5.0,
                cost_per_unit=22.0,
                supplier="Antigua Specialty Importers",
            ),
            InventoryItem(
                name="Single Origin Ethiopian Yirgacheffe",
                sku="COF-ETH-02",
                category="coffee_beans",
                current_stock=4.2,
                unit="kg",
                reorder_threshold=3.0,
                cost_per_unit=28.0,
                supplier="Red Sea Coffee Co.",
            ),
            InventoryItem(
                name="Oat Milk (Oatly Barista Edition)",
                sku="DAI-OAT-01",
                category="dairy",
                current_stock=24.0,
                unit="liters",
                reorder_threshold=8.0,
                cost_per_unit=3.25,
                supplier="Pacific Beverage Supply",
            ),
            InventoryItem(
                name="Whole Organic Milk (Clover Sonoma)",
                sku="DAI-WHL-02",
                category="dairy",
                current_stock=14.0,
                unit="liters",
                reorder_threshold=10.0,
                cost_per_unit=2.80,
                supplier="Local Sonoma Creamery",
            ),
            InventoryItem(
                name="Madagascar Vanilla Bean Syrup",
                sku="SYR-VAN-01",
                category="syrups",
                current_stock=4.0,
                unit="bottles",
                reorder_threshold=2.0,
                cost_per_unit=11.50,
                supplier="Monin Artisan",
            ),
            InventoryItem(
                name="Salted Sea Caramel Sauce",
                sku="SYR-CAR-02",
                category="syrups",
                current_stock=1.5, # LOW STOCK TRIGGER!
                unit="bottles",
                reorder_threshold=2.5,
                cost_per_unit=12.00,
                supplier="House Confectionery",
            ),
            InventoryItem(
                name="Biodegradable Hot Cups (12oz)",
                sku="PKG-CUP-12",
                category="packaging",
                current_stock=340.0,
                unit="units",
                reorder_threshold=100.0,
                cost_per_unit=0.14,
                supplier="EcoCup Solutions",
            ),
            InventoryItem(
                name="Biodegradable Cold Cups (16oz)",
                sku="PKG-CUP-16",
                category="packaging",
                current_stock=410.0,
                unit="units",
                reorder_threshold=100.0,
                cost_per_unit=0.18,
                supplier="EcoCup Solutions",
            ),
            InventoryItem(
                name="Uji Ceremonial Matcha Powder",
                sku="TEA-MAT-01",
                category="tea",
                current_stock=1.8,
                unit="kg",
                reorder_threshold=0.5,
                cost_per_unit=65.0,
                supplier="Kyoto Tea Masters",
            ),
            InventoryItem(
                name="High Mountain Golden Amber Tea",
                sku="TEA-AMB-02",
                category="tea",
                current_stock=3.2,
                unit="kg",
                reorder_threshold=1.0,
                cost_per_unit=38.0,
                supplier="Heritage Botanicals",
            ),
        ]
        db.add_all(inv_items)
        db.commit()
        print("Inventory items seeded successfully!")

    print("Checking sample orders...")
    existing_order = db.query(Order).first()
    if not existing_order:
        print("Seeding sample orders across kitchen lifecycle...")
        now = datetime.now(timezone.utc)

        # 1. Incoming Online Pickup Order (Status: Pending)
        order_online_1 = Order(
            order_number="CP-1042",
            order_type="online_pickup",
            status="pending",
            customer_name="Elena Rostova",
            customer_phone="(555) 234-8901",
            customer_email="elena.r@example.com",
            pickup_time="ASAP (10-15 min)",
            notes="Please make it extra hot. No plastic straw.",
            subtotal=11.10,
            tax=0.92,
            discount=0.0,
            total=12.02,
            payment_method="apple_pay",
            payment_status="paid",
            created_at=now - timedelta(minutes=6),
            items=[
                OrderItem(
                    item_name="Iced Brown Sugar Oat Latte",
                    size_name="Regular (16oz)",
                    unit_price=6.25,
                    quantity=1,
                    total_price=7.45,
                    modifiers=[
                        OrderItemModifier(modifier_name="Extra Double Shot", price_adjustment=1.20)
                    ],
                ),
                OrderItem(
                    item_name="Almond Frangipane Croissant",
                    unit_price=4.85,
                    quantity=1,
                    total_price=4.85,
                ),
            ],
        )

        # 2. Online Pickup Order in Kitchen (Status: Preparing)
        order_online_2 = Order(
            order_number="CP-1043",
            order_type="online_pickup",
            status="preparing",
            customer_name="Marcus Vance",
            customer_phone="(555) 412-9988",
            customer_email="marcus@vance.io",
            pickup_time="10:45 AM",
            subtotal=10.50,
            tax=0.87,
            discount=0.0,
            total=11.37,
            payment_method="card",
            payment_status="paid",
            created_at=now - timedelta(minutes=14),
            items=[
                OrderItem(
                    item_name="Cortado",
                    size_name="Double (4oz)",
                    unit_price=4.25,
                    quantity=1,
                    total_price=5.00,
                    modifiers=[
                        OrderItemModifier(modifier_name="Oat Milk (Oatly Barista)", price_adjustment=0.75)
                    ],
                ),
                OrderItem(
                    item_name="Nitro Draft Cold Brew",
                    size_name="Regular (12oz)",
                    unit_price=5.50,
                    quantity=1,
                    total_price=5.50,
                ),
            ],
        )

        # 3. In-Store POS Order Ready for Pickup (Status: Ready)
        order_dinein = Order(
            order_number="CP-1044",
            order_type="dine_in",
            status="ready",
            customer_name="Table 3 (Sophia & Dan)",
            subtotal=19.00,
            tax=1.57,
            discount=0.0,
            total=20.57,
            payment_method="card",
            payment_status="paid",
            created_at=now - timedelta(minutes=22),
            items=[
                OrderItem(
                    item_name="Golden Amber Herbal Tea",
                    size_name="Regular (12oz)",
                    unit_price=4.60,
                    quantity=1,
                    total_price=4.60,
                ),
                OrderItem(
                    item_name="Kyoto Ceremonial Matcha",
                    size_name="Regular (12oz)",
                    unit_price=5.90,
                    quantity=1,
                    total_price=5.90,
                ),
                OrderItem(
                    item_name="Avocado Sourdough Tartine",
                    unit_price=9.50,
                    quantity=1,
                    total_price=9.50,
                ),
            ],
        )

        # 4. Completed Order Earlier Today
        order_completed = Order(
            order_number="CP-1040",
            order_type="takeaway",
            status="completed",
            customer_name="Julian K.",
            subtotal=9.50,
            tax=0.78,
            discount=0.0,
            total=10.28,
            payment_method="card",
            payment_status="paid",
            created_at=now - timedelta(hours=2),
            items=[
                OrderItem(
                    item_name="Flat White",
                    size_name="Regular (8oz)",
                    unit_price=4.75,
                    quantity=2,
                    total_price=9.50,
                ),
            ],
        )

        db.add_all([order_online_1, order_online_2, order_dinein, order_completed])
        db.commit()
        print("Sample orders seeded successfully across kitchen lifecycle!")
