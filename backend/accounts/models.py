from django.db import models
from datetime import datetime
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser


class University(models.Model):
    name = models.CharField(max_length=255, unique=True,primary_key=True)

    def __str__(self):
        return self.name


class ResearchField(models.Model):
    name = models.CharField(max_length=255, unique=True,primary_key=True)

    def __str__(self):
        return self.name


class User(AbstractUser):
    email = models.EmailField(max_length=35, unique=True, error_messages={'unique': "A user with this email already exists."})
    institute = models.ForeignKey('University', on_delete=models.SET_NULL, null=True, blank=True, related_name="users", to_field='name')
    research_field = models.ForeignKey('ResearchField', on_delete=models.SET_NULL, null=True, blank=True, related_name="users",to_field='name')

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

# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
#     bio = models.TextField(blank=True, null=True)
#     location = models.CharField(max_length=100, blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     last_updated = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"{self.user.username}'s Profile"

# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)

# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     instance.profile.save()


class ConversionFactor(models.Model):
    activity = models.CharField(max_length=100)
    value = models.DecimalField(max_digits=10, decimal_places=5)
    unit = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.activity} - {self.value} {self.unit}"


class BenchmarkData(models.Model):
    CONSUMPTION_TYPE_CHOICES = [
        ('electricity', 'Electricity'),
        ('gas', 'Gas'),
        ('water', 'Water'),
    ]

    consumption_type = models.CharField(max_length=50, choices=CONSUMPTION_TYPE_CHOICES)
    category = models.CharField(max_length=150)  # descriptions like "Academic Laboratory"
    amount = models.DecimalField(max_digits=10, decimal_places=2)  # numerical benchmark values like "207.99"
    unit = models.CharField(max_length=50)  # units like "kWh/m²" or "m³/m²"
    year = models.PositiveIntegerField()  # Year, e.g., "2024"
    notes = models.TextField(blank=True, null=True)  # additional details like sources

    def __str__(self):
        return f"{self.consumption_type} - {self.category} ({self.year})"

            

######         GeneralDataEntry tab     #########
class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project_name = models.CharField(max_length=50, unique=True)
    total_number_fte_research_group = models.IntegerField()
    number_fte_staff_working_on_project = models.IntegerField()
    proportion_research_group_working_on_project = models.FloatField()
    date_submitted = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project_name} by {self.user.username}"

SPACE_TYPE_CHOICES = [
    ('electricity_gas', 'Electricity/Gas'),
    ('water', 'Water'),
]


TRAVEL_MODE_CHOICES = [
    ('air_economy_short_haul', 'Air - Economy Short Haul'),
    ('air_business_short_haul', 'Air - Business Short Haul'),
    ('air_economy_long_haul', 'Air - Economy Long Haul'),
    ('air_business_long_haul', 'Air - Business Long Haul'),
    ('air_economy_international', 'Air - Economy International'),
    ('air_business_international', 'Air - Business International'),
    ('sea_ferry', 'Sea - Ferry'),
    ('land_car', 'Land - Car'),
    ('land_motorbike', 'Land - Motorbike'),
    ('land_taxis', 'Land - Taxis'),
    ('land_local_bus', 'Land - Local Bus'),
    ('land_coach', 'Land - Coach'),
    ('land_national_rail', 'Land - National Rail'),
    ('land_international_rail', 'Land - International Rail'),
    ('land_light_rail_tram', 'Land - Light Rail and Tram'),
]

WASTE_TYPE_CHOICES = [
    ('mixed_recycling', 'Mixed Recycling'),
    ('general_waste', 'General Waste'),
    ('clinical_waste', 'Clinical Waste'),
    ('chemical_waste', 'Chemical Waste'),
    ('biological_waste', 'Biological Waste'),
    ('weee_mixed_recycling', 'WEEE Mixed Recycling'),
]

class GeneralDataEntry(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="general_data_entries")
    space_type = models.CharField(max_length=50, choices=SPACE_TYPE_CHOICES, blank=True, null=True)
    unit = models.CharField(max_length=10, blank=True, null=True)
    total_area = models.FloatField(blank=True, null=True)
    mode_of_travel = models.CharField(max_length=50, choices=TRAVEL_MODE_CHOICES, blank=True, null=True)
    distance = models.FloatField(blank=True, null=True)
    type_of_waste = models.CharField(max_length=50, choices=WASTE_TYPE_CHOICES, blank=True, null=True)
    amount = models.FloatField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"General Data Entry for Submission: {self.submission.project_name}"

class SpaceTypeEntry(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="space_type_entries")
    space_type = models.CharField(max_length=50, choices=SPACE_TYPE_CHOICES)
    unit = models.CharField(max_length=10, default='m²')
    total_area = models.FloatField()

    def __str__(self):
        return f"{self.space_type} - {self.total_area}m²"

class ProportionEntry(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="proportion_entries")
    total_fte_research_group = models.IntegerField()
    fte_staff_on_project = models.IntegerField()
    proportion_research_group_on_project = models.FloatField()

    def __str__(self):
        return f"Proportion for Submission: {self.submission.project_name}"

class WasteEmission(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="waste_emissions")
    type_of_waste = models.CharField(max_length=50, choices=WASTE_TYPE_CHOICES)  # choices
    amount = models.FloatField()  # amount in tonnes
    carbon_intensity = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)  # Fetched from ConversionFactor
    total_emissions = models.DecimalField(max_digits=15, decimal_places=5, blank=True, null=True)  

    def calculate_emissions(self):
        try:
            conversion_factor = ConversionFactor.objects.get(activity=self.type_of_waste)
            self.carbon_intensity = conversion_factor.value
        except ConversionFactor.DoesNotExist:
            self.carbon_intensity = None

        # Calculate total emissions if carbon intensity is available
        if self.carbon_intensity is not None:
            self.total_emissions = self.amount * float(self.carbon_intensity)
        else:
            self.total_emissions = None

        return self.total_emissions

    def save(self, *args, **kwargs):
        # ensure that emissions are calculated before saving
        self.calculate_emissions()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.type_of_waste}: {self.total_emissions} kg CO2e"

