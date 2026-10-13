from rest_framework import serializers
from apps.common.utils import strip_html
from .models import ContactMessage

class ContactFormSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=80, required=True, trim_whitespace=True)
    contact = serializers.CharField(max_length=120, required=True, trim_whitespace=True)
    message = serializers.CharField(min_length=10, max_length=2000, required=True, trim_whitespace=True)
    # Honeypot field
    website = serializers.CharField(required=False, allow_blank=True, default="")

    def validate_name(self, value):
        clean = strip_html(value)
        if not clean:
            raise serializers.ValidationError("Ismingizni kiriting.")
        if len(clean) > 80:
            raise serializers.ValidationError("Ism 80 belgidan oshmasligi kerak.")
        return clean

    def validate_contact(self, value):
        clean = strip_html(value)
        if not clean:
            raise serializers.ValidationError("Telegram yoki emailingizni kiriting.")
        if len(clean) > 120:
            raise serializers.ValidationError("Aloqa ma'lumoti 120 belgidan oshmasligi kerak.")
        return clean

    def validate_message(self, value):
        clean = strip_html(value)
        if len(clean) < 10:
            raise serializers.ValidationError("Xabar matni kamida 10 ta belgidan iborat bo'lishi kerak.")
        if len(clean) > 2000:
            raise serializers.ValidationError("Xabar matni 2000 belgidan oshmasligi kerak.")
        return clean

    def validate(self, attrs):
        # Honeypot check
        if attrs.get("website"):
            raise serializers.ValidationError({"website": "Spam aniqlandi."})
        return attrs

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = "__all__"
        read_only_fields = ("id", "ip_hash", "created_at", "telegram_status", "error_message")
