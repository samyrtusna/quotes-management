from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from .serializers import RegistrationSerializer, LoginSerializer, LogoutSerializer

class RegisterViewSet(ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

class LoginViewSet(ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class LogoutViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_204_NO_CONTENT)
