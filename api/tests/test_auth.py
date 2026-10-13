import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db
def test_login_success(api_client, admin_user):
    response = api_client.post(
        "/api/auth/login/",
        {"username": "admin_test", "password": "TestPassword123!"},
        format="json",
    )
    assert response.status_code == 200
    assert "access" in response.data
    assert "refresh" in response.data
    assert response.data["user"]["username"] == "admin_test"

@pytest.mark.django_db
def test_login_invalid_credentials(api_client, admin_user):
    response = api_client.post(
        "/api/auth/login/",
        {"username": "admin_test", "password": "WrongPassword!"},
        format="json",
    )
    assert response.status_code == 401

@pytest.mark.django_db
def test_token_refresh(api_client, admin_user):
    login_resp = api_client.post(
        "/api/auth/login/",
        {"username": "admin_test", "password": "TestPassword123!"},
        format="json",
    )
    refresh_token = login_resp.data["refresh"]

    refresh_resp = api_client.post(
        "/api/auth/refresh/",
        {"refresh": refresh_token},
        format="json",
    )
    assert refresh_resp.status_code == 200
    assert "access" in refresh_resp.data

@pytest.mark.django_db
def test_me_endpoint(api_client, admin_client):
    # Unauthenticated should fail
    anon_resp = api_client.get("/api/auth/me/")
    assert anon_resp.status_code == 401

    # Authenticated succeeds
    auth_resp = admin_client.get("/api/auth/me/")
    assert auth_resp.status_code == 200
    assert auth_resp.data["username"] == "admin_test"
