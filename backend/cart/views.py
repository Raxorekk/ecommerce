from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.decorators import action
from . import serializers, models

# Create your views here.


class CartViewSet(ModelViewSet):
    queryset = models.Cart.objects.all()
    serializer_class = serializers.CartSerializer
    permission_classes = [IsAuthenticated]


    @action(detail=False, methods=['post'], url_path='add')
    def add_to_cart(self, request):
        cart, cart_created = models.Cart.objects.get_or_create(is_active=True, user=request.user)
        item, item_created = models.CartItem.objects.get_or_create(cart=cart, product_id=request.data['product'], defaults={'quantity': 1})
        
        if not item_created:
            item.quantity += 1
            item.save()
            
        return Response(serializers.CartSerializer(cart).data)
        
    @action(detail=True, methods=['delete'], url_path="remove")
    def remove_from_cart(self, request, pk):
        print('c')
        
    def get_serializer_class(self):
        if self.action == 'add_to_cart':
            return serializers.AddToCartSerializer
        elif self.action == 'remove_from_cart':
            return serializers.CartItemSerializer
        return serializers.CartSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["user"] = self.request.user

        return context