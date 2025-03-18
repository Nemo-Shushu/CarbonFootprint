from django.db import models

from accounts.models import User

# class User(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     password = models.CharField(max_length=128)
#     last_login = models.DateTimeField(null=True, blank=True)
#     is_superuser = models.BooleanField(default=False)
#     username = models.CharField(max_length=150, unique=True)
#     first_name = models.CharField(max_length=150)
#     last_name = models.CharField(max_length=150)
#     is_staff = models.BooleanField(default=False)
#     is_active = models.BooleanField(default=True)
#     date_joined = models.DateTimeField(auto_now_add=True)
#     email = models.CharField(max_length=35, unique=True)
#     institute_id = models.CharField(max_length=150, null=True, blank=True)
#     research_field_id = models.CharField(max_length=150, null=True, blank=True)
#     is_admin = models.BooleanField(default=False)
#     is_researcher = models.BooleanField(default=False)
#     is_verified = models.BooleanField(default=False)

#     class Meta:
#         db_table = "accounts_user"
#         managed = False

#     def __str__(self):
#         return self.username


class CalculationRecord(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    input_data = models.JSONField()
    results = models.JSONField()
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Calculation on {self.timestamp}"


class ProcurementData(models.Model):
    code = models.CharField(max_length=10, unique=True)
    description_dict = models.JSONField()

    def __str__(self):
        return self.code

    class Meta:
        db_table = "calculate_procurement_data"


class CategoryCarbonImpact(models.Model):
    category = models.CharField(max_length=255, unique=True)
    carbon_impact = models.FloatField()

    def __str__(self):
        return self.category

    class Meta:
        db_table = "calculate_category_carbon_impact"


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
