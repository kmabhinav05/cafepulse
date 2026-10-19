import pytest


def get_token(client, email: str, password: str) -> str:
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    return response.json()["access_token"]


def test_customer_online_order_flow_and_tracking(client):
    # 1. Customer places online pickup order (no login required)
    order_payload = {
        "order_type": "online_pickup",
        "customer_name": "Maya Lin",
        "customer_phone": "(555) 345-6789",
        "pickup_time": "ASAP (10-15 min)",
        "notes": "Oat milk only please.",
        "payment_method": "apple_pay",
        "items": [
            {
                "item_name": "Cortado",
                "size_name": "Double (4oz)",
                "unit_price": 4.25,
                "quantity": 2,
                "modifiers": [
                    {"modifier_name": "Oat Milk (Oatly Barista)", "price_adjustment": 0.75}
                ],
            }
        ],
    }

    create_res = client.post("/api/orders", json=order_payload)
    assert create_res.status_code == 201
    order = create_res.json()
    assert order["customer_name"] == "Maya Lin"
    assert order["status"] == "pending"
    assert "order_number" in order
    order_num = order["order_number"]

    # Expected subtotal = (4.25 + 0.75) * 2 = 10.00
    assert order["subtotal"] == 10.00
    assert order["tax"] == 0.83
    assert order["total"] == 10.83

    # 2. Public Live Tracker Lookup
    track_res = client.get(f"/api/orders/track/{order_num}")
    assert track_res.status_code == 200
    tracked = track_res.json()
    assert tracked["customer_name"] == "Maya Lin"
    assert tracked["order_number"] == order_num

    # 3. Staff advances status to 'preparing'
    staff_token = get_token(client, "staff@test.com", "staffpass")
    update_res = client.patch(
        f"/api/orders/{order['id']}/status",
        json={"status": "preparing"},
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "preparing"

    # 4. Verify tracker reflects updated 'preparing' status
    track_res_2 = client.get(f"/api/orders/track/{order_num}")
    assert track_res_2.json()["status"] == "preparing"


def test_list_orders_authenticated(client):
    staff_token = get_token(client, "staff@test.com", "staffpass")
    res = client.get(
        "/api/orders",
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert res.status_code == 200
    orders = res.json()
    assert len(orders) >= 1
