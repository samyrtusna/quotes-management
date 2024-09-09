from rest_framework import viewsets
from .models import ProductFamilly
from .serializers import ProductsFamillySerializers, CreateProductsFamillySerializers
from authentication.permissions import UserPermission


class ProductsFamillyViewSet(viewsets.ModelViewSet):
    
    permission_classes = (UserPermission,)

    def get_queryset(self): 
        if self.request.user.is_superuser:
            return ProductFamilly.objects.all()
        return ProductFamilly.objects.filter(owner=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateProductsFamillySerializers
        return ProductsFamillySerializers
