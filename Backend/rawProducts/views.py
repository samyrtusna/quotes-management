from rest_framework import viewsets
from .models.raw_products import RawProduct
from .models.raw_products_consumed import RawProductsConsumed
from .serializers import RawProductSerializer, RawProductsConsumedSerializers, CreateRawProductSerializer, CreateRawProductsConsumedSerializers
from authentication.permissions import UserPermission


class RawProductViewSet(viewsets.ModelViewSet):
    
    permission_classes = (UserPermission,)

    def get_queryset(self): 
        if self.request.user.is_superuser:
            return RawProduct.objects.all()
        return RawProduct.objects.filter(owner=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateRawProductSerializer
        return RawProductSerializer
    

    

class RawProductsConsumedViewset(viewsets.ModelViewSet):
    
    permission_classes = (UserPermission,)

    def get_queryset(self): 
        if self.request.user.is_superuser:
            return RawProductsConsumed.objects.all()
        return RawProductsConsumed.objects.filter(owner=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateRawProductsConsumedSerializers
        return RawProductsConsumedSerializers
   
