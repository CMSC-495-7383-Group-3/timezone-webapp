from django.urls import path
from . import views

urlpatterns = [
    path('get_time_info/', views.get_time_info, name='get_time_info'),
]
