from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.utils import hash_ip
from .models import ContactMessage
from .notifier_client import send_telegram_notification
from .serializers import ContactFormSerializer, ContactMessageSerializer
from .throttling import ContactRateThrottle

def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0].strip()
    else:
        ip = request.META.get("REMOTE_ADDR", "")
    return ip

class PublicContactView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [ContactRateThrottle]

    def post(self, request):
        serializer = ContactFormSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        client_ip = get_client_ip(request)
        ip_hash_str = hash_ip(client_ip)

        # 1. Save message as pending in database
        msg = ContactMessage.objects.create(
            name=data["name"],
            contact=data["contact"],
            message=data["message"],
            ip_hash=ip_hash_str,
            telegram_status="pending",
        )

        # 2. Call notifier after DB commit
        def notify():
            ok, err = send_telegram_notification(msg)
            if ok:
                msg.telegram_status = "sent"
                msg.error_message = ""
            else:
                msg.telegram_status = "failed"
                msg.error_message = err
            msg.save(update_fields=["telegram_status", "error_message"])

        transaction.on_commit(notify)

        return Response(
            {
                "status": "success",
                "message": "Xabaringiz muvaffaqiyatli qabul qilindi! Tez orada siz bilan bog'lanaman.",
                "id": msg.id,
            },
            status=status.HTTP_201_CREATED,
        )

class AdminContactMessageViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = ContactMessage.objects.all().order_by("-created_at")
    serializer_class = ContactMessageSerializer

    @action(detail=True, methods=["post"], url_path="resend")
    def resend(self, request, pk=None):
        msg = self.get_object()
        ok, err = send_telegram_notification(msg)
        if ok:
            msg.telegram_status = "sent"
            msg.error_message = ""
            msg.save(update_fields=["telegram_status", "error_message"])
            return Response(
                {"status": "success", "message": "Xabar Telegram orqali muvaffaqiyatli qayta yuborildi."},
                status=status.HTTP_200_OK,
            )
        else:
            msg.telegram_status = "failed"
            msg.error_message = err
            msg.save(update_fields=["telegram_status", "error_message"])
            return Response(
                {"status": "error", "message": f"Telegramga yuborishda xatolik yuz berdi: {err}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

    @action(detail=False, methods=["get"], url_path="unread-count")
    def unread_count(self, request):
        count = ContactMessage.objects.filter(is_read=False).count()
        return Response({"unread_count": count}, status=status.HTTP_200_OK)
