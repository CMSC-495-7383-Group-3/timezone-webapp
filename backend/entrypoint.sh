#!/bin/bash
if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for PostgreSQL..."
    while ! nc -z db 5432; do
      sleep 0.1
    done
    echo "PostgreSQL started"
fi
echo "Running makemigrations..."
python manage.py makemigrations --noinput
echo "Running migrate..."
python manage.py migrate --noinput
exec "$@"