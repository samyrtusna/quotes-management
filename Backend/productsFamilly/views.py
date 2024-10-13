from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotAuthenticated
from .models import ProductFamilly
from .serializers import ProductsFamillySerializers, CreateProductsFamillySerializers
from authentication.permissions import UserPermission


class ProductsFamillyViewSet(viewsets.ModelViewSet):
    
    permission_classes = (UserPermission,IsAuthenticated)

    def get_queryset(self): 
        if not self.request.user.is_authenticated:
            raise NotAuthenticated('You are not authenticated')
        if self.request.user.is_superuser:
            return ProductFamilly.objects.all()
        return ProductFamilly.objects.filter(owner=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateProductsFamillySerializers
        return ProductsFamillySerializers
    
    def perform_destroy(self, instance):
        instance.soft_delete()
