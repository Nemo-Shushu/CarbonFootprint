from rest_framework import serializers
from accounts.models import University, ResearchField


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ("name",)


class ResearchFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchField
        fields = ("name",)
