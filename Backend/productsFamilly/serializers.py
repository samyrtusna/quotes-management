from rest_framework import serializers
from .models import ProductFamilly


class ProductsFamillySerializers(serializers.ModelSerializer):
    
    class Meta:
        model = ProductFamilly
        fields = ["id","owner", "code","label"]



class CreateProductsFamillySerializers(serializers.ModelSerializer):

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
    
    
    class Meta:
        model = ProductFamilly
        fields = ["id", "code","label"]
