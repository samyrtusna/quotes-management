from django.db import models
from abstract.models import AbstractModel
from quote.models.quoteDetails import QuoteDetails
from django.contrib.auth.models import User

class RawProductsConsumed (AbstractModel):

    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    quote_details = models.ForeignKey(QuoteDetails,related_name="rawproductsconsumed_set", on_delete=models.CASCADE)
    code = models.IntegerField(null=True)
    label = models.CharField(max_length=50, null=True)
    quantity_by_product = models.FloatField(null=True)
    mesure = models.CharField(max_length=50, null=True)
    cost = models.FloatField(null=True)
    number_of_products = models.IntegerField(null=True)
    total_quantity = models.FloatField(null=True)
    total_cost = models.FloatField(null=True)
