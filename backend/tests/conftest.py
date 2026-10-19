import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.core.database import Base, get_db
from app.core.security import hash_password
from app.models.user import User

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    # Seed test users
    admin = User(
        email="admin@test.com",
        password_hash=hash_password("adminpass"),
        full_name="Admin Test",
        role="admin",
        is_active=True,
    )
    staff = User(
        email="staff@test.com",
        password_hash=hash_password("staffpass"),
        full_name="Staff Test",
        role="staff",
        is_active=True,
    )
    db.add(admin)
    db.add(staff)
    db.commit()

    # Seed menu and inventory in test database
    from app.seeds.menu_seed import seed_menu_catalog
    from app.seeds.inventory_orders_seed import seed_inventory_and_orders
    seed_menu_catalog(db)
    seed_inventory_and_orders(db)

    db.close()
    yield
    Base.metadata.drop_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def client():
    return TestClient(app)
