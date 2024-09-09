from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token



class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name']

    def create(self, validated_data):
        # The create method is overridden to ensure the password is properly hashed
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user



class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        # Authenticate the user
        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError('Invalid credentials')

        # If authentication is successful, get or create a token
        token, created = Token.objects.get_or_create(user=user)
        return {
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_superuser': user.is_superuser,
            },
            'token': token.key
        }



class LogoutSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate(self, attrs):
        token = attrs.get('token')
        if token is None:
            raise serializers.ValidationError('A token is required')

        # Attempt to delete the token to log the user out
        try:
            token_instance = Token.objects.get(key=token)
            token_instance.delete()
        except Token.DoesNotExist:
            raise serializers.ValidationError('The token is invalid or has already been logged out')

        return {}