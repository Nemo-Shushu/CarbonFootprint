# Generated by Django 4.2.16 on 2025-01-25 18:18

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="CalculationRecord",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                ("input_data", models.JSONField()),
                ("results", models.JSONField()),
                ("description", models.TextField(blank=True, null=True)),
            ],
        ),
    ]
