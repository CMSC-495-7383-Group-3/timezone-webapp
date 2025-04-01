"""This module creates the User model to represent the PostgreSQL table."""
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now


class User(AbstractUser):
    """User model for DB."""
    email: models.EmailField = models.EmailField(
        unique=True, verbose_name='Email Address', max_length=100)
    username: models.CharField = models.CharField(
        max_length=50, verbose_name='Username', unique=True)
    first_name: models.CharField = models.CharField(
        max_length=50, verbose_name='First Name')
    last_name: models.CharField = models.CharField(
        max_length=75, verbose_name='Last Name')
    registration_date: models.DateTimeField = models.DateTimeField(
        default=now(), verbose_name='Registration Date and Time')
    timezone: models.CharField = models.CharField(
        max_length=100, verbose_name='User Timezone', default='UTC')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [username, first_name, last_name]

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        """This property defines a User's full name from their first/last variables."""
        return f"{self.first_name} {self.last_name}".strip()
