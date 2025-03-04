from rest_framework import serializers
from accounts.models import University, ResearchField
from api.models import CalculationRecord


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ("name",)


class ResearchFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchField
        fields = ("name",)

class CalculationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalculationRecord
        fields = "__all__"
