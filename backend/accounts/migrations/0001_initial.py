# Generated by Django 4.2.16 on 2025-02-12 11:38

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(error_messages={'unique': 'A user with this email already exists.'}, max_length=35, unique=True)),
                ('is_admin', models.BooleanField(default=False)),
                ('is_researcher', models.BooleanField(default=False)),
                ('is_verified', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='BenchmarkData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('consumption_type', models.CharField(choices=[('electricity', 'Electricity'), ('gas', 'Gas'), ('water', 'Water')], max_length=50)),
                ('category', models.CharField(max_length=150)),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('unit', models.CharField(max_length=50)),
                ('year', models.PositiveIntegerField()),
                ('notes', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ConversionFactor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity', models.CharField(max_length=100)),
                ('value', models.DecimalField(decimal_places=5, max_digits=10)),
                ('unit', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ResearchField',
            fields=[
                ('name', models.CharField(max_length=255, primary_key=True, serialize=False, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='SpaceTypeEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('space_type', models.CharField(choices=[('electricity_gas', 'Electricity/Gas'), ('water', 'Water')], max_length=50)),
                ('unit', models.CharField(default='m²', max_length=10)),
                ('total_area', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Submission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('project_name', models.CharField(max_length=50, unique=True)),
                ('total_number_fte_research_group', models.IntegerField()),
                ('number_fte_staff_working_on_project', models.IntegerField()),
                ('proportion_research_group_working_on_project', models.FloatField()),
                ('date_submitted', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='University',
            fields=[
                ('name', models.CharField(max_length=255, primary_key=True, serialize=False, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='WaterConsumption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_area', models.FloatField()),
                ('proportion_of_research_group', models.FloatField()),
                ('benchmark_water_consumption', models.FloatField()),
                ('water_consumption', models.FloatField(default=0.0, editable=False)),
                ('water_consumption_carbon_intensity', models.FloatField()),
                ('water_treatment_carbon_intensity', models.FloatField()),
                ('total_emissions', models.FloatField(default=0.0, editable=False)),
                ('space_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.spacetypeentry')),
            ],
        ),
        migrations.CreateModel(
            name='WasteEmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_of_waste', models.CharField(choices=[('mixed_recycling', 'Mixed Recycling'), ('general_waste', 'General Waste'), ('clinical_waste', 'Clinical Waste'), ('chemical_waste', 'Chemical Waste'), ('biological_waste', 'Biological Waste'), ('weee_mixed_recycling', 'WEEE Mixed Recycling')], max_length=50)),
                ('amount', models.FloatField()),
                ('carbon_intensity', models.DecimalField(blank=True, decimal_places=5, max_digits=10, null=True)),
                ('total_emissions', models.DecimalField(blank=True, decimal_places=5, max_digits=15, null=True)),
                ('submission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='waste_emissions', to='accounts.submission')),
            ],
        ),
        migrations.CreateModel(
            name='TravelEmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mode_of_travel', models.CharField(choices=[('air_economy_short_haul', 'Air - Economy Short Haul'), ('air_business_short_haul', 'Air - Business Short Haul'), ('air_economy_long_haul', 'Air - Economy Long Haul'), ('air_business_long_haul', 'Air - Business Long Haul'), ('air_economy_international', 'Air - Economy International'), ('air_business_international', 'Air - Business International'), ('sea_ferry', 'Sea - Ferry'), ('land_car', 'Land - Car'), ('land_motorbike', 'Land - Motorbike'), ('land_taxis', 'Land - Taxis'), ('land_local_bus', 'Land - Local Bus'), ('land_coach', 'Land - Coach'), ('land_national_rail', 'Land - National Rail'), ('land_international_rail', 'Land - International Rail'), ('land_light_rail_tram', 'Land - Light Rail and Tram')], max_length=100)),
                ('distance', models.FloatField(help_text='Distance traveled in kilometers')),
                ('carbon_intensity', models.DecimalField(blank=True, decimal_places=5, max_digits=10, null=True)),
                ('total_emissions', models.DecimalField(blank=True, decimal_places=5, max_digits=12, null=True)),
                ('submission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='travel_emissions', to='accounts.submission')),
            ],
        ),
        migrations.AddField(
            model_name='spacetypeentry',
            name='submission',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='space_type_entries', to='accounts.submission'),
        ),
        migrations.CreateModel(
            name='ProportionEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_fte_research_group', models.IntegerField()),
                ('fte_staff_on_project', models.IntegerField()),
                ('proportion_research_group_on_project', models.FloatField()),
                ('submission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='proportion_entries', to='accounts.submission')),
            ],
        ),
        migrations.CreateModel(
            name='GeneralDataEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('space_type', models.CharField(blank=True, choices=[('electricity_gas', 'Electricity/Gas'), ('water', 'Water')], max_length=50, null=True)),
                ('unit', models.CharField(blank=True, max_length=10, null=True)),
                ('total_area', models.FloatField(blank=True, null=True)),
                ('mode_of_travel', models.CharField(blank=True, choices=[('air_economy_short_haul', 'Air - Economy Short Haul'), ('air_business_short_haul', 'Air - Business Short Haul'), ('air_economy_long_haul', 'Air - Economy Long Haul'), ('air_business_long_haul', 'Air - Business Long Haul'), ('air_economy_international', 'Air - Economy International'), ('air_business_international', 'Air - Business International'), ('sea_ferry', 'Sea - Ferry'), ('land_car', 'Land - Car'), ('land_motorbike', 'Land - Motorbike'), ('land_taxis', 'Land - Taxis'), ('land_local_bus', 'Land - Local Bus'), ('land_coach', 'Land - Coach'), ('land_national_rail', 'Land - National Rail'), ('land_international_rail', 'Land - International Rail'), ('land_light_rail_tram', 'Land - Light Rail and Tram')], max_length=50, null=True)),
                ('distance', models.FloatField(blank=True, null=True)),
                ('type_of_waste', models.CharField(blank=True, choices=[('mixed_recycling', 'Mixed Recycling'), ('general_waste', 'General Waste'), ('clinical_waste', 'Clinical Waste'), ('chemical_waste', 'Chemical Waste'), ('biological_waste', 'Biological Waste'), ('weee_mixed_recycling', 'WEEE Mixed Recycling')], max_length=50, null=True)),
                ('amount', models.FloatField(blank=True, null=True)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('submission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='general_data_entries', to='accounts.submission')),
            ],
        ),
        migrations.CreateModel(
            name='GasConsumption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_area', models.FloatField()),
                ('proportion_of_research_group', models.FloatField()),
                ('benchmark_gas_consumption', models.FloatField(blank=True, null=True)),
                ('gas_carbon_intensity', models.FloatField()),
                ('transmission_distribution_intensity', models.FloatField()),
                ('total_emissions', models.FloatField(default=0.0, editable=False)),
                ('space_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.spacetypeentry')),
            ],
        ),
        migrations.CreateModel(
            name='ElectricityConsumption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_area', models.FloatField()),
                ('proportion_of_research_group', models.FloatField()),
                ('benchmark_electricity_consumption', models.FloatField(blank=True, null=True)),
                ('grid_carbon_intensity', models.FloatField()),
                ('transmission_distribution_intensity', models.FloatField()),
                ('total_emissions', models.FloatField(default=0.0, editable=False)),
                ('space_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.spacetypeentry')),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='institute',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='users', to='accounts.university'),
        ),
        migrations.AddField(
            model_name='user',
            name='research_field',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='users', to='accounts.researchfield'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions'),
        ),
    ]
