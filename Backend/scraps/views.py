from collections import defaultdict
import itertools
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
    
    def perform_destroy(self, instance):
        instance.soft_delete()
    
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
        

    def calculate_scraps(self,lst, length):
        scraps_list = []
        while len(lst) > 0:
            # first condition : 
            if sum(lst) <= length:
                print("first condition satisfied")
                print("bars to remove", lst)
                scrap = length - sum(lst)
                scraps_list.append(scrap)
                lst = []  
            else:
                lst.sort()
                print("sorted list =", lst)
                ref = lst[-1]
                print("reference length =", ref)
                base_list = []

                for i in lst[:-1]:
                    if ref + i < length:
                        base_list.append(i)
                    elif ref + i == length:
                        print("best combination", [ref, i])
                        lst.remove(i)
                        lst.remove(ref)
                        break
                    else:
                        break

                base_list.insert(0, ref)
                print("base list =", base_list)

                #second condition
                if sum(base_list) <= length:
                    print("second condition satisfied")
                    print("bars to remove", base_list)
                    scrap = length - sum(base_list)
                    scraps_list.append(scrap)
                    for i in base_list:
                        lst.remove(i)
                else:
                    leng = len(base_list)
                    for n in range(1, leng):
                        for i in range(1, leng - n + 1):
                            if sum(base_list) - sum(base_list[i:i+n]) <= length:

                                # third conditon
                                if base_list[i-2] and sum(base_list) - sum(base_list[i-2:i+(n-1)]) <= length  and sum(base_list[i-2:i+(n-1)]) <= sum(base_list[i:i+n]):
                                    print("third condition satisfied")
                                    for x in base_list[i-2:i+(n-1)]:
                                        base_list.remove(x)
                                    print("bars to remove  = ",base_list)
                                    scrap = length - sum(base_list)
                                    scraps_list.append(scrap)
                                    for x in base_list:
                                        lst.remove(x)
                                    break

                                # fourth condition
                                elif base_list[i-1] and sum(base_list) - (sum(base_list[i+1:i+n]) + base_list[i-1]) <= length :
                                    elements_to_remove = base_list[i+1:i+n] +[base_list[i-1]]
                                    for x in elements_to_remove:
                                        print("fourth condition satisfied")
                                        base_list.remove(x)
                                    print("bars to remove  = ",base_list)
                                    scrap = length - sum(base_list)
                                    scraps_list.append(scrap)
                                    for x in base_list:
                                        lst.remove(x)
                                    break

                                # sixth condition
                                elif base_list[i-1] and sum(base_list) - (sum(base_list[i+1:i+n]) + base_list[i-1]+ base_list[1]) <= length and sum(base_list[i+1:i+n]) + base_list[i-1]+ base_list[1] < sum(base_list[i:i+n]) : 
                                    if base_list[i-2] and i-2 > 1:
                                        for a in base_list[i-2: 1:-1]:

                                            # fifth condition 
                                            if (sum(base_list) - (sum(base_list[i+1:i+n]) + base_list[i-1]+ a)) <= length and (sum(base_list[i+1:i+n]) + base_list[i-1]+ a) < sum(base_list[i:i+n]) : 
                                                print("fifth condition satisfied")
                                                elements_to_remove = base_list[i+1:i+n] + [base_list[i-1], a]
                                                for x in elements_to_remove:
                                                    print(x, "is removed")
                                                    base_list.remove(x)
                                        
                                                print("bars to remove  = ",base_list)
                                                scrap = length - sum(base_list)
                                                scraps_list.append(scrap)
                                                for x in base_list:
                                                    lst.remove(x)
                                                break
                                            else: 
                                                print("sixth condition satisfied")
                                                elements_to_remove = base_list[i+1:i+n] + [base_list[i-1] , base_list[1]]
                                                for x in elements_to_remove:
                                                    base_list.remove(x)
                                                print("bars to remove  = ",base_list)
                                                scrap = length - sum(base_list)
                                                scraps_list.append(scrap)
                                                for x in base_list:
                                                    lst.remove(x)
                                                break
                                        else:
                                            continue
                                        break
                                else:
                                    print("seventh condition satisfied")
                                    for x in base_list[i:i+n]:
                                        base_list.remove(x)
                                    print("bars to remove  = ",base_list)
                                    scrap = length - sum(base_list)
                                    scraps_list.append(scrap)
                                    for x in base_list:
                                        lst.remove(x)
                                    break
                        else:
                            continue
                        break

        print("scraps list =", scraps_list)
        return scraps_list

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
       


        
        grouped_slices = defaultdict(list)
        for sublist in bar_slices:
            for dictionary in sublist:
                for key, value in dictionary.items():
                    grouped_slices[key].append(value)

        grouped_slices_list = list(grouped_slices.items())

        keys=0
      
        for key, values in grouped_slices_list:
            
            raw_products = RawProduct.objects.get(code=key, owner=user)
            length = (raw_products.length * 1000) - 50
            slices_list = values
            print("slices_list : ",list (slices_list))
            scraps_list = self.calculate_scraps(slices_list, length)

            for item in scraps_list:
                scrap= {"code" :  key, "label" : raw_products.label, "length" : item/1000, "mesure" : raw_products.mesure }
                print ("Scraps : ", scrap)
                scraps.append(scrap)
        

        return Response(scraps, status=status.HTTP_200_OK) 
