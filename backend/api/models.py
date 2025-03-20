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

class AdminRequest(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
    ]

    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    requested_role = models.CharField(max_length=50)
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Pending")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "accounts_adminrequest"

    def __str__(self):
        return f"{self.user.id} - {self.requested_role} ({self.status})"


class TempReport(models.Model):
    user = models.OneToOneField("accounts.User", on_delete=models.CASCADE)
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "calculate_temp_reports"

class AccountsUniversity(models.Model):
    name = models.CharField(max_length=255, primary_key=True)
    floor_area_gia = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    electricity_non_residential = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    electricity_residential = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    gas_non_residential = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    gas_residential = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    total_electricity_benchmark = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    total_gas_benchmark = models.DecimalField(max_digits=10, decimal_places=4, null=True, blank=True)
    avg_electricity_consumption_all_buildings = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    electricity_benchmark_multiplier = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    avg_gas_consumption_all_buildings = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    gas_benchmark_multiplier = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    academic_laboratory_gas = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    academic_laboratory_electricity = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    academic_office_gas = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    academic_office_electricity = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    admin_office_gas = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    admin_office_electricity = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    avg_gas_consumption_academic_lab_workshop = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    avg_electricity_consumption_academic_lab_workshop = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    avg_gas_consumption_academic_office = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    avg_electricity_consumption_academic_office = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    avg_gas_consumption_admin_office = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)
    avg_electricity_consumption_admin_office = models.DecimalField(max_digits=10, decimal_places=6, null=True, blank=True)

    class Meta:
        db_table = 'accounts_university'
