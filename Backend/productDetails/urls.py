from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ProductDetailsViewSet

router = DefaultRouter()
router.register(r"product_details", ProductDetailsViewSet, basename="product-details")
urlpatterns = [
    path('', include(router.urls)),
]
