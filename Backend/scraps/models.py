from django.db import models
from abstract.models import AbstractModel
from django.contrib.auth.models import User


class Scraps(AbstractModel):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    code = models.IntegerField()
    label = models.CharField(max_length=35)
    length = models.FloatField()
    mesure = models.CharField( max_length=35)

