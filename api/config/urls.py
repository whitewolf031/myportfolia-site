from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path

def health_check(request):
    return JsonResponse({"status": "healthy", "service": "api"})

urlpatterns = [
    # Django Built-in Admin
    path("django-admin/", admin.site.urls),
    # Health check
    path("api/health/", health_check, name="api_health"),
    # Auth endpoints
    path("api/auth/", include("apps.accounts.urls")),
    # Contact endpoints
    path("api/contact/", include("apps.contact.urls")),
    # Portfolio endpoints
    path("api/", include("apps.portfolio.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
