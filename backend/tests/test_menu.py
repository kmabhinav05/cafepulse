def get_token(client, email: str, password: str) -> str:
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    return response.json()["access_token"]


def test_list_categories(client):
    response = client.get("/api/menu/categories")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 4
    category_names = [c["name"] for c in data]
    assert "Hot Coffee & Espresso" in category_names


def test_list_menu_items_and_search(client):
    # 1. List all
    response = client.get("/api/menu/items")
    assert response.status_code == 200
    items = response.json()
    assert len(items) >= 8

    # 2. Search by query 'nitro'
    response_search = client.get("/api/menu/items?q=nitro")
    assert response_search.status_code == 200
    search_data = response_search.json()
    assert len(search_data) >= 1
    assert "Nitro Draft Cold Brew" in search_data[0]["name"]


def test_get_menu_item_detail(client):
    # Fetch Cortado
    items = client.get("/api/menu/items?q=Cortado").json()
    assert len(items) > 0
    cortado_id = items[0]["id"]

    detail_res = client.get(f"/api/menu/items/{cortado_id}")
    assert detail_res.status_code == 200
    detail = detail_res.json()
    assert detail["name"] == "Cortado"
    assert len(detail["sizes"]) >= 1
    assert len(detail["modifier_groups"]) >= 1


def test_toggle_availability(client):
    staff_token = get_token(client, "staff@test.com", "staffpass")
    items = client.get("/api/menu/items").json()
    test_item = items[0]
    initial_status = test_item["is_available"]

    # Toggle availability
    res = client.patch(
        f"/api/menu/items/{test_item['id']}/toggle-availability",
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert res.status_code == 200
    assert res.json()["is_available"] == (not initial_status)

    # Revert back to original status
    res_revert = client.patch(
        f"/api/menu/items/{test_item['id']}/toggle-availability",
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert res_revert.status_code == 200
    assert res_revert.json()["is_available"] == initial_status


def test_admin_create_menu_item_and_staff_forbidden(client):
    admin_token = get_token(client, "admin@test.com", "adminpass")
    staff_token = get_token(client, "staff@test.com", "staffpass")

    categories = client.get("/api/menu/categories").json()
    cat_id = categories[0]["id"]

    item_payload = {
        "name": "Single Origin Geisha Pour-Over",
        "category_id": cat_id,
        "description": "Panama Boquete jasmine floral notes with bergamot sweetness.",
        "base_price": 8.50,
        "prep_time_minutes": 5,
        "calories": 2,
        "is_available": True,
        "sizes": [{"name": "8oz Tasting Cup", "price_adjustment": 0.0}],
    }

    # Staff attempt should fail with 403 Forbidden
    res_staff = client.post(
        "/api/menu/items",
        json=item_payload,
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert res_staff.status_code == 403

    # Admin attempt should succeed with 201 Created
    res_admin = client.post(
        "/api/menu/items",
        json=item_payload,
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res_admin.status_code == 201
    created = res_admin.json()
    assert created["name"] == item_payload["name"]

    # Clean up created item
    del_res = client.delete(
        f"/api/menu/items/{created['id']}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert del_res.status_code == 204
