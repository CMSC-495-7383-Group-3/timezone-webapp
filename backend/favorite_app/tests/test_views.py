"""This module defines tests for the Favorite API endpoints."""

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from favorite_app.models import Favorite

User = get_user_model()


class FavoriteApiTests(APITestCase):
    """Test cases for the Favorite API endpoints."""

    def setUp(self):
        """Set up test user and API client."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="securepass123"
        )
        self.client.force_authenticate(user=self.user)
        self.create_url = reverse("favorite-create")
        self.favorite_data = {"timezone": "America/Chicago"}

    def test_create_favorite(self):
        """Tests creating a new favorite."""
        response = self.client.post(self.create_url, self.favorite_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Favorite.objects.count(), 1)
        self.assertEqual(Favorite.objects.first().timezone, "America/Chicago")

    def test_create_favorite_invalid_timezone(self):
        """Tests validation for an invalid timezone."""
        invalid_data = {"timezone": "Mars/SpaceTime"}
        response = self.client.post(self.create_url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid timezone", str(response.data))

    def test_prevent_duplicate_favorite(self):
        """Tests that a user cannot favorite the same timezone twice."""
        Favorite.objects.create(user=self.user, timezone="America/Chicago")
        response = self.client.post(self.create_url, self.favorite_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already a favorite", str(response.data))

    def test_retrieve_favorite(self):
        """Tests retrieving a favorite by ID"""
        favorite = Favorite.objects.create(user=self.user, timezone="America/New_York")
        url = reverse("favorite-detail", args=[favorite.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["timezone"], "America/New_York")

    def test_update_favorite(self):
        """Tests updating a favorite timezone."""
        favorite = Favorite.objects.create(user=self.user, timezone="Europe/Berlin")
        url = reverse("favorite-detail", args=[favorite.id])
        response = self.client.patch(url, {"timezone": "Europe/Paris"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["timezone"], "Europe/Paris")

    def test_delete_favorite(self):
        """Tests deleting a favorite."""
        favorite = Favorite.objects.create(user=self.user, timezone="Asia/Tokyo")
        url = reverse("favorite-detail", args=[favorite.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Favorite.objects.count(), 0)

    def test_user_cannot_access_other_users_favorite(self):
        """Tests that a user cannot access another user's favorite."""
        other_user = User.objects.create_user(
            username="otheruser", email="other@example.com", password="otherpass123"
        )
        other_fav = Favorite.objects.create(user=other_user, timezone="Asia/Dubai")
        url = reverse("favorite-detail", args=[other_fav.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
