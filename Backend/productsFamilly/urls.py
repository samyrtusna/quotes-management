from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ProductsFamillyViewSet

router = DefaultRouter()
router.register(r"products_familly", ProductsFamillyViewSet, basename="product familly")

urlpatterns = [
    path("", include(router.urls)), 
]
