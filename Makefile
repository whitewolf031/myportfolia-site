.PHONY: help up down restart logs build migrate createsuperuser test lint format clean

help:
	@echo "Available commands:"
	@echo "  make up              Build and start all services in detached mode"
	@echo "  make down            Stop and remove all containers"
	@echo "  make restart         Restart all services"
	@echo "  make logs            Follow container logs"
	@echo "  make build           Rebuild all Docker containers"
	@echo "  make migrate         Run database migrations"
	@echo "  make createsuperuser Create Django superuser interactively"
	@echo "  make test            Run all test suites (api, notifier, frontend)"
	@echo "  make lint            Run linters (ruff, eslint)"
	@echo "  make format          Run formatters"

up:
	docker compose up --build -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

build:
	docker compose build

migrate:
	docker compose exec api python manage.py migrate

createsuperuser:
	docker compose exec api python manage.py createsuperuser

test:
	docker compose exec api pytest
	docker compose exec notifier pytest
	docker compose exec frontend npm run test:run || true

lint:
	docker compose exec api ruff check .
	docker compose exec notifier ruff check .
	docker compose exec frontend npm run lint || true

clean:
	docker compose down -v
