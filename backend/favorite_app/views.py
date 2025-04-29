"""This module defines the views that handle HTTP requests and route them appropriately"""

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Favorite
from .serializers import FavoriteSerializer


class FavoritesView(generics.ListCreateAPIView):
    """This view allows users to create a new favorite"""

    permission_classes = [IsAuthenticated]
    serializer_class = FavoriteSerializer

    def get_queryset(self):
        """Restricts the queryset to the authenticated user's favorites."""
        return Favorite.objects.filter(user=self.request.user)


class FavoriteView(generics.RetrieveUpdateDestroyAPIView):
    """This view allows users to retrieve, update, and delete their favorites"""

    permission_classes = [IsAuthenticated]
    serializer_class = FavoriteSerializer

    def get_queryset(self):
        """Restricts the queryset to the authenticated user's favorites."""
        return Favorite.objects.filter(user=self.request.user)
