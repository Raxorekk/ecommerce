from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
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
    
    
class UserAddressViewSet(ModelViewSet):
    serializer_class = serializers.UserAddressSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'], url_path='set-default')
    def set_default(self, request, pk=None):
        address = self.get_object()
        address.make_default()
        
        serializer = self.get_serializer(instance=address)

        return Response(data=serializer.data, status=200)

    def perform_create(self, serializer):
        user = self.request.user
        is_first = not user.addresses.exists()
        
        serializer.save(user=user, is_default=is_first)
        
    def perform_destroy(self, instance):
        owner = instance.user
        was_default = instance.is_default
        instance.delete()

        if was_default:
            new_default_address = models.UserAddress.objects.filter(user=owner).order_by('-id').first()
            if new_default_address:
                new_default_address.make_default()
        
    def get_queryset(self):
        return models.UserAddress.objects.filter(user=self.request.user)
