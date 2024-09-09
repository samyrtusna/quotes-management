from rest_framework.routers import DefaultRouter
from django.urls import include, path
from . import views

router = DefaultRouter()
router.register(r'signup', views.RegisterViewSet, basename= 'signup')
router.register(r'login', views.LoginViewSet, basename='login')
router.register(r'logout', views.LogoutViewSet, basename='logout')

urlpatterns = [
    path("", include(router.urls)),  
]
 