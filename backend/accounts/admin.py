from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


# Register your models here.
class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ["email", "first_name", "last_name"]
    search_fields = ["email", "first_name", "last_name"]
    ordering = ["email"]


admin.site.register(User, UserAdmin)
