from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotAuthenticated
from .models import ProductDetails
from .serializers import ProductDetailsSerializer, CreateProductDetailsSerializer
from authentication.permissions import UserPermission



class ProductDetailsViewSet(viewsets.ModelViewSet):
    
    permission_classes = (UserPermission,IsAuthenticated)

    def get_queryset(self): 
        if not self.request.user.is_authenticated:
            raise NotAuthenticated('You are not authenticated')
        if self.request.user.is_superuser:
            return ProductDetails.objects.all()
        return ProductDetails.objects.filter(owner=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateProductDetailsSerializer
        return ProductDetailsSerializer
