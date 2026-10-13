from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Profile, Project, Service, Skill, SkillGroup, Stat, Testimonial, TimelineItem
from .serializers import (
    ProfileSerializer,
    ProjectSerializer,
    ReorderSerializer,
    ServiceSerializer,
    SkillGroupSerializer,
    SkillSerializer,
    StatSerializer,
    TestimonialSerializer,
    TimelineItemSerializer,
)

class PublicPortfolioView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        profile = Profile.load()
        stats = Stat.objects.filter(visible=True).order_by("order", "id")
        skill_groups = SkillGroup.objects.filter(visible=True).order_by("order", "id")
        services = Service.objects.filter(visible=True).order_by("order", "id")
        projects = Project.objects.filter(visible=True).order_by("order", "id")
        timeline = TimelineItem.objects.filter(visible=True).order_by("order", "id")
        testimonials = Testimonial.objects.filter(visible=True).order_by("order", "id")

        data = {
            "profile": ProfileSerializer(profile, context={"request": request}).data,
            "stats": StatSerializer(stats, many=True, context={"request": request}).data,
            "skill_groups": SkillGroupSerializer(skill_groups, many=True, context={"request": request}).data,
            "services": ServiceSerializer(services, many=True, context={"request": request}).data,
            "projects": ProjectSerializer(projects, many=True, context={"request": request}).data,
            "timeline": TimelineItemSerializer(timeline, many=True, context={"request": request}).data,
            "testimonials": TestimonialSerializer(testimonials, many=True, context={"request": request}).data,
        }
        return Response(data, status=status.HTTP_200_OK)

class ReorderMixin:
    @action(detail=False, methods=["patch"], url_path="reorder")
    def reorder(self, request):
        serializer = ReorderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ids = serializer.validated_data["ids"]
        model = self.get_queryset().model

        with transaction.atomic():
            for index, item_id in enumerate(ids):
                model.objects.filter(id=item_id).update(order=index)

        return Response(
            {"status": "success", "message": "Tartib muvaffaqiyatli saqlandi."},
            status=status.HTTP_200_OK,
        )

class AdminProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        profile = Profile.load()
        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return self._update(request)

    def patch(self, request):
        return self._update(request)

    def _update(self, request):
        profile = Profile.load()
        serializer = ProfileSerializer(
            profile, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminStatViewSet(ReorderMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Stat.objects.all().order_by("order", "id")
    serializer_class = StatSerializer

class AdminSkillGroupViewSet(ReorderMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = SkillGroup.objects.all().order_by("order", "id")
    serializer_class = SkillGroupSerializer

class AdminSkillViewSet(ReorderMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Skill.objects.all().order_by("order", "id")
    serializer_class = SkillSerializer

class AdminServiceViewSet(ReorderMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Service.objects.all().order_by("order", "id")
    serializer_class = ServiceSerializer

class AdminProjectViewSet(ReorderMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    queryset = Project.objects.all().order_by("order", "id")
    serializer_class = ProjectSerializer

class AdminTimelineItemViewSet(ReorderMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = TimelineItem.objects.all().order_by("order", "id")
    serializer_class = TimelineItemSerializer

class AdminTestimonialViewSet(ReorderMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Testimonial.objects.all().order_by("order", "id")
    serializer_class = TestimonialSerializer
