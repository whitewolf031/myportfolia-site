import os
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-replace-this-in-production-with-a-random-secret-key-32chars",
)

DEBUG = os.environ.get("DJANGO_DEBUG", "False").lower() in ("true", "1", "t", "yes")

allowed_hosts_env = os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1,gateway,api")
ALLOWED_HOSTS = [h.strip() for h in allowed_hosts_env.split(",") if h.strip()]
if not ALLOWED_HOSTS:
    ALLOWED_HOSTS = ["localhost", "127.0.0.1", "gateway", "api"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    # Third-party
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    # Local apps
    "apps.accounts",
    "apps.portfolio",
    "apps.contact",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# Database
DB_NAME = os.environ.get("POSTGRES_DB")
if DB_NAME:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": DB_NAME,
            "USER": os.environ.get("POSTGRES_USER", "portfolio_user"),
            "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "portfolio_secure_password_change_me"),
            "HOST": os.environ.get("POSTGRES_HOST", "db"),
            "PORT": os.environ.get("POSTGRES_PORT", "5432"),
            "CONN_MAX_AGE": 60,
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "uz"
TIME_ZONE = os.environ.get("TIME_ZONE", "Asia/Tashkent")
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Media files
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Max upload sizes: 6MB request body limit
DATA_UPLOAD_MAX_MEMORY_SIZE = 6 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = 6 * 1024 * 1024

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS configuration
cors_origins_env = os.environ.get("CORS_ALLOWED_ORIGINS", "http://localhost,http://127.0.0.1")
CORS_ALLOWED_ORIGINS = [orig.strip() for orig in cors_origins_env.split(",") if orig.strip()]
CORS_ALLOW_CREDENTIALS = True
if "*" in CORS_ALLOWED_ORIGINS or DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True

# REST Framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
    "DEFAULT_THROTTLE_CLASSES": (
        "rest_framework.throttling.AnonRateThrottle",
    ),
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/day",
        "contact_ip": "5/hour",
    },
}

# SimpleJWT
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": False,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# Internal communication
INTERNAL_API_KEY = os.environ.get("INTERNAL_API_KEY", "internal_secret_token_change_me_in_prod_random_64_bytes")
NOTIFIER_URL = os.environ.get("NOTIFIER_URL", "http://notifier:8001")
SITE_URL = os.environ.get("SITE_URL", "http://localhost")
