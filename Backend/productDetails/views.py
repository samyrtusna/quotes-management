from rest_framework import viewsets
from .models import ProductDetails
from .serializers import ProductDetailsSerializer, CreateProductDetailsSerializer
from authentication.permissions import UserPermission



class ProductDetailsViewSet(viewsets.ModelViewSet):
    
    permission_classes = (UserPermission,)

    def get_queryset(self): 
        if self.request.user.is_superuser:
            return ProductDetails.objects.all()
        return ProductDetails.objects.filter(owner=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateProductDetailsSerializer
        return ProductDetailsSerializer
