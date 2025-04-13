"""This module defines the Contact model for storing user-specific contact information."""

from django.db import models
import uuid
from user_app.models import User

# Create your models here.

class Contact(models.Model):
    """This class represents a contact that belongs to a specific user."""
    record_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contacts')
    name = models.CharField(max_length=100)
    timezone = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)

    def __str__(self):
        """Returns a readable string representation of the contact."""
        return f"{self.name} ({self.timezone})"