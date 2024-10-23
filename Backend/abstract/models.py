from django.db import models
from django.utils import timezone


class AbstractManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)


class AbstractModel (models.Model):

    deleted_at = models.DateTimeField(null=True, default=None)

    objects = AbstractManager()
    all_objects = models.Manager()


    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        self.deleted_at = None
        self.save(update_fields=['deleted_at'])

    
    class Meta:
        abstract = True