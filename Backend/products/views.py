from rest_framework import viewsets
from authentication.permissions import UserPermission
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotAuthenticated
from .models import Product
from .serializers import ProductSerializer, CreateProductSerializer


class ProductViewSet(viewsets.ModelViewSet):

    permission_classes = (UserPermission,)
    
    
    def get_queryset(self): 
        if not self.request.user.is_authenticated:
            raise NotAuthenticated('You are not authenticated')
        if self.request.user.is_superuser:
            return Product.objects.all()
        return Product.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateProductSerializer
        return ProductSerializer
