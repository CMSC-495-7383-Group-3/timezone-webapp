"""This module defines serializers for Contact model operations."""

from rest_framework import serializers
from django.core.exceptions import ValidationError
from .models import Contact
import pytz

class ContactSerializer(serializers.ModelSerializer):
    """This class serializes Contact model data."""
    
    class Meta:
        model = Contact
        fields = ['id', 'name', 'timezone', 'phone_number']
        read_only_fields = ['id']

    def validate_timezone(self, value):
        """Validates that the timezone is a recognized pytz timezone."""
        if value not in pytz.all_timezones:
            raise ValidationError("Invalid timezone")
        return value

    def create(self, validated_data):
        """Associates the new contact with the current authenticated user."""
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)