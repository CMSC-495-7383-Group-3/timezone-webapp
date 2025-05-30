"""This module is the URL configuration for the tz_webapp_proj project."""

from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/users/", include("user_app.urls")),
    path("api/v1/timezones/", include("api_app.urls")),
    path("api/v1/", include("contact_app.urls")),
    path("api/v1/favorites/", include("favorite_app.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]
