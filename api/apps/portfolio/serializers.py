from rest_framework import serializers
from .models import Profile, Stat, SkillGroup, Skill, Service, Project, TimelineItem, Testimonial

class RelativeImageField(serializers.ImageField):
    def to_representation(self, value):
        if not value:
            return None
        try:
            return value.url
        except AttributeError:
            return None

class RelativeFileField(serializers.FileField):
    def to_representation(self, value):
        if not value:
            return None
        try:
            return value.url
        except AttributeError:
            return None

class ProfileSerializer(serializers.ModelSerializer):
    photo = RelativeImageField(required=False, allow_null=True)
    resume = RelativeFileField(required=False, allow_null=True)

    class Meta:
        model = Profile
        fields = "__all__"

class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stat
        fields = "__all__"

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"

class SkillGroupSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()

    class Meta:
        model = SkillGroup
        fields = ("id", "name", "order", "visible", "skills")

    def get_skills(self, obj):
        # In admin context, can return all or filter visible based on query param
        request = self.context.get("request")
        qs = obj.skills.all()
        if request and not request.user.is_authenticated:
            qs = qs.filter(visible=True)
        return SkillSerializer(qs.order_by("order", "id"), many=True, context=self.context).data

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"

class ProjectSerializer(serializers.ModelSerializer):
    image = RelativeImageField(required=False, allow_null=True)

    class Meta:
        model = Project
        fields = "__all__"

class TimelineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimelineItem
        fields = "__all__"

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = "__all__"

class ReorderSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False,
        help_text="Tartiblangan ID lar ro'yxati"
    )
