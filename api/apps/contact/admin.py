from django.contrib import admin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "contact", "telegram_status", "is_read", "created_at")
    list_filter = ("telegram_status", "is_read", "created_at")
    search_fields = ("name", "contact", "message")
    readonly_fields = ("created_at", "ip_hash", "telegram_status", "error_message")
