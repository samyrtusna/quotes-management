from rest_framework import serializers
from .models import Scraps

class ScrapsSerializer(serializers.ModelSerializer):
      
    class Meta:
        model = Scraps
        fields = ["id", "code","owner", "label","length", "mesure"]



class CreateScrapsSerializer(serializers.ModelSerializer):
    
    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
    
    
    class Meta:
        model = Scraps
        fields = ["code", "label","length", "mesure"]