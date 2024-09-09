from django.contrib import admin
from .models.raw_products import RawProduct
from .models.raw_products_consumed import RawProductsConsumed


admin.site.register(RawProduct)
admin.site.register(RawProductsConsumed)
