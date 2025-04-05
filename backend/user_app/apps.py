"""This module holds the default configuration for the User app."""
from django.apps import AppConfig


class UserAppConfig(AppConfig):
    """The User configuration class."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user_app'
