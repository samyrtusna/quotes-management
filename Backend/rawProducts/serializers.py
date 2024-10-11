from rest_framework import serializers
from .models.raw_products import RawProduct
from .models.raw_products_consumed import RawProductsConsumed
from products.serializers import ProductSerializer
from quote.models import QuoteDetails

class RawProductSerializer(serializers.ModelSerializer):

    
    class Meta:
        model = RawProduct
        fields = ["id","owner", "code", "label", "price", "mesure", "length"]

class CreateRawProductSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
    
    class Meta:
        model = RawProduct
        fields = ["id", "code", "label", "price", "mesure", "length"]



class RawProductsConsumedSerializers(serializers.ModelSerializer):
    quote_details = serializers.PrimaryKeyRelatedField(queryset=QuoteDetails.objects.all())

    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['quote_details'] = ProductSerializer(instance.quote_details.product).data if instance.quote_details else None
        return representation
    
    

    class Meta:
        model = RawProductsConsumed
        fields = ["id", "owner", "quote_details", "label", "quantity_by_product", "mesure", "cost", "number_of_products", "total_quantity", "total_cost"]

class CreateRawProductsConsumedSerializers(serializers.ModelSerializer):
    
    
    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)

    class Meta:
        model = RawProductsConsumed
        fields = ["id", "quote_details", "label", "quantity_by_product", "mesure", "cost", "number_of_products", "total_quantity", "total_cost"]
