from django.db import models
from abstract.models import AbstractModel
from products.models import Product
from .quote import Quote
from django.contrib.auth.models import User


class QuoteDetails(AbstractModel):

    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quote = models.ForeignKey(Quote, related_name="details", on_delete=models.CASCADE)
    quantity = models.IntegerField()
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    height = models.FloatField()
    width = models.FloatField()
