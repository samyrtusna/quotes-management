# Generated by Django 5.0.6 on 2024-08-04 12:04

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("products", "0001_initial"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Quote",
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
                ("reference", models.CharField(max_length=50, unique=True)),
                (
                    "client_name",
                    models.CharField(max_length=50, verbose_name="client name"),
                ),
                ("date", models.DateField(auto_now_add=True)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "owner",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="quotes",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="QuoteDetails",
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
                ("quantity", models.IntegerField()),
                ("amount", models.DecimalField(decimal_places=2, max_digits=8)),
                ("height", models.FloatField()),
                ("width", models.FloatField()),
                ("volet_roulant", models.BooleanField(default=False)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="products.product",
                    ),
                ),
                (
                    "quote",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="details",
                        to="quote.quote",
                    ),
                ),
            ],
        ),
    ]
