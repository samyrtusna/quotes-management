# Generated by Django 5.0.6 on 2024-10-13 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0008_product_is_deleted"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="product",
            name="is_deleted",
        ),
        migrations.AddField(
            model_name="product",
            name="deleted_at",
            field=models.DateTimeField(default=None, null=True),
        ),
    ]
