# Generated by Django 5.0.6 on 2024-10-13 13:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0007_remove_product_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="is_deleted",
            field=models.BooleanField(default=False),
        ),
    ]