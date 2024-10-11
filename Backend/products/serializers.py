from rest_framework import serializers
from .models.products import Product
from productsFamilly.models import ProductFamilly
from productDetails.serializers import ProductDetailsSerializer



class ProductSerializer(serializers.ModelSerializer):
    familly = serializers.PrimaryKeyRelatedField(queryset=ProductFamilly.objects.all())
    # retrieve related productDetails along with the product
    details = ProductDetailsSerializer(many=True, read_only=True, source="productdetails_set") 


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['familly'] = instance.familly.label if instance.familly else None
        return representation
    

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