class TravelEmission(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="travel_emissions")
    mode_of_travel = models.CharField(max_length=100, choices=TRAVEL_MODE_CHOICES)
    distance = models.FloatField(help_text="Distance traveled in kilometers")
    carbon_intensity = models.DecimalField(max_digits=10, decimal_places=5, blank=True, null=True)
    total_emissions = models.DecimalField(max_digits=12, decimal_places=5, blank=True, null=True)

    def calculate_emissions(self):
        """
        Fetch carbon intensity from ConversionFactor and calculate total emissions.
        """
        try:
            # Fetch the carbon intensity from ConversionFactor model
            conversion_factor = ConversionFactor.objects.get(activity=self.mode_of_travel)
            self.carbon_intensity = conversion_factor.value

            # Calculate total emissions
            self.total_emissions = self.distance * float(self.carbon_intensity)
        except ConversionFactor.DoesNotExist:
            # If no conversion factor is found, set fields to None
            self.carbon_intensity = None
            self.total_emissions = None

    def save(self, *args, **kwargs):
        """
        Ensure emissions are calculated before saving the record.
        """
        self.calculate_emissions()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.mode_of_travel}: {self.total_emissions:.2f} kg CO2e"


class WaterConsumption(models.Model):
    space_type = models.ForeignKey(SpaceTypeEntry, on_delete=models.CASCADE)
    total_area = models.FloatField()
    proportion_of_research_group = models.FloatField()
    benchmark_water_consumption = models.FloatField()
    water_consumption = models.FloatField(editable=False, default=0.0)
    water_consumption_carbon_intensity = models.FloatField()
    water_treatment_carbon_intensity = models.FloatField()
    total_emissions = models.FloatField(editable=False, default=0.0)

    def save(self, *args, **kwargs):
        # Calculate water consumption based on the formula
        self.water_consumption = (
            self.proportion_of_research_group * self.total_area * self.benchmark_water_consumption
        )
        # Calculate total emissions
        self.total_emissions = (
            (self.water_consumption * self.water_consumption_carbon_intensity) +
            (self.water_consumption * self.water_treatment_carbon_intensity)
        )
        super().save(*args, **kwargs)


class GasConsumption(models.Model):
    space_type = models.ForeignKey(SpaceTypeEntry, on_delete=models.CASCADE)  # Linking to SpaceType
    total_area = models.FloatField()  # Total area in m²
    proportion_of_research_group = models.FloatField()  # Proportion ppl
    benchmark_gas_consumption = models.FloatField(blank=True, null=True)  # fetched from BenchmarkData
    gas_carbon_intensity = models.FloatField()  # kg CO₂/kWh
    transmission_distribution_intensity = models.FloatField()  # kg CO₂/kWh
    total_emissions = models.FloatField(editable=False, default=0.0)

    def save(self, *args, **kwargs):
        # Look up the benchmark gas consumption value
        current_year =datetime.now().year
        try:
            benchmark_entry = BenchmarkData.objects.get(
                consumption_type='gas',
                category=self.space_type.name,
                year=current_year  # Replace with the appropriate year
            )
            self.benchmark_gas_consumption = benchmark_entry.amount
        except BenchmarkData.DoesNotExist:
            raise ValidationError(f"No benchmark data found for {self.space_type.name} and gas in {current_year}.")

        # Calculate gas consumption and emissions
        gas_consumption = self.total_area * self.benchmark_gas_consumption * self.proportion_of_research_group
        self.total_emissions = (
            (gas_consumption * self.gas_carbon_intensity) +
            (gas_consumption * self.transmission_distribution_intensity)
        )

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Gas Consumption for {self.space_type.name} - Emissions: {self.total_emissions:.2f} kg CO₂"


class ElectricityConsumption(models.Model):
    space_type = models.ForeignKey(SpaceTypeEntry, on_delete=models.CASCADE)
    total_area = models.FloatField()
    proportion_of_research_group = models.FloatField()
    benchmark_electricity_consumption = models.FloatField(blank=True, null=True)  # fetched from BenchmarkData
    grid_carbon_intensity = models.FloatField()
    transmission_distribution_intensity = models.FloatField()
    total_emissions = models.FloatField(editable=False, default=0.0)

    def save(self, *args, **kwargs):
        current_year = datetime.now().year  # Use the current year dynamically

        # from BenchmarkData
        try:
            benchmark_entry = BenchmarkData.objects.get(
                consumption_type='electricity',
                category=self.space_type.name,
                year=current_year
            )
            self.benchmark_electricity_consumption = benchmark_entry.amount
        except BenchmarkData.DoesNotExist:
            raise ValidationError(f"No benchmark data found for {self.space_type.name} and electricity in {current_year}.")

        # Calculate electricity consumption and total emissions
        electricity_consumption = self.total_area * self.benchmark_electricity_consumption * self.proportion_of_research_group
        self.total_emissions = (
            (electricity_consumption * self.grid_carbon_intensity) +
            (electricity_consumption * self.transmission_distribution_intensity)
        )

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Electricity Consumption for {self.space_type.name} - Emissions: {self.total_emissions:.2f} kg CO₂"

