#!/usr/bin/env bash
set -e

echo "==> Waiting for PostgreSQL at ${POSTGRES_HOST:-db}:${POSTGRES_PORT:-5432}..."
python << 'EOF'
import os
import socket
import sys
import time

host = os.environ.get("POSTGRES_HOST", "db")
port = int(os.environ.get("POSTGRES_PORT", 5432))
start_time = time.time()
timeout = 60

while True:
    try:
        with socket.create_connection((host, port), timeout=2):
            print(f"==> Database {host}:{port} is reachable.")
            sys.exit(0)
    except OSError:
        if time.time() - start_time > timeout:
            print(f"==> ERROR: Timed out waiting for database at {host}:{port}")
            sys.exit(1)
        time.sleep(1)
EOF

echo "==> Applying database migrations..."
python manage.py migrate --noinput

echo "==> Collecting static files..."
python manage.py collectstatic --noinput --clear || true

echo "==> Ensuring superuser exists..."
python << 'EOF'
import os
import django
django.setup()
from django.contrib.auth import get_user_model

User = get_user_model()
username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "AdminSecurePassword123!")

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"==> Superuser '{username}' created successfully.")
else:
    print(f"==> Superuser '{username}' already exists.")
EOF

echo "==> Seeding initial portfolio placeholder data if needed..."
python manage.py seed_data || true

echo "==> Starting application..."
exec "$@"
