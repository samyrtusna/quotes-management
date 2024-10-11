from django.db import models
from productsFamilly.models import ProductFamilly
from django.contrib.auth.models import User


class Product(models.Model):

    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    code = models.IntegerField(default=0)
    label = models.CharField(max_length=60)
    familly = models.ForeignKey(ProductFamilly, on_delete=models.CASCADE, null=True)
    color = models.CharField(max_length=50, default="blanc")

    def __str__(self):
        return self.label
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['owner', 'code'], name='unique_code_per_owner'),
            models.UniqueConstraint(fields=['owner', 'label'], name='unique_label_per_owner')
        ]
