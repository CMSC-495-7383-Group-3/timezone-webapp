"""This module defines views for contact operations."""

from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Contact
from .serializers import ContactSerializer

# Create your views here.
class ContactViewSet(viewsets.ModelViewSet):
    """Handles creating, retrieving, updating, and deleting user-specific contacts."""
    
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Returns only the contacts belonging to the authenticated user."""
        return Contact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Associates created contacts with the authenticated user."""
        serializer.save(user=self.request.user)