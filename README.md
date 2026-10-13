# Shaxsiy Portfolio Veb-sayti va Boshqaruv Paneli (Microservice Portfolio)

Ishlab chiquvchi (portfolio egasi) uchun mo'ljallangan, to'liq boshqariladigan admin paneli, zamonaviy dizaynga ega bir sahifali taqdimot va Telegram bot orqali xabarlarni yetkazuvchi mikroxizmatli portfolio platformasi.

---

## 1. Umumiy ko'rinish (Overview & Screenshots)

| Desktop (1440px) | Mobile (390px) | Admin Panel (Desktop) |
| :---: | :---: | :---: |
| ![Desktop Screenshot](docs/screenshots/desktop.png) | ![Mobile Screenshot](docs/screenshots/mobile.png) | ![Admin Screenshot](docs/screenshots/admin.png) |

Sayt barcha bo'limlari (Hero, Statistika, Ko'nikmalar, Xizmatlar, Loyihalar, Yo'lim / Tajriba va ta'lim, Mijozlar fikrlari va Aloqa) bilan to'liq dinamik boshqariladi. Bo'sh yoki yashirilgan bo'limlar jamoatchilik saytida avtomatik ravishda yashiriladi.

---

## 2. Arxitektura (Architecture Diagram)

Platforma Docker Compose yordamida izolyatsiyalangan mikroxizmatlar arxitekturasida ishlaydi. Faqatgina `gateway` (Nginx) xizmati tashqi tarmoqqa port (80) ochadi. Qolgan barcha xizmatlar ichki izolyatsiyalangan tarmoqlarda muloqot qiladi.

```mermaid
flowchart TD
    Client["Foydalanuvchi / Brauzer"] -->|Port 80 HTTP| GW["gateway (Nginx Reverse Proxy)"]

    subgraph Edge Network
        GW -->|/static, /media| VOL_STATIC[("Static & Media jildlari")]
        GW -->|/api/*, /django-admin/*| API["api (Django 5 + DRF)"]
        GW -->|/* (SPA Fallback)| FE["frontend (React 18 + Nginx)"]
    end

    subgraph Internal Network
        API -->|SQL queries| DB[("db (PostgreSQL 16)")]
        API -->|POST /notify + X-Internal-Key| NOTIFIER["notifier (FastAPI + aiogram 3)"]
    end

    NOTIFIER -->|Telegram Bot API / Webhook| TG["Telegram Serverlari (Bot)"]
    TG -->|Xabarlar| OWNER["Sayt Egasi (Telegram Chat)"]
```

---

## 3. Texnologiyalar to'plami (Tech Stack)

- **Gateway**: Nginx 1.27 (Gzip, xavfsizlik sarlavhalari, 6MB yuklash limiti, kesh boshqaruvi)
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v6, React Hook Form, Zod, Lucide React
- **API (Backend)**: Python 3.12, Django 5, Django REST Framework, SimpleJWT, Whitenoise, Gunicorn, PostgreSQL 16
- **Notifier**: Python 3.12, FastAPI, aiogram 3, Uvicorn, httpx (HTML-escape, 3 marta qayta urinish mexanizmi)
- **Ma'lumotlar bazasi**: PostgreSQL 16 (internal network, named volume)
- **Infratuzilma va CI**: Docker, Docker Compose, GitHub Actions, Pytest, Vitest

---

## 4. Repozitoriy tuzilishi (Repository Structure)

