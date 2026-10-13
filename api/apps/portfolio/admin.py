from django.contrib import admin
from .models import Profile, Stat, SkillGroup, Skill, Service, Project, TimelineItem, Testimonial

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("full_name", "headline", "open_to_work", "updated_at")

@admin.register(Stat)
class StatAdmin(admin.ModelAdmin):
    list_display = ("label", "value", "order", "visible")
    list_editable = ("order", "visible")

class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1

@admin.register(SkillGroup)
class SkillGroupAdmin(admin.ModelAdmin):
    list_display = ("name", "order", "visible")
    list_editable = ("order", "visible")
    inlines = [SkillInline]

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "group", "order", "visible")
    list_editable = ("order", "visible")
    list_filter = ("group",)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "visible")
    list_editable = ("order", "visible")

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "technologies", "order", "visible")
    list_editable = ("order", "visible")
    prepopulated_fields = {"slug": ("title",)}

@admin.register(TimelineItem)
class TimelineItemAdmin(admin.ModelAdmin):
    list_display = ("title", "organization", "kind", "start", "end", "order", "visible")
    list_editable = ("order", "visible")
    list_filter = ("kind",)

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("author", "role_company", "order", "visible")
    list_editable = ("order", "visible")
