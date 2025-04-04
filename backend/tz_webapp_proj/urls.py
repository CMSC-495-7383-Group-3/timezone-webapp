"""This module is the URL configuration for the tz_webapp_proj project."""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/users/', include('user_app.urls'))
]
