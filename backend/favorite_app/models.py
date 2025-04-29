"""This module creates the Favorite model to represent the PostgreSQL table."""

from django.db import models
from django.utils.timezone import now

from user_app.models import User


class Favorite(models.Model):
    """Favorite model for DB."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    timezone = models.CharField(max_length=100, verbose_name="User Timezone")
    added_date = models.DateTimeField(
        default=now, verbose_name="Registration Date and Time"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "timezone"], name="unique timezone favorites per user"
            )
        ]

    def __str__(self):
        return f"Favorited Timezone: {self.timezone}"
