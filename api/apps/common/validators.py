import os
from django.core.exceptions import ValidationError
from PIL import Image

MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024  # 3MB
MAX_PDF_SIZE_BYTES = 5 * 1024 * 1024    # 5MB

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_IMAGE_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}

def validate_image_file(file):
    if file.size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationError("Rasm hajmi 3MB dan oshmasligi kerak.")

    ext = os.path.splitext(file.name)[1].lower()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValidationError(f"Faqat JPG, PNG va WEBP formatidagi rasmlar qabul qilinadi. (Kiritilgan: {ext})")

    content_type = getattr(file, "content_type", None)
    if content_type and content_type not in ALLOWED_IMAGE_MIME_TYPES:
        raise ValidationError(f"Yaroqsiz rasm MIME turi: {content_type}")

    # Verify actual image content with Pillow
    try:
        file.seek(0)
        img = Image.open(file)
        img.verify()
        file.seek(0)
    except Exception as e:
        raise ValidationError("Fayl buzilgan yoki haqiqiy rasm formati emas.") from e

def validate_pdf_file(file):
    if file.size > MAX_PDF_SIZE_BYTES:
        raise ValidationError("Rezyume PDF hajmi 5MB dan oshmasligi kerak.")

    ext = os.path.splitext(file.name)[1].lower()
    if ext != ".pdf":
        raise ValidationError(f"Faqat PDF formati qabul qilinadi. (Kiritilgan: {ext})")

    content_type = getattr(file, "content_type", None)
    if content_type and content_type != "application/pdf":
        raise ValidationError(f"Yaroqsiz PDF MIME turi: {content_type}")
