"""This module defines routing for the Contact app."""

from rest_framework.routers import DefaultRouter
from .views import ContactViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'contacts', ContactViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
]