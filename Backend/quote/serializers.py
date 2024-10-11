from rest_framework import serializers
from .models import Quote, QuoteDetails
from products.models import Product
from rawProducts.serializers import RawProductsConsumedSerializers 

class QuoteDetailsSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    quote = serializers.PrimaryKeyRelatedField(queryset=Quote.objects.all())
    raws_consumed = RawProductsConsumedSerializers(many=True, read_only= True, source= 'rawproductsconsumed_set')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["product"] = instance.product.label if instance.product else None 
        representation["quote"] = instance.quote.reference if instance.quote else None
        return representation

    

    class Meta:
        model = QuoteDetails
        fields = ["id", "owner", "product", "quote", "quantity", "amount", "height", "width", "raws_consumed"]

    
    # def get_fields(self): 
    #     fields = super().get_fields()
    #     fields['raws_consumed'] = RawProductsConsumedSerializers(many=True, source='rawproductsconsumed_set')
    #     return fields
    
class CreateQuoteDetailsSerializer(serializers.ModelSerializer): 

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
    

    class Meta: 
        model = QuoteDetails
        fields = ["id", "product", "quote", "quantity", "amount", "height", "width"]

        

class QuoteSerializer(serializers.ModelSerializer):
    details = QuoteDetailsSerializer(many=True, read_only=True)

    class Meta:
        model = Quote
        fields = ["id","owner", "reference", "client_name", "date", "amount", "status", "details"]

        

class CreateQuoteSerializer(serializers.ModelSerializer):


    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
    
    class Meta:
        model = Quote
        fields = ["id", "client_name", "date", "amount"]
