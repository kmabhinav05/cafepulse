def test_admin_can_list_users(client):
    # Login as admin
    admin_login = client.post(
        "/api/auth/login",
        json={"email": "admin@test.com", "password": "adminpass"},
    )
    token = admin_login.json()["access_token"]

    response = client.get(
        "/api/users",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 2


def test_staff_cannot_list_users(client):
    # Login as staff
    staff_login = client.post(
        "/api/auth/login",
        json={"email": "staff@test.com", "password": "staffpass"},
    )
    token = staff_login.json()["access_token"]

    response = client.get(
        "/api/users",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 403
    assert "Administrator access required" in response.json()["detail"]


def test_admin_can_create_user(client):
    admin_login = client.post(
        "/api/auth/login",
        json={"email": "admin@test.com", "password": "adminpass"},
    )
    token = admin_login.json()["access_token"]

    create_resp = client.post(
        "/api/users",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "full_name": "New Barista",
            "email": "barista@test.com",
            "password": "baristapass",
            "role": "staff",
            "is_active": True,
        },
    )
    assert create_resp.status_code == 201
    assert create_resp.json()["email"] == "barista@test.com"


def test_admin_cannot_deactivate_self(client):
    admin_login = client.post(
        "/api/auth/login",
        json={"email": "admin@test.com", "password": "adminpass"},
    )
    data = admin_login.json()
    token = data["access_token"]
    user_id = data["user_id"]

    toggle_resp = client.patch(
        f"/api/users/{user_id}/toggle-active",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert toggle_resp.status_code == 400
    assert "Cannot deactivate your own" in toggle_resp.json()["detail"]
