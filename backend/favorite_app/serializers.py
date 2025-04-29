"""This module defines the serializers for user favorite timezones."""

import pytz
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Favorite

User = get_user_model()


class FavoriteSerializer(serializers.ModelSerializer):
    """This class represents the Favorite serializer."""

    class Meta:
        """Metadata class for Favorite serializer."""

        model = Favorite
        fields = ("id", "user", "timezone", "added_date")
        read_only_fields = ("id", "user", "added_date")

    def validate_timezone(self, value):
        """Validates the timezone entered by a User."""
        if value not in pytz.all_timezones:
            raise ValidationError("Invalid timezone")
        return value

    def validate(self, attrs):
        """Validates that the user does not already have this timezone as a favorite."""
        user = self.context["request"].user
        timezone = attrs.get("timezone")
        if Favorite.objects.filter(user=user, timezone=timezone).exists():
            raise ValidationError("This timezone is already a favorite for the user.")
        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        return Favorite.objects.create(user=user, timezone=validated_data["timezone"])
