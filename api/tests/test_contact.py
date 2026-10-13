from unittest.mock import patch
import pytest
from apps.contact.models import ContactMessage

@pytest.mark.django_db
@patch("apps.contact.views.send_telegram_notification")
def test_contact_submission_success(mock_send, api_client):
    mock_send.return_value = (True, "")

    data = {
        "name": "Ali Valiyev",
        "contact": "@ali_valiyev",
        "message": "Salom, birgalikda yangi loyiha ustida ishlamoqchimiz.",
    }
    response = api_client.post("/api/contact/", data, format="json")
    assert response.status_code == 201
    assert ContactMessage.objects.count() == 1
    msg = ContactMessage.objects.first()
    assert msg.name == "Ali Valiyev"
    assert msg.contact == "@ali_valiyev"

@pytest.mark.django_db
def test_contact_honeypot_rejection(api_client):
    data = {
        "name": "Bot User",
        "contact": "bot@spam.com",
        "message": "This is spam message content here.",
        "website": "http://spamsite.com",
    }
    response = api_client.post("/api/contact/", data, format="json")
    assert response.status_code == 400
    assert ContactMessage.objects.count() == 0

@pytest.mark.django_db
def test_contact_validation_lengths(api_client):
    # Name too long
    response = api_client.post(
        "/api/contact/",
        {"name": "A" * 81, "contact": "valid@email.com", "message": "Valid long message here."},
        format="json",
    )
    assert response.status_code == 400

    # Message too short (< 10)
    response = api_client.post(
        "/api/contact/",
        {"name": "Valid Name", "contact": "valid@email.com", "message": "Short"},
        format="json",
    )
    assert response.status_code == 400

@pytest.mark.django_db
@patch("apps.contact.views.send_telegram_notification")
def test_contact_notifier_failure_preserves_message(mock_send, api_client):
    mock_send.return_value = (False, "Network connection timeout")

    data = {
        "name": "Hasan",
        "contact": "hasan@gmail.com",
        "message": "Bizga web ilova yaratish bo'yicha maslahat kerak.",
    }
    response = api_client.post("/api/contact/", data, format="json")
    # Message is still received successfully by user
    assert response.status_code == 201
    assert ContactMessage.objects.count() == 1

@pytest.mark.django_db
@patch("apps.contact.views.send_telegram_notification")
def test_admin_resend_telegram_message(mock_send, admin_client):
    msg = ContactMessage.objects.create(
        name="Test",
        contact="test@example.com",
        message="Test message content",
        telegram_status="failed",
        error_message="Previous error",
    )
    mock_send.return_value = (True, "")

    resp = admin_client.post(f"/api/contact/admin/messages/{msg.id}/resend/")
    assert resp.status_code == 200
    msg.refresh_from_db()
    assert msg.telegram_status == "sent"
    assert msg.error_message == ""
