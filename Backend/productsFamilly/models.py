from django.db import models
from django.contrib.auth.models import User

class ProductFamilly(models.Model):
    
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    code = models.IntegerField(default= 0)
    label = models.CharField(max_length=35)

    def __str__(self):
        return self.label
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['owner', 'code'], name='unique_code_per_user'),
            models.UniqueConstraint(fields=['owner', 'label'], name='unique_label_per_user')
        ]

