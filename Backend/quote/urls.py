from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import QuoteViewSet, QuoteDetailsViewSet

router = DefaultRouter()
router.register(r"quotes", QuoteViewSet, basename="quote")
router.register(r"quote_details", QuoteDetailsViewSet, basename="quote-details")

urlpatterns = [
    path("", include(router.urls)),
]
