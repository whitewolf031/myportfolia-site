import logging
from typing import Tuple
from django.conf import settings
import httpx

logger = logging.getLogger(__name__)

def send_telegram_notification(message_obj) -> Tuple[bool, str]:
    """
    Sends message details to the internal notifier service.
    Returns (success: bool, error_msg: str).
    Never raises uncaught exceptions.
    """
    url = f"{settings.NOTIFIER_URL.rstrip('/')}/notify"
    headers = {
        "X-Internal-Key": settings.INTERNAL_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "name": message_obj.name,
        "contact": message_obj.contact,
        "message": message_obj.message,
        "created_at": message_obj.created_at.strftime("%Y-%m-%d %H:%M:%S") if message_obj.created_at else "",
    }

    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.post(url, json=payload, headers=headers)
            if response.status_code == 200:
                return True, ""
            else:
                err = f"Notifier status {response.status_code}: {response.text}"
                logger.error(err)
                return False, err
    except Exception as exc:
        err = f"Notifier connection error: {str(exc)}"
        logger.error(err)
        return False, err
