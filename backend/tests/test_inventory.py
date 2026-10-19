def get_token(client, email: str, password: str) -> str:
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    return response.json()["access_token"]


def test_list_inventory(client):
    staff_token = get_token(client, "staff@test.com", "staffpass")
    res = client.get(
        "/api/inventory",
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert res.status_code == 200
    items = res.json()
    assert len(items) >= 4
    names = [i["name"] for i in items]
    assert any("Espresso Beans" in n for n in names)


def test_restock_inventory(client):
    staff_token = get_token(client, "staff@test.com", "staffpass")
    items = client.get(
        "/api/inventory",
        headers={"Authorization": f"Bearer {staff_token}"},
    ).json()
    test_item = items[0]
    initial_stock = test_item["current_stock"]

    # Adjust stock +5.0
    res = client.patch(
        f"/api/inventory/{test_item['id']}/adjust",
        json={"quantity_change": 5.0, "reason": "Fresh Delivery"},
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert res.status_code == 200
    updated = res.json()
    assert updated["current_stock"] == initial_stock + 5.0
