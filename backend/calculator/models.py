from django.db import models
from accounts.models import *

class CalculationRecord(models.Model):
    # time
    timestamp = models.DateTimeField(auto_now_add=True)

    # Store all received data
    input_data = models.JSONField()  

    # Store calculated results
    results = models.JSONField() 

    # Add additional annotation information for certain fields
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Calculation on {self.timestamp}"
    
    

class emission_factors(models.Model):
    category = models.CharField(max_length=255, unique=True)  # category
    benchmark_electricity = models.FloatField(null=True, blank=True)  # benchmark_electricity
    benchmark_gas = models.FloatField(null=True, blank=True)  # benchmark_gas

    def __str__(self):
        return self.category
    
    class Meta:
        db_table = "emission_factors"
        
class ProcurementData(models.Model):
    code = models.CharField(max_length=10, unique=True)
    description_dict = models.JSONField()  # store description_dict

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
    # submitted_user = models.ForeignKey(User)

    class Meta:
        db_table = 'calculate_result'  # Specify database table name

class WasteEmission(models.Model):
    id = models.BigAutoField(primary_key=True)  
    type_of_waste = models.CharField(max_length=50, unique=True)  
    amount = models.FloatField()  
    carbon_intensity = models.DecimalField(max_digits=10, decimal_places=5, null=True, blank=True) 
    total_emissions = models.DecimalField(max_digits=15, decimal_places=5, null=True, blank=True)  
    submission_id = models.BigIntegerField()  

    class Meta:
        db_table = "accounts_wasteemission"  

    def __str__(self):
        return f"{self.type_of_waste}: {self.carbon_intensity}"