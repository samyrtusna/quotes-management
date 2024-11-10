from rest_framework import serializers
from .models import Product
from productsFamilly.models import ProductFamilly
from productDetails.serializers import ProductDetailsSerializer



class ProductSerializer(serializers.ModelSerializer):
    familly = serializers.SlugRelatedField(queryset=ProductFamilly.objects.all(), slug_field = "label")
    details = ProductDetailsSerializer(many=True, read_only=True, source="productdetails_set") # retrieve related productDetails along with the product


  
    

    class Meta:
        model = Product
        fields = ["id", "owner", "code", "label", "familly", "color", "details"]


    
class CreateProductSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
    
    
    class Meta:
        model = Product
        fields = ["id", "code", "label", "familly", "color"]
