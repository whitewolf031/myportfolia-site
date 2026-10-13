from django.db import models
from django.utils.text import slugify

from apps.common.utils import profile_photo_path, profile_resume_path, project_image_path
from apps.common.validators import validate_image_file, validate_pdf_file

class Profile(models.Model):
    full_name = models.CharField(max_length=150, default="Sardorbek Ergashev", verbose_name="To'liq ism")
    headline = models.CharField(
        max_length=255,
        default="Backend dasturchi. Python va Django bilan ishonchli tizimlar, Telegram botlar va admin panellar yarataman.",
        verbose_name="Sarlavha",
    )
    short_bio = models.TextField(
        default="[O'zingiz haqingizda 2-3 jumla]",
        verbose_name="Qisqa bio",
    )
    photo = models.ImageField(
        upload_to=profile_photo_path,
        validators=[validate_image_file],
        null=True,
        blank=True,
        verbose_name="Rasm",
    )
    resume = models.FileField(
        upload_to=profile_resume_path,
        validators=[validate_pdf_file],
        null=True,
        blank=True,
        verbose_name="Rezyume (PDF)",
    )
    open_to_work = models.BooleanField(
        default=True,
        verbose_name="Yangi loyihalar uchun ochiq",
    )
    email = models.CharField(max_length=150, default="[Email]", verbose_name="Email")
    telegram_username = models.CharField(max_length=100, default="@Sardorbek_Ergashev", verbose_name="Telegram")
    github_url = models.CharField(max_length=255, default="[Havola]", verbose_name="GitHub")
    linkedin_url = models.CharField(max_length=255, default="[Havola]", verbose_name="LinkedIn")

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Profil"
        verbose_name_plural = "Profil"

    def __str__(self):
        return self.full_name

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

class Stat(models.Model):
    value = models.CharField(max_length=50, default="[0]+", verbose_name="Ko'rsatkich qiymati")
    label = models.CharField(max_length=100, default="[Yil tajriba]", verbose_name="Izoh/Nomi")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    visible = models.BooleanField(default=True, verbose_name="Ko'rsatilsin")

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Statistika"
        verbose_name_plural = "Statistikalar"

    def __str__(self):
        return f"{self.value} - {self.label}"

class SkillGroup(models.Model):
    name = models.CharField(max_length=100, verbose_name="Guruh nomi")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    visible = models.BooleanField(default=True, verbose_name="Ko'rsatilsin")

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Ko'nikma guruhi"
        verbose_name_plural = "Ko'nikma guruhlari"

    def __str__(self):
        return self.name

class Skill(models.Model):
    group = models.ForeignKey(SkillGroup, related_name="skills", on_delete=models.CASCADE, verbose_name="Guruh")
    name = models.CharField(max_length=100, verbose_name="Ko'nikma nomi")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    visible = models.BooleanField(default=True, verbose_name="Ko'rsatilsin")

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Ko'nikma"
        verbose_name_plural = "Ko'nikmalar"

    def __str__(self):
        return f"{self.group.name}: {self.name}"

class Service(models.Model):
    title = models.CharField(max_length=150, verbose_name="Xizmat nomi")
    description = models.TextField(verbose_name="Tavsif")
    icon_name = models.CharField(max_length=50, blank=True, verbose_name="Belgi (ixtiyoriy)")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    visible = models.BooleanField(default=True, verbose_name="Ko'rsatilsin")

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Xizmat"
        verbose_name_plural = "Xizmatlar"

    def __str__(self):
        return self.title

class Project(models.Model):
    title = models.CharField(max_length=150, verbose_name="Loyiha nomi")
    slug = models.SlugField(max_length=160, blank=True, unique=True, verbose_name="Slug")
    description = models.TextField(verbose_name="Tavsif")
    technologies = models.CharField(max_length=255, verbose_name="Texnologiyalar (vergul bilan)")
    image = models.ImageField(
        upload_to=project_image_path,
        validators=[validate_image_file],
        null=True,
        blank=True,
        verbose_name="Rasm",
    )
    link_url = models.CharField(max_length=255, blank=True, verbose_name="Loyiha havolasi")
    repo_url = models.CharField(max_length=255, blank=True, verbose_name="Repozitoriy havolasi")
    visible = models.BooleanField(default=True, verbose_name="Saytda ko'rsatilsin")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Loyiha"
        verbose_name_plural = "Loyihalar"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "project"
            slug = base_slug
            counter = 1
            while Project.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

class TimelineItem(models.Model):
    KIND_CHOICES = (
        ("experience", "Tajriba"),
        ("education", "Ta'lim"),
    )
    kind = models.CharField(max_length=20, choices=KIND_CHOICES, default="experience", verbose_name="Turi")
    title = models.CharField(max_length=150, verbose_name="Lavozim yoki O'quv yurti")
    organization = models.CharField(max_length=150, blank=True, verbose_name="Kompaniya yoki Yo'nalish")
    start = models.CharField(max_length=50, verbose_name="Boshlanish vaqti")
    end = models.CharField(max_length=50, blank=True, null=True, verbose_name="Tugash vaqti (bo'sh bo'lsa Hozir)")
    description = models.TextField(blank=True, verbose_name="Tavsif")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    visible = models.BooleanField(default=True, verbose_name="Ko'rsatilsin")

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Yo'lim (Tajriba / Ta'lim)"
        verbose_name_plural = "Yo'lim (Tajriba / Ta'lim)"

    def __str__(self):
        return f"[{self.get_kind_display()}] {self.title}"

class Testimonial(models.Model):
    author = models.CharField(max_length=150, verbose_name="Mijoz ismi-familiyasi")
    role_company = models.CharField(max_length=150, verbose_name="Lavozim, kompaniya")
    quote = models.TextField(verbose_name="Fikr")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    visible = models.BooleanField(default=True, verbose_name="Ko'rsatilsin")

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Fikr"
        verbose_name_plural = "Fikrlar"

    def __str__(self):
        return f"{self.author} - {self.role_company}"
