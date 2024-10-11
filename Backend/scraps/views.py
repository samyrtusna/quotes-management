from collections import defaultdict
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotAuthenticated
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from authentication.permissions import UserPermission
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from .models import Scraps
from .serializers import ScrapsSerializer, CreateScrapsSerializer
from rawProducts.models.raw_products import RawProduct
from products.models import Product
from productDetails.models import ProductDetails


class ScrapsViewset(viewsets.ModelViewSet):
    
    permission_classes = (UserPermission, IsAuthenticated)

    def get_queryset(self): 
        if not self.request.user.is_authenticated:
            raise NotAuthenticated('You are not authenticated')
        if self.request.user.is_superuser:
            return Scraps.objects.all()
        return Scraps.objects.filter(owner=self.request.user)
    
    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateScrapsSerializer
        return ScrapsSerializer
    
    def item_length(self,formula,H,W):
        try:
            allowed_chars = "0123456789+-*/().HW "
            for char in formula:
                if char not in allowed_chars:
                    raise ValueError(f"Invalid character found in equation: {char}")

            
            result = eval(formula)
            return result
        except Exception as e:
            return str(e)
        

    def scraps_list(self, item_bars,bar, length):
        scraps = []
       
        while len(item_bars) > 0:
            min_item = min(item_bars)
            if min_item > bar:
                scraps.append(bar)
                bar = length
            else:
                max_item = max([item for item in item_bars if item 
                <= bar])
                bar -= max_item
                item_bars.remove(max_item)
  
        scraps.append(bar)
        print(f"Final scraps: {scraps}")
        return scraps

    @action(detail=False, methods=["POST"])
    def calculate_scraps_bars(self, request):
        data = request.data
        user = self.request.user
        bar_slices = []
        scraps = []

        for p in data:
            index = p["index"]
            height = (float(p["height"])) * 1000
            width = (float(p["width"])) * 1000
            quantity = int(p["quantity"])
            product_code = p["code"]

            try:
                product = Product.objects.get(code=product_code, owner=user)
            except ObjectDoesNotExist:
                return Response(
                    {"error": "One or more products not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            except MultipleObjectsReturned:
                return Response(
                    {"error": "Multiple products found for one or more codes."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                product_details = ProductDetails.objects.filter(product=product.id)
            except ObjectDoesNotExist:
                return Response(
                    {"error": "One or more productDetails not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            except MultipleObjectsReturned:
                return Response(
                    {"error": "Multiple productDetails found for one or more codes."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        
            for detail in product_details :
                try:
                    raw_product = RawProduct.objects.get(id=detail.raw_product.id, owner=user) 
                except ObjectDoesNotExist:
                    return Response(
                        {"error": "One or more raw products not found."},
                        status=status.HTTP_404_NOT_FOUND,
                    )
                except MultipleObjectsReturned:
                    return Response(
                        {"error": "Multiple raw products found for one or more codes."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
               
                if raw_product.mesure == "m":
                    slice_length = self.item_length(detail.formula, height, width)
                    slice = {raw_product.code : int(slice_length)}
                    detail_slices=[slice for _ in range (detail.slices_quantity*quantity)]
                    bar_slices.append(detail_slices)
        # print (bar_slices)
        # print()


        
        grouped_slices = defaultdict(list)
        for sublist in bar_slices:
            for dictionary in sublist:
                for key, value in dictionary.items():
                    grouped_slices[key].append(value)

        grouped_slices_list = list(grouped_slices.items())
        print ("grouped slices list : ", grouped_slices_list)

        keys=0
      
        for key, values in grouped_slices_list:
            
            raw_products = RawProduct.objects.get(code=key, owner=user)
            print("raw_product : ", raw_products.label)
            length = raw_products.length * 1000
            print("length : ", length)
            slices_list = values
            print("slices_list : ",list (slices_list))
            scraps_list = self.scraps_list(slices_list, length, length)

            for item in scraps_list:
                scrap= {"code" :  key, "label" : raw_products.label, "length" : item/1000, "mesure" : raw_products.mesure }
                print ("Scraps : ", scrap)
                scraps.append(scrap)
        

        return Response(scraps, status=status.HTTP_200_OK) 
