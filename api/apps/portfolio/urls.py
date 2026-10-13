from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminProfileView,
    AdminProjectViewSet,
    AdminServiceViewSet,
    AdminSkillGroupViewSet,
    AdminSkillViewSet,
    AdminStatViewSet,
    AdminTestimonialViewSet,
    AdminTimelineItemViewSet,
    PublicPortfolioView,
)

router = DefaultRouter()
router.register(r"stats", AdminStatViewSet, basename="admin_stats")
router.register(r"skill-groups", AdminSkillGroupViewSet, basename="admin_skill_groups")
router.register(r"skills", AdminSkillViewSet, basename="admin_skills")
router.register(r"services", AdminServiceViewSet, basename="admin_services")
router.register(r"projects", AdminProjectViewSet, basename="admin_projects")
router.register(r"timeline", AdminTimelineItemViewSet, basename="admin_timeline")
router.register(r"testimonials", AdminTestimonialViewSet, basename="admin_testimonials")

urlpatterns = [
    # Public aggregated endpoint
    path("portfolio/", PublicPortfolioView.as_view(), name="public_portfolio"),
    # Admin endpoints
    path("admin/profile/", AdminProfileView.as_view(), name="admin_profile"),
    path("admin/", include(router.urls)),
]
