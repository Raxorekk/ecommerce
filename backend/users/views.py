from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.viewsets import ModelViewSet
from users import serializers, models
from django.contrib.auth import get_user_model

User = get_user_model()


class AdminUserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = serializers.AdminMeUserSerializer
    permission_classes = [IsAdminUser]


class CreateUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = serializers.UserCreateSerializer
    permission_classes = [AllowAny]
    
    
class UserAddressesViewSet(ModelViewSet):
    queryset = models.UserAddress.objects.all()
    permission_classes = [IsAuthenticated]