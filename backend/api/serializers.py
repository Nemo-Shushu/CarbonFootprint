from rest_framework import serializers
from accounts.models import University,ResearchField
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator

class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ('name',)

class ResearchFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchField
        fields = ('name',)