from django.db import models
from django.contrib.auth.models import User


class RawProduct(models.Model):

    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    code = models.IntegerField()
    label = models.CharField(max_length=35)
    price = models.DecimalField( max_digits=7, decimal_places=2)
    mesure = models.CharField( max_length=50, null=True)
    length = models.FloatField(default=1)


    def __str__(self):
        return self.label
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['owner', 'code'], name='unique_code_per_author'),
            models.UniqueConstraint(fields=['owner', 'label'], name='unique_label_per_author')
        ]
