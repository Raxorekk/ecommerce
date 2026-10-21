import uuid
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.decorators import action
from .utils import merge_user_guest_carts
from . import serializers, models


class CartViewSet(ModelViewSet):
    @action(detail=False, methods=['post'], url_path='add')
    def add_to_cart(self, request):
        cart_id = request.COOKIES.get('GUEST_CART_ID')
        filters = {
            'is_active': True
        }
        item_quantity = int(request.data.get('quantity', 1))
        
        if item_quantity <= 0:
            return Response({"error": 'Quantity must be greater than 0'}, status=400)
        
        if request.user.is_authenticated:
            merge_user_guest_carts(request)
            filters['user'] = request.user
        else:
            if not cart_id:
                filters['session_id'] = str(uuid.uuid4())
            else:
                filters['session_id'] = cart_id
                
        cart, cart_created = models.Cart.objects.get_or_create(**filters)
        item, item_created = models.CartItem.objects.get_or_create(
            cart=cart, 
            product_id=request.data.get('product_id'), 
            defaults={'quantity': item_quantity}
        )
        
        if not item_created:
            item.quantity += item_quantity
            item.save()
            
        status = 200
        if cart_created or item_created:
            status = 201
        
        response = Response(data=serializers.CartSerializer(cart).data, status=status)
        
        if not request.user.is_authenticated and not cart_id:
            response.set_cookie('GUEST_CART_ID', cart.session_id, httponly=True, samesite='lax', max_age=60*60*24*30)
        
        if request.user.is_authenticated and cart_id:
            response.delete_cookie('GUEST_CART_ID')
        
        return response

    def get_serializer_class(self):
        if self.action == 'add_to_cart':
            return serializers.AddToCartSerializer
        return serializers.CartSerializer
    
    def get_queryset(self):
        filters = {
            'is_active': True
        }
        
        if self.request.user.is_authenticated:
            filters['user'] = self.request.user
        else:
            filters['session_id'] = self.request.COOKIES.get("GUEST_CART_ID")
        
        if not self.request.user.is_authenticated and not self.request.COOKIES.get("GUEST_CART_ID"):
            return models.Cart.objects.none()
        
        return models.Cart.objects.prefetch_related('items__product__category').filter(**filters)
    
    def get_permissions(self):
        if self.action in ['add_to_cart', 'list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
            
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            merge_user_guest_carts(request)
            
        response = super().list(request, *args, **kwargs)
        
        if request.user.is_authenticated and request.COOKIES.get("GUEST_CART_ID"):
            response.delete_cookie("GUEST_CART_ID")
        
        return response
    

class CartItemViewSet(ModelViewSet):
    serializer_class = serializers.CartItemSerializer
    
    def get_permissions(self):
        if self.action in ['partial_update', 'destroy']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]

        return [permission() for permission in permission_classes]
    
    def partial_update(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            merge_user_guest_carts(request)
            
        response = super().partial_update(request, *args, **kwargs)
        
        if request.user.is_authenticated and request.COOKIES.get("GUEST_CART_ID"):
            response.delete_cookie("GUEST_CART_ID")
        
        return response

    def destroy(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            merge_user_guest_carts(request)
            
        response = super().destroy(request, *args, **kwargs)
        
        if request.user.is_authenticated and request.COOKIES.get("GUEST_CART_ID"):
            response.delete_cookie("GUEST_CART_ID")
    
        return response
        
    def get_queryset(self):
        filters = {}
        
        if self.request.user.is_authenticated:
            filters['cart__user'] = self.request.user
        else:
            filters['cart__session_id'] = self.request.COOKIES.get('GUEST_CART_ID')

        if not self.request.user.is_authenticated and not self.request.COOKIES.get('GUEST_CART_ID'):
            return models.CartItem.objects.none()

        return models.CartItem.objects.select_related('product__category').filter(**filters)