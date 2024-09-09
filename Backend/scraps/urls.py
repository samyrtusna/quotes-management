from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ScrapsViewset

router = DefaultRouter()
router.register("scraps", ScrapsViewset, basename="scraps")

urlpatterns = [
    path('', include(router.urls)), 
]

