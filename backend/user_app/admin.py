"""This module registers components of the User app to the admin site."""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


class CustomUserAdmin(UserAdmin):
    """This class creates a custom User administration site."""
    list_display = ('email', 'username', 'first_name',
                    'last_name', 'registration_date', 'timezone')
    list_filter = ('registration_date', 'timezone')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('username',
         'first_name', 'last_name', 'timezone')}),
        ('Permissions', {'fields': ('is_active', 'is_staff',
         'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {
         'fields': ('last_login', 'date_joined', 'registration_date')})
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name',
                       'timezone', 'password1', 'password2'),
        })
    )


admin.site.register(User, CustomUserAdmin)
