from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.decorators import action
from . import serializers, models

# Create your views here.


class CartViewSet(ModelViewSet):
    serializer_class = serializers.CartSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='add')
    def add_to_cart(self, request):
        cart, cart_created = models.Cart.objects.get_or_create(is_active=True, user=request.user)
        item, item_created = models.CartItem.objects.get_or_create(cart=cart, product_id=request.data.get('product'), defaults={'quantity': 1})

        if not item_created:
            item.quantity += 1
            item.save()
            
        return Response(data=serializers.CartSerializer(cart).data, status=200)

    def get_serializer_class(self):
        if self.action == 'add_to_cart':
            return serializers.AddToCartSerializer
        return serializers.CartSerializer
    
    def get_queryset(self):
        return models.Cart.objects.prefetch_related('items__product__category').filter(user=self.request.user)
    

class CartItemViewSet(ModelViewSet):
    serializer_class = serializers.CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return models.CartItem.objects.select_related('product__category').filter(cart__user=self.request.user)