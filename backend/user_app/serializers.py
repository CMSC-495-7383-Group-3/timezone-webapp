"""This module defines the serializers for user registration and authentication."""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
import pytz

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """This class represents the User serializer."""
    password = serializers.CharField(
        write_only=True, min_length=8)

    class Meta:
        """Metadata class for User serializer."""
        model = User
        fields = ('id', 'email', 'username', 'password',
                  'first_name', 'last_name', 'registration_date', 'timezone')
        read_only_fields = ('id', 'registration_date')

    def validate_timezone(self, value: str) -> str:
        """Validates the timezone entered by a User."""
        if value not in pytz.all_timezones:
            raise ValidationError("Invalid timezone")
        return value

    def create(self, validated_data: dict) -> type[AbstractUser]:
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            timezone=validated_data.get('timezone', 'UTC')
        )
        return user

    def update(self, instance: type[AbstractUser], validated_data: dict) -> type[AbstractUser]:
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)


class LoginSerializer(serializers.Serializer):
    """This class represents the User login serializer."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
