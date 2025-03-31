"""This module contains settings used specificly for development."""

from .base import *

# SECURITY WARNING: Keep the secret key used in production secret!
SECRET_KEY = 'super_insecure_django_key'

# SECURITY WARNING: Don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    'localhost',
    '0.0.0.0',
    'gunicorn'
]
