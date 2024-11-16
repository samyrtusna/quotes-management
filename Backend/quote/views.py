from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
import math
from authentication.permissions import UserPermission
from .models.quote import Quote
from .models.quoteDetails import QuoteDetails
from rawProducts.models.raw_products import RawProduct
from products.models import Product
from productDetails.models import ProductDetails
from .serializers import QuoteSerializer, QuoteDetailsSerializer, CreateQuoteSerializer, CreateQuoteDetailsSerializer


class QuoteViewSet(viewsets.ModelViewSet):

    permission_classes = (UserPermission,IsAuthenticated)
    

    def get_queryset(self): 
        if not self.request.user.is_authenticated:
            raise NotAuthenticated('You are not authenticated')
        if self.request.user.is_superuser:
            return Quote.objects.all()
        return Quote.objects.filter(owner=self.request.user)


    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return CreateQuoteSerializer
        return QuoteSerializer
    
    def perform_destroy(self, instance):
        instance.soft_delete()

    
    def raw_product_quantity(self,formula,H,W):
        try:
            allowed_chars = "0123456789+-*/().HW "
            for char in formula:
                if char not in allowed_chars:
                    raise ValueError(f"Invalid character found in equation: {char}")

            
            result = eval(formula)
            return result
        except Exception as e:
            return str(e)
         


    @action(detail=False, methods=["post"])
    def calculate_product_amount(self, request): 
        user = request.user
        product_data = request.data 
        index = product_data["index"]
        height = float(product_data["height"])
        width = float(product_data["width"]) 
        quantity = int(product_data["quantity"])
        product_code = product_data["code"]
        costs = []
        raw_products_consumed = []

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

            formula_result = self.raw_product_quantity(detail.formula, height, width)
            raw_quantity = formula_result *int( detail.slices_quantity)
            if raw_product.mesure != "m²":
                raw_quantity = math.ceil(raw_quantity)
            cost = raw_quantity * int(raw_product.price) / raw_product.length
            costs.append(cost)
            raw_consumed = {
                    "index": index,
                    "code": raw_product.code,
                    "label": raw_product.label,
                    "quantity_by_product": round(raw_quantity, 2),
                    "mesure": raw_product.mesure,
                    "cost": round(cost, 2),
                    "number_of_products": quantity,
                    "total_quantity": round(raw_quantity * quantity, 2),
                    "total_cost": round(cost * quantity),
                }
            raw_products_consumed.append(raw_consumed)

        for i, a in enumerate(raw_products_consumed):
            for j, b in enumerate(raw_products_consumed):
                if i != j and a["code"] == b["code"]:
                    b["quantity_by_product"] = sum([b["quantity_by_product"], a["quantity_by_product"]])
                    b["cost"] = sum([b["cost"], a["cost"]])
                    b["total_quantity"] = sum([b["total_quantity"], a["total_quantity"]])
                    b["total_cost"] = sum([b["total_cost"], a["total_cost"]])
                    raw_products_consumed.remove(a)

            
        product_cost = round(sum(costs))
        product_amount = product_cost * 1.5
        total_cost = product_cost * quantity
        total_amount = round(product_amount * quantity, 2)
        return Response(
            {
                "index" : index,
                "code": product_code,
                "amount": total_amount,
                "total_cost": total_cost,
                "raw_product_consumed": raw_products_consumed,
            },
            status=status.HTTP_200_OK,
        )
 


    @action(detail=False, methods=["post"])
    def save_quote(self, request):
        quote_data = request.data
        serializer = CreateQuoteSerializer(data=quote_data, context={"request": request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuoteDetailsViewSet(viewsets.ModelViewSet):

    permission_classes = (UserPermission,IsAuthenticated)
    
    
    def get_queryset(self): 
        if not self.request.user.is_authenticated:
            raise NotAuthenticated('You are not authenticated')
        if self.request.user.is_superuser:
            return QuoteDetails.objects.all()
        return QuoteDetails.objects.filter(owner=self.request.user) 

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return CreateQuoteDetailsSerializer
        return QuoteDetailsSerializer
    
    def perform_destroy(self, instance):
        instance.soft_delete()
