from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import AdminContactMessageViewSet, PublicContactView

router = DefaultRouter()
router.register(r"messages", AdminContactMessageViewSet, basename="admin_messages")

urlpatterns = [
    path("", PublicContactView.as_view(), name="public_contact"),
    path("admin/", include(router.urls)),
]
