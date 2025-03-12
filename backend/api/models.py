from django.db import models
from accounts.models import User

class CalculationRecord(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    input_data = models.JSONField()
    results = models.JSONField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Calculation on {self.timestamp}"

    class Meta:
        managed = False


class ProcurementData(models.Model):
    code = models.CharField(max_length=10, unique=True)
    description_dict = models.JSONField()

    def __str__(self):
        return self.code

    class Meta:
        db_table = "calculate_procurement_data"
        managed = False


class CategoryCarbonImpact(models.Model):
    category = models.CharField(max_length=255, unique=True)
    carbon_impact = models.FloatField()

    def __str__(self):
        return self.category

    class Meta:
        db_table = "calculate_category_carbon_impact"
        managed = False


class Result(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_electricity_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    total_gas_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    total_water_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    total_travel_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    total_waste_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    total_procurement_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    total_carbon_emissions = models.DecimalField(max_digits=10, decimal_places=2)
    report_data = models.JSONField(null=True, blank=True)

    class Meta:
        db_table = "calculate_result"
        managed = False


class BenchmarkData(models.Model):
    consumption_type = models.CharField(max_length=50)
    category = models.CharField(max_length=150)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50)
    year = models.IntegerField()
    intensity = models.DecimalField(max_digits=10, decimal_places=6, null=True)
    notes = models.TextField(null=True, blank=True)
    transmission_distribution = models.DecimalField(max_digits=10, decimal_places=4)

    class Meta:
        db_table = "accounts_benchmarkdata"
        managed = False
