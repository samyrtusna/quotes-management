from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotAuthenticated
from .models.raw_products import RawProduct
from .models.raw_products_consumed import RawProductsConsumed
from .serializers import RawProductSerializer, RawProductsConsumedSerializers, CreateRawProductSerializer, CreateRawProductsConsumedSerializers
from authentication.permissions import UserPermission


class RawProductViewSet(viewsets.ModelViewSet):
    
    permission_classes = (UserPermission,IsAuthenticated)

    def get_queryset(self): 
        if not self.request.user.is_authenticated:
            raise NotAuthenticated('You are not authenticated')
        if self.request.user.is_superuser:
            return RawProduct.all_objects.all()
        return RawProduct.objects.filter(owner=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateRawProductSerializer
        return RawProductSerializer
    
    def perform_destroy(self, instance):
        instance.soft_delete()
        print(f"Soft deleting instance: {instance}")
    

    

class RawProductsConsumedViewset(viewsets.ModelViewSet):
    
    permission_classes = (UserPermission,IsAuthenticated)

    def get_queryset(self): 
        if not self.request.user.IsAuthenticated:
            raise NotAuthenticated('You are not Authenticated')
        if self.request.user.is_superuser:
            return RawProductsConsumed.objects.all()
        return RawProductsConsumed.objects.filter(owner=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateRawProductsConsumedSerializers
        return RawProductsConsumedSerializers
    
    def perform_destroy(self, instance):
        instance.soft_delete()
   
