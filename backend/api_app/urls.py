from django.urls import path
from .views import Time_Info

urlpatterns = [
    path('get_time_info/', views.get_time_info, name='get_time_info'),
    path('get_time_info_by_timezone/', views.get_time_info_by_timezone, name='get_time_info_by_timezone'),  # 👈 new route
    path('time_info/', Time_Info.as_view(), name='get_time_info'),
]
