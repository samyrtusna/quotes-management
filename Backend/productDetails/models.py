from django.db import models
from abstract.models import AbstractModel
from products.models import Product
from rawProducts.models.raw_products import RawProduct
from django.contrib.auth.models import User

class ProductDetails(AbstractModel):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    raw_product = models.ForeignKey(RawProduct, on_delete=models.CASCADE, null=True)
    formula = models.TextField()
    slices_quantity = models.IntegerField(default=1)
