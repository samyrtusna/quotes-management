from rest_framework import serializers
from .models import ProductDetails
from products.models.products import Product
from rawProducts.models.raw_products import RawProduct


class ProductDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductDetails
        fields = ["id", "owner", "product", "raw_product", "formula", "slices_quantity"]
    
    

class CreateProductDetailsSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
   
    class Meta:
        model = ProductDetails
        fields = ["id", "product", "raw_product", "formula", "slices_quantity"]
        