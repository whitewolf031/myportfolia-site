from unittest.mock import AsyncMock, patch
import pytest
from httpx import ASGITransport, AsyncClient

from main import INTERNAL_API_KEY, app, bot_instance

@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy", "service": "notifier"}

@pytest.mark.asyncio
async def test_notify_unauthorized():
    payload = {
        "name": "Test User",
        "contact": "@testuser",
        "message": "Hello there!",
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Missing header
        res1 = await client.post("/notify", json=payload)
        assert res1.status_code == 401

        # Wrong header
        res2 = await client.post("/notify", json=payload, headers={"X-Internal-Key": "wrong-key"})
        assert res2.status_code == 401

@pytest.mark.asyncio
async def test_notify_success():
    payload = {
        "name": "Rustam",
        "contact": "+998901234567",
        "message": "Loyiha bo'yicha bog'laning <script>alert(1)</script>",
        "created_at": "2026-10-13 14:00:00",
    }
    headers = {"X-Internal-Key": INTERNAL_API_KEY}

    with patch.object(bot_instance, "send_message", new_callable=AsyncMock) as mock_send:
        mock_send.return_value = True

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/notify", json=payload, headers=headers)
            assert response.status_code == 200
            assert response.json()["status"] == "success"

            assert mock_send.call_count == 1
            call_args = mock_send.call_args[1]
            sent_text = call_args["text"]
            # Ensure script tag is escaped!
            assert "&lt;script&gt;alert(1)&lt;/script&gt;" in sent_text
            assert "Rustam" in sent_text

@pytest.mark.asyncio
async def test_notify_retry_and_eventual_failure():
    payload = {
        "name": "Olim",
        "contact": "@olim",
        "message": "Test retry behavior",
    }
    headers = {"X-Internal-Key": INTERNAL_API_KEY}

    with patch.object(bot_instance, "send_message", new_callable=AsyncMock) as mock_send:
        # Simulate network error on all 3 attempts
        mock_send.side_effect = Exception("Telegram connection failed")

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/notify", json=payload, headers=headers)
            assert response.status_code == 502
            assert mock_send.call_count == 3
