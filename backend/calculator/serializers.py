from rest_framework import serializers
from .models import CalculationRecord


class CalculationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalculationRecord
        fields = "__all__"
