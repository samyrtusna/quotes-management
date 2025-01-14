# Generated by Django 5.0.6 on 2024-10-13 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("quote", "0009_quote_is_deleted_quotedetails_is_deleted"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="quote",
            name="is_deleted",
        ),
        migrations.RemoveField(
            model_name="quotedetails",
            name="is_deleted",
        ),
        migrations.AddField(
            model_name="quote",
            name="deleted_at",
            field=models.DateTimeField(default=None, null=True),
        ),
        migrations.AddField(
            model_name="quotedetails",
            name="deleted_at",
            field=models.DateTimeField(default=None, null=True),
        ),
    ]
