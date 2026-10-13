import hashlib
import os
import re
import uuid

def profile_photo_path(instance, filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    return f"profile/{uuid.uuid4().hex}{ext}"

def profile_resume_path(instance, filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    return f"resume/{uuid.uuid4().hex}{ext}"

def project_image_path(instance, filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    return f"projects/{uuid.uuid4().hex}{ext}"

def strip_html(text: str) -> str:
    """Strip HTML tags from string to prevent XSS."""
    if not text:
        return ""
    clean = re.sub(r"<[^>]*?>", "", text)
    return clean.strip()

def hash_ip(ip_address: str) -> str:
    """Create SHA-256 hash of IP address for privacy-conscious tracking."""
    if not ip_address:
        return ""
    return hashlib.sha256(ip_address.encode("utf-8")).hexdigest()[:32]
