"""This module tests the User app's views."""

from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import pytz

User = get_user_model()


class UserAppTests(APITestCase):
    """This class defines the User app view tests."""

    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.profile_url = reverse('profile')
        self.logout_url = reverse('logout')
        self.user_data = {
            'email': 'test@example.com',
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'timezone': 'America/New_York',
            'password': 'securepass123'
        }
        self.user = User.objects.create_user(
            email='existing@example.com',
            username='existinguser',
            password='securepass123',
            first_name='Existing',
            last_name='User',
            timezone='UTC'
        )

    def test_register_success(self):
        """This method tests successful registration of a User."""
        response = self.client.post(
            self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)  # 1 from setUp + 1 from new
        self.assertEqual(response.data['email'], self.user_data['email'])
        self.assertEqual(response.data['timezone'], self.user_data['timezone'])
        # Password should be write-only
        self.assertNotIn('password', response.data)

    def test_register_duplicate_email(self):
        """This method tests the error handling of registering two unique User emails."""
        self.client.post(self.register_url, self.user_data, format='json')
        response = self.client.post(
            self.register_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_register_invalid_timezone(self):
        """This method tests the error handling of registering with an invalid timezone"""
        invalid_data = self.user_data.copy()
        invalid_data['timezone'] = 'Invalid/Timezone'
        response = self.client.post(
            self.register_url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('timezone', response.data)

    def test_login_success(self):
        """This method tests the successful login of a User."""
        response = self.client.post(
            self.login_url,
            {'email': 'existing@example.com', 'password': 'securepass123'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']
                         ['email'], 'existing@example.com')

    def test_login_invalid_credentials(self):
        """This method tests the login of a User with invalid credentials."""
        response = self.client.post(
            self.login_url,
            {'email': 'existing@example.com', 'password': 'wrongpassword'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)
