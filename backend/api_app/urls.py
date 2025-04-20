from django.urls import path
from .views import Time_Info

urlpatterns = [
    path('time_info/', Time_Info.as_view(), name='get_time_info'),
]