```text
portfolio/
├── gateway/                 # Nginx asosiy shlyuz konfiguratsiyasi va Dockerfile
│   ├── nginx.conf
│   └── Dockerfile
├── frontend/                # React 18 + Vite SPA ilovasi
│   ├── src/                 # Komponentlar, sahifalar, turlar, api klienti
│   ├── nginx.conf           # SPA fallback konfiguratsiyasi
│   └── Dockerfile           # Ko'p bosqichli (multi-stage) Dockerfile
├── api/                     # Django REST Framework loyihasi
│   ├── apps/                # accounts, portfolio, contact, common ilovalari
│   ├── config/              # settings.py, urls.py, wsgi.py
│   ├── tests/               # Pytest-django test to'plami
│   ├── entrypoint.sh        # DB kutish, migratsiya, superuser, seed data
│   └── Dockerfile
├── notifier/                # Telegram bot xabarnoma mikroxizmati
│   ├── main.py              # FastAPI + aiogram 3 ilovasi
│   ├── tests/               # Pytest async testlari
│   └── Dockerfile
├── docker-compose.yml       # Ishlab chiqarish (Production) konfiguratsiyasi
├── docker-compose.dev.yml   # Dasturchilar uchun (Hot reload) konfiguratsiyasi
├── .env.example             # Namunaviy muhit o'zgaruvchilari
├── Makefile                 # Qulay boshqaruv buyruqlari
└── README.md
```

---

## 5. Muhit o'zgaruvchilari (Environment Variables)

| O'zgaruvchi | Tavsif | Namunaviy qiymat |
| :--- | :--- | :--- |
| `POSTGRES_DB` | PostgreSQL ma'lumotlar bazasi nomi | `portfolio_db` |
| `POSTGRES_USER` | Bazaga ulanish foydalanuvchisi | `portfolio_user` |
| `POSTGRES_PASSWORD` | Bazaga ulanish maxfiy paroli | `strong_db_password_123` |
| `POSTGRES_HOST` | Baza serveri host nomi (Docker servis) | `db` |
| `POSTGRES_PORT` | Baza porti | `5432` |
| `DJANGO_SECRET_KEY` | Django xavfsizlik kaliti | `production_random_secret_key` |
| `DJANGO_DEBUG` | Dasturni tuzatish rejimi (False tavsiya etiladi) | `False` |
| `ALLOWED_HOSTS` | Ruxsat etilgan domen va hostlar | `localhost,127.0.0.1,gateway,api` |
| `CORS_ALLOWED_ORIGINS` | Ruxsat etilgan CORS domenlari | `http://localhost,http://127.0.0.1` |
| `DJANGO_SUPERUSER_USERNAME` | Admin panel login nomi | `admin` |
| `DJANGO_SUPERUSER_EMAIL` | Admin elektron pochta manzili | `admin@example.com` |
| `DJANGO_SUPERUSER_PASSWORD` | Admin boshlang'ich paroli | `AdminSecurePassword123!` |
| `TIME_ZONE` | Vaqt mintaqasi | `Asia/Tashkent` |
| `SITE_URL` | Saytning asosiy manzili | `http://localhost` |
| `INTERNAL_API_KEY` | API va Notifier o'rtasidagi maxfiy kalit | `random_64_bytes_secret_key` |
| `NOTIFIER_URL` | Ichki xabarnoma xizmati manzili | `http://notifier:8001` |
| `TELEGRAM_BOT_TOKEN` | @BotFather dan olingan bot tokeni | `123456789:ABCdefGh...` |
| `OWNER_CHAT_ID` | Sayt egasining Telegram chat ID raqami | `123456789` |
| `TELEGRAM_API_BASE` | Telegram API server manzili (testlar uchun) | `https://api.telegram.org` |

---

## 6. Tezkor ishga tushirish (Quick Start)

### Docker Compose orqali (Tavsiya etiladi):

1. Repozitoriyni klonlang va loyiha papkasiga kiring:
   ```bash
   git clone <repo-url>
   cd myportfolia-site
   ```
2. Muhit faylini yarating:
   ```bash
   cp .env.example .env
   ```
3. `.env` faylini ochib, kerakli o'zgaruvchilarni (xususan `TELEGRAM_BOT_TOKEN` va `OWNER_CHAT_ID`) kiriting.
4. Xizmatlarni to'liq quring va ishga tushiring:
   ```bash
   make up
   # yoki: docker compose up --build -d
   ```
