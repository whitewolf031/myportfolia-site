from django.core.management.base import BaseCommand
from apps.portfolio.models import Profile, Stat, SkillGroup, Skill, Service, Project, TimelineItem, Testimonial

class Command(BaseCommand):
    help = "Seed initial placeholder data matching design and specs"

    def handle(self, *args, **options):
        # 1. Profile
        profile, created = Profile.objects.get_or_create(
            id=1,
            defaults={
                "full_name": "Sardorbek Ergashev",
                "headline": "Backend dasturchi. Python va Django bilan ishonchli tizimlar, Telegram botlar va admin panellar yarataman.",
                "short_bio": "[Yashash joyi haqida 2-3 jumla]",
                "open_to_work": True,
                "email": "[Email]",
                "telegram_username": "@Sardorbek_Ergashev",
                "github_url": "[Havola]",
                "linkedin_url": "[Havola]",
            },
        )
        if created:
            self.stdout.write("Created initial profile.")
        else:
            self.stdout.write("Profile already exists.")

        # 2. Stats
        if not Stat.objects.exists():
            stats = [
                {"value": "[0]+", "label": "[Yil tajriba]", "order": 0},
                {"value": "[0]+", "label": "[Loyiha]", "order": 1},
                {"value": "[0]+", "label": "[Mijoz]", "order": 2},
                {"value": "[0]+", "label": "[Telegram bot]", "order": 3},
            ]
            for s in stats:
                Stat.objects.create(**s, visible=True)
            self.stdout.write("Created initial stats.")

        # 3. Skills
        if not SkillGroup.objects.exists():
            groups = [
                ("Backend", ["Python", "Django", "DRF", "FastAPI"], 0),
                ("Ma'lumotlar bazasi", ["PostgreSQL", "Redis", "SQLite"], 1),
                ("Infratuzilma", ["Docker", "Linux", "Nginx", "Git"], 2),
                ("Frontend", ["React", "HTML/CSS"], 3),
            ]
            for g_name, skills, g_order in groups:
                group = SkillGroup.objects.create(name=g_name, order=g_order, visible=True)
                for s_order, s_name in enumerate(skills):
                    Skill.objects.create(group=group, name=s_name, order=s_order, visible=True)
            self.stdout.write("Created initial skill groups and skills.")

        # 4. Services
        if not Service.objects.exists():
            services = [
                {
                    "title": "Backend va API",
                    "description": "Django va DRF asosida tez va xavfsiz serverlar va mikroservislar.",
                    "order": 0,
                },
                {
                    "title": "Telegram botlar",
                    "description": "Avtomatlashtirish, to'lov va ma'lumotlar integratsiyasi bilan boyitilgan botlar.",
                    "order": 1,
                },
                {
                    "title": "Admin panellar",
                    "description": "Kompaniya boshqaruvi va hisobotlar uchun moslashuvchan, qulay panellar.",
                    "order": 2,
                },
            ]
            for s in services:
                Service.objects.create(**s, visible=True)
            self.stdout.write("Created initial services.")

        # 5. Projects
        if not Project.objects.exists():
            projects = [
                {
                    "title": "TalantHub",
                    "description": "Telegram orqali ish, xodim, ustoz va hamkor topish uchun e'lon platformasi.",
                    "technologies": "Python, aiogram, Django",
                    "link_url": "[loyiha havolasi]",
                    "visible": True,
                    "order": 0,
                },
                {
                    "title": "[Loyiha nomi]",
                    "description": "[Loyiha tavsifi 1-2 jumla]",
                    "technologies": "[Texnologiya]",
                    "link_url": "[loyiha havolasi]",
                    "visible": False,
                    "order": 1,
                },
                {
                    "title": "[Loyiha nomi]",
                    "description": "[Loyiha tavsifi 1-2 jumla]",
                    "technologies": "[Texnologiya]",
                    "link_url": "[loyiha havolasi]",
                    "visible": True,
                    "order": 2,
                },
            ]
            for p in projects:
                Project.objects.create(**p)
            self.stdout.write("Created initial projects.")

        # 6. Timeline (Experience & Education)
        if not TimelineItem.objects.exists():
            timeline_items = [
                {
                    "kind": "experience",
                    "title": "[Lavozim], [Kompaniya]",
                    "organization": "",
                    "start": "[Yil]",
                    "end": "Hozir",
                    "description": "[Asosiy vazifalar va natijalar haqida qisqacha]",
                    "order": 0,
                },
                {
                    "kind": "experience",
                    "title": "[Lavozim], [Kompaniya]",
                    "organization": "",
                    "start": "[Yil]",
                    "end": "[Yil]",
                    "description": "[Qisqa tavsif]",
                    "order": 1,
                },
                {
                    "kind": "education",
                    "title": "[O'quv yurti]",
                    "organization": "[Yo'nalish]",
                    "start": "[Yil]",
                    "end": "[Yil]",
                    "description": "[Tafsilotlar]",
                    "order": 0,
                },
                {
                    "kind": "education",
                    "title": "[Kurs yoki sertifikat]",
                    "organization": "[Tashkilot]",
                    "start": "[Yil]",
                    "end": None,
                    "description": "[Tafsilotlar]",
                    "order": 1,
                },
            ]
            for t in timeline_items:
                TimelineItem.objects.create(**t, visible=True)
            self.stdout.write("Created initial timeline items.")

        # 7. Testimonials
        if not Testimonial.objects.exists():
            testimonials = [
                {
                    "author": "[Ism-familiya]",
                    "role_company": "[Lavozim, kompaniya]",
                    "quote": "[Mijoz yoki hamkorning fikri: 1-2 jumla.]",
                    "order": 0,
                },
                {
                    "author": "[Ism-familiya]",
                    "role_company": "[Lavozim, kompaniya]",
                    "quote": "[Mijoz yoki hamkorning fikri: 1-2 jumla.]",
                    "order": 1,
                },
            ]
            for t in testimonials:
                Testimonial.objects.create(**t, visible=True)
            self.stdout.write("Created initial testimonials.")

        self.stdout.write(self.style.SUCCESS("All seed data checks completed successfully."))
