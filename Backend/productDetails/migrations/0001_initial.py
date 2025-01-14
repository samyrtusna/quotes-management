# Generated by Django 5.0.6 on 2024-08-31 22:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("products", "0002_remove_product_owner"),
        ("rawProducts", "0006_rawproduct_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="ProductDetails",
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
                ("formula", models.TextField()),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="products.product",
                    ),
                ),
                ("raw_product", models.ManyToManyField(to="rawProducts.rawproduct")),
            ],
        ),
    ]
