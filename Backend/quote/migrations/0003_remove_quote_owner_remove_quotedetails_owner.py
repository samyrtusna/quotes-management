# Generated by Django 5.0.6 on 2024-08-13 22:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("quote", "0002_quotedetails_owner"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="quote",
            name="owner",
        ),
        migrations.RemoveField(
            model_name="quotedetails",
            name="owner",
        ),
    ]