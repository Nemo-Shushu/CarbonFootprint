from django.db import models


class User(models.Model):
    id = models.BigAutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(null=True, blank=True)
    is_superuser = models.BooleanField(default=False)
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    email = models.CharField(max_length=35, unique=True)
    institute_id = models.CharField(max_length=150, null=True, blank=True)
    research_field_id = models.CharField(max_length=150, null=True, blank=True)
    is_admin = models.BooleanField(default=False)
    is_researcher = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    class Meta:
        db_table = "accounts_user"
        managed = False

    def __str__(self):
        return self.username
