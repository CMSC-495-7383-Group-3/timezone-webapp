"""This module defines the endpoints for all Favorite views."""

from django.urls import path

from .views import FavoritesView, FavoriteView

urlpatterns = [
    path("", FavoritesView.as_view(), name="favorite-create"),
    path("<int:pk>/", FavoriteView.as_view(), name="favorite-detail"),
]
