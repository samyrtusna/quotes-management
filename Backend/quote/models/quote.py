from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Quote(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True)  
    reference = models.CharField(max_length=50)
    client_name = models.CharField(("client name"), max_length=50)
    date = models.DateField(auto_now=False, auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],default='pending')

    def save(self, *args, **kwargs):
        if not self.reference:
            current_year = timezone.now().year
            year_suffix = str(current_year)[-2:]
            last_quote = (
                Quote.objects.filter(reference__startswith=f"Q-{year_suffix}-")
                .order_by("id")
                .last()
            )
            if last_quote:
                last_number = int(last_quote.reference.split("-")[-1])
                next_number = last_number + 1
            else:
                next_number = 1
            self.reference = f"Q-{year_suffix}-{next_number:03}"

        super().save(*args, **kwargs)

    def __str__(self):
        return self.client_name
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['owner', 'reference'], name='unique_reference_per_owner')
        ]

