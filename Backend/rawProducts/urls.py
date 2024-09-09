from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import RawProductViewSet,RawProductsConsumedViewset


router = DefaultRouter()
router.register(r"raw_products", RawProductViewSet, basename="raw product")
router.register(r"raws_consumed", RawProductsConsumedViewset, basename="raws consumed")

urlpatterns = [
    path("", include(router.urls)),
]
