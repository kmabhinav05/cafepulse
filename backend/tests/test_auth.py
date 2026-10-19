def test_login_success(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@test.com", "password": "adminpass"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["role"] == "admin"
    assert data["email"] == "admin@test.com"


def test_login_invalid_password(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "admin@test.com", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_login_nonexistent_user(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "ghost@test.com", "password": "somepassword"},
    )
    assert response.status_code == 401


def test_get_current_user_profile(client):
    # First login to get token
    login_resp = client.post(
        "/api/auth/login",
        json={"email": "admin@test.com", "password": "adminpass"},
    )
    token = login_resp.json()["access_token"]

    # Call /api/auth/me
    me_resp = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "admin@test.com"
    assert me_resp.json()["role"] == "admin"


def test_refresh_token_flow(client):
    login_resp = client.post(
        "/api/auth/login",
        json={"email": "staff@test.com", "password": "staffpass"},
    )
    refresh_tok = login_resp.json()["refresh_token"]

    refresh_resp = client.post(
        "/api/auth/refresh",
        json={"refresh_token": refresh_tok},
    )
    assert refresh_resp.status_code == 200
    new_data = refresh_resp.json()
    assert "access_token" in new_data
    assert new_data["role"] == "staff"
