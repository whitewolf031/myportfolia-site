from django.db import models

class ContactMessage(models.Model):
    STATUS_CHOICES = (
        ("pending", "Kutilmoqda"),
        ("sent", "Yuborildi"),
        ("failed", "Xatolik"),
    )

    name = models.CharField(max_length=80, verbose_name="Ism")
    contact = models.CharField(max_length=120, verbose_name="Telegram yoki email")
    message = models.TextField(verbose_name="Xabar matni")
    ip_hash = models.CharField(max_length=64, blank=True, verbose_name="IP Hash")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Yuborilgan vaqt")
    is_read = models.BooleanField(default=False, verbose_name="O'qilgan")
    telegram_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
        verbose_name="Telegram holati",
    )
    error_message = models.TextField(blank=True, verbose_name="Xatolik xabari")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Kelgan xabar"
        verbose_name_plural = "Kelgan xabarlar"

    def __str__(self):
        return f"{self.name} ({self.contact}) - {self.get_telegram_status_display()}"
