from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField( max_length=35, unique=True, error_messages={'unique': "A user with this email already exists."})
    forename = models.CharField(max_length=20, blank=False, null=False)
    surname = models.CharField(max_length=20, blank=False, null=False)
    institute = models.CharField(max_length=50, blank=True, null=True)
    
    is_admin = models.BooleanField (default = False)
    is_researcher=models.BooleanField(default=False)

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

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class ConversionFactor(models.Model):
    activity = models.CharField(max_length=100)
    value = models.DecimalField(max_digits=10, decimal_places=5)
    unit = models.CharField(max_length=50, blank=True, mull=True)

    def __str__(self):
        return f"{self.activity} - {self.value} {self.unit}"

class EmissionFactor(models.Model):
    