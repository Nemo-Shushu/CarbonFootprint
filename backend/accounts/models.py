from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser


class University(models.Model):
    name = models.CharField(max_length=255, unique=True, primary_key=True)

    def __str__(self):
        return self.name


class ResearchField(models.Model):
    name = models.CharField(max_length=255, unique=True, primary_key=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    email = models.EmailField(
        max_length=35,
        unique=True,
        error_messages={"unique": "A user with this email already exists."},
    )
    institute = models.ForeignKey(
        "University",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
        to_field="name",
    )
    research_field = models.ForeignKey(
        "ResearchField",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
        to_field="name",
    )

    is_admin = models.BooleanField(default=False)
    is_researcher = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.email})"

    def clean(self):
        if not self.email:
            raise ValidationError("Email is required")
        if not self.forename or not self.surname:
            raise ValidationError("Forename and Surname are required")

        normalized_email = self.email.strip().lower()
        if not normalized_email.endswith(".ac.uk"):
            raise ValidationError("Email must belong to an educational institution")

    def is_normal_user(self):
        return not self.is_admin and not self.is_researcher

    def is_admin_user(self):
        return self.is_admin

    def is_researcher_user(self):
        return self.is_researcher


class ConversionFactor(models.Model):
    activity = models.CharField(max_length=100)
    value = models.DecimalField(max_digits=10, decimal_places=5)
    unit = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.activity} - {self.value} {self.unit}"


class EmailVerification(models.Model):
    email = models.EmailField(
        max_length=35,
        unique=True,
        error_messages={"unique": "A user with this email already exists."},
    )
    verification_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
