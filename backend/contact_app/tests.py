"""This module defines tests for the Contact app's API endpoints."""

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from user_app.models import User
from contact_app.models import Contact

# Create your tests here.

class ContactAppTests(APITestCase):
    """Test cases for the Contact API endpoints."""
    
    def setUp(self):
        """Set up a test user and base data for contact testing."""
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            username='testuser',
            password='securepass123',
            first_name='Test',
            last_name='User',
            timezone='UTC'
        )
        self.client.force_authenticate(user=self.user)
        self.url = reverse('contact-list')  # from router basename='contact'

        self.contact_data = {
            'name': 'Jane Doe',
            'timezone': 'America/New_York',
            'phone_number': '123-456-7890',
        }

    def test_create_contact(self):
        """Tests creating a new contact."""
        response = self.client.post(self.url, self.contact_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Contact.objects.count(), 1)
        self.assertEqual(Contact.objects.first().name, 'Jane Doe')

    def test_list_contacts(self):
        """Tests retrieving a list of contacts."""
        Contact.objects.create(user=self.user, **self.contact_data)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_contact(self):
        """Tests updating a contact's details."""
        contact = Contact.objects.create(user=self.user, **self.contact_data)
        update_data = {'name': 'Jane Updated'}
        url = reverse('contact-detail', args=[contact.id])
        response = self.client.patch(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Jane Updated')

    def test_delete_contact(self):
        """Tests deleting a contact."""
        contact = Contact.objects.create(user=self.user, **self.contact_data)
        url = reverse('contact-detail', args=[contact.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Contact.objects.count(), 0)