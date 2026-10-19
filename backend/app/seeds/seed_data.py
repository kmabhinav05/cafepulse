from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.user import User


def seed_users(db: Session):
    """Seed demo admin and staff users if they don't already exist."""
    print("Checking demo users...")
    
    # 1. Admin User
    admin = db.query(User).filter(User.email == settings.DEMO_ADMIN_EMAIL.lower()).first()
    if not admin:
        print(f"Creating demo admin user: {settings.DEMO_ADMIN_EMAIL}")
        admin = User(
            email=settings.DEMO_ADMIN_EMAIL.lower(),
            password_hash=hash_password(settings.DEMO_ADMIN_PASSWORD),
            full_name="Sarah Miller (Manager)",
            role="admin",
            is_active=True,
        )
        db.add(admin)
    else:
        print(f"Demo admin user already exists: {settings.DEMO_ADMIN_EMAIL}")

    # 2. Staff User
    staff = db.query(User).filter(User.email == settings.DEMO_STAFF_EMAIL.lower()).first()
    if not staff:
        print(f"Creating demo staff user: {settings.DEMO_STAFF_EMAIL}")
        staff = User(
            email=settings.DEMO_STAFF_EMAIL.lower(),
            password_hash=hash_password(settings.DEMO_STAFF_PASSWORD),
            full_name="Liam Chen (Barista)",
            role="staff",
            is_active=True,
        )
        db.add(staff)
    else:
        print(f"Demo staff user already exists: {settings.DEMO_STAFF_EMAIL}")

    db.commit()
    print("User seed completed successfully!")


from app.seeds.menu_seed import seed_menu_catalog
from app.seeds.inventory_orders_seed import seed_inventory_and_orders


def init_db():
    """Create all tables and seed default users, menu catalog, inventory, and orders."""
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_users(db)
        seed_menu_catalog(db)
        seed_inventory_and_orders(db)
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