5. Brauzerda quyidagi manzillarni oching:
   - **Ommaviy portfolio sayti**: [http://localhost](http://localhost)
   - **Boshqaruv paneli (Admin panel)**: [http://localhost/admin](http://localhost/admin)
   - **Django zaxira boshqaruv paneli**: [http://localhost/django-admin/](http://localhost/django-admin/)

---

## 7. Telegram Bot va OWNER_CHAT_ID ni sozlash

1. Telegramda [@BotFather](https://t.me/BotFather) botiga kiring va yangi bot yaratish uchun `/newbot` buyrug'ini yuboring.
2. Botga nom va username bering. Natijada berilgan tokenni `.env` faylidagi `TELEGRAM_BOT_TOKEN` qismiga yozing.
3. Yaratgan botingizga kiring va `/start` tugmasini bosing.
4. Notifier mikroxizmatining boti sizga sizning shaxsiy Chat ID raqamingizni javob tariqasida chiqarib beradi:
   > "Assalomu alaykum! Sizning chat ID raqamingiz: 123456789..."
5. Ushbu ID raqamni `.env` faylidagi `OWNER_CHAT_ID` o'zgaruvchisiga yozing va servisni qayta ishga tushiring:
   ```bash
   make restart
   ```
Endi saytdagi aloqa formasi orqali yuborilgan har qanday xabar zudlik bilan sizning Telegramingizga kelib tushadi!

---

## 8. Admin panelga kirish va kontentni boshqarish

1. Brauzerda [http://localhost/admin](http://localhost/admin) manziliga kiring.
2. Standart foydalanuvchi ma'lumotlarini kiriting:
   - **Login**: `.env` dagi `DJANGO_SUPERUSER_USERNAME` (standart: `admin`)
   - **Parol**: `.env` dagi `DJANGO_SUPERUSER_PASSWORD` (standart: `AdminSecurePassword123!`)
3. Boshqaruv imkoniyatlari:
   - **Men haqimda va rasm**: Shaxsiy ism, sarlavha, bio, rasm yuklash, PDF rezyume yuklash, "Yangi loyihalar uchun ochiqman" belgisi, 4 ta statistika raqamlarini tahrirlash.
   - **Loyihalar**: Loyihalarni qo'shish, rasmini yangilash, saytda ko'rsatish/yashirish, tartibini o'zgartirish, o'chirish.
   - **Ko'nikmalar**: Guruhlar va texnologiya teglarini boshqarish.
   - **Xizmatlar & Tajriba**: Xizmatlar ro'yxati, ish joylari va ta'lim bosqichlari.
   - **Fikrlar**: Mijozlar va hamkorlarning tavsiyanomalari.
   - **Kelgan xabarlar**: Sayt orqali kelgan murojaatlar, ularning Telegramga yetkazilganlik holati (`Yuborildi`, `Kutilmoqda`, `Xatolik`) va Telegramga qayta yuborish (`Qayta yuborish` tugmasi).

---

## 9. API Ma'lumotnomasi (API Reference)

| Metod | Manzil | Ruxsat | Tavsif |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health/` | Ommaviy | API holatini tekshirish |
| `GET` | `/api/portfolio/` | Ommaviy | Saytda ko'rinadigan barcha kontentni yagona paketda olish |
| `POST` | `/api/contact/` | Ommaviy (5/soat limit) | Aloqa formasidan xabar yuborish |
| `POST` | `/api/auth/login/` | Ommaviy | JWT token olish (Login) |
| `POST` | `/api/auth/refresh/`| Ommaviy | Access tokenni yangilash |
| `GET/PATCH` | `/api/admin/profile/` | Admin | Profil ma'lumotlari va fayllarni boshqarish |
| `GET/POST` | `/api/admin/projects/` | Admin | Loyihalar ro'yxati va yangi loyiha yaratish |
| `PATCH` | `/api/admin/projects/reorder/` | Admin | Loyihalar tartibini yangilash |
| `GET/DELETE` | `/api/admin/projects/<id>/` | Admin | Loyihani ko'rish va o'chirish |
| `GET` | `/api/contact/admin/messages/` | Admin | Kelgan xabarlar ro'yxati |
| `POST` | `/api/contact/admin/messages/<id>/resend/` | Admin | Xabarni Telegramga qayta yetkazish |

---

## 10. Testlarni ishga tushirish (Running Tests)

Barcha xizmatlar avtomatlashtirilgan testlar bilan ta'minlangan:

```bash
# Docker orqali barcha testlarni yurgizish:
make test

# Yoki alohida xizmatlar bo'yicha:
docker compose exec api pytest
docker compose exec notifier pytest
cd frontend && npm run test:run
```

---

## 11. Ishlab chiqarishga joylashtirish (Production Deployment)

1. Serveringizda (Ubuntu/Debian) Docker va Docker Compose o'rnating.
2. Fayllarni yuklang va `.env` faylida kuchli parollar, haqiqiy `DJANGO_SECRET_KEY`, `INTERNAL_API_KEY`, hamda `DJANGO_DEBUG=False` o'rnating.
3. Tashqi tarmoq xavfsizligi: Serveringizning faqat `80` va `443` portlarini ochiq qoldiring (masalan `ufw allow 80`, `ufw allow 443`). Baza va boshqa mikroxizmatlar portlari tashqariga chiqmaydi.
4. HTTPS (SSL sertifikati):
   - Caddy yoki Certbot (Nginx) yordamida domeningizga bepul Let's Encrypt sertifikatini ulang.
   - Namunaviy Caddy konfiguratsiyasi:
     ```caddy
     sizningdomeningiz.uz {
         reverse_proxy localhost:80
     }
     ```

---

## 12. Zaxira nusxa olish va tiklash (Backup & Restore)

### PostgreSQL zaxirasini olish:
```bash
docker compose exec -T db pg_dump -U portfolio_user portfolio_db > backup_$(date +%Y%m%d).sql
```

### PostgreSQL bazasini tiklash:
```bash
docker compose exec -T db psql -U portfolio_user portfolio_db < backup_20261013.sql
```

### Media fayllarni zaxiralash:
```bash
docker run --rm -v myportfolia-site_media:/media -v $(pwd):/backup alpine tar -czf /backup/media_backup.tar.gz /media
```

---

## 13. Muammolarni bartaraf etish (Troubleshooting)

- **Port 80 bandligi xatosi (`Bind for 0.0.0.0:80 failed`)**:
  Serveringizda Apache yoki boshqa Nginx ishlab turgan bo'lsa, uni to'xtating: `sudo systemctl stop nginx` yoki `sudo systemctl stop apache2`.
- **Telegramga xabarlar bormayapti**:
  1. `.env` faylidagi `TELEGRAM_BOT_TOKEN` va `OWNER_CHAT_ID` to'g'riligini tekshiring.
  2. Botingizga kirib, avval `/start` bosganingizga ishonch hosil qiling.
  3. `docker compose logs notifier` buyrug'i orqali xabarnoma xizmati loglarini ko'ring.
  4. Admin paneldagi "Kelgan xabarlar" bo'limida "Qayta yuborish" tugmasini bosib ko'ring.

---

## 14. Xulosa (O'zbek tilida qisqacha ma'lumot)

Ushbu portfolio tizimi to'liq ishlab chiqarishga tayyor (production-ready) arxitekturada barpo etilgan:
- Dizayn va ranglar palitrasi to'liq spetsifikatsiyadagi tokenlar (`#0B1736`, radial nurlar, Space Grotesk, IBM Plex Sans, JetBrains Mono) asosida tayyorlangan.
- Ommaviy sayt to'liq moslashuvchan (desktop 1440px va mobile 390px ekranlarda mukammal moslashadi).
- Admin panel orqali har qanday kontent (matnlar, rasmlar, rezyume, ko'nikmalar, loyihalar, fikrlar) o'zgartiriladi va saytda dinamik aks etadi.
- Aloqa formasidan xabar yuborilganda, sayt egasining Telegramiga zudlik bilan yetkaziladi va bazada saqlanadi.