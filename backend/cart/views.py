import uuid
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.decorators import action
from . import serializers, models

# Create your views here.

class CartViewSet(ModelViewSet):
    serializer_class = serializers.CartSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='add')
    def add_to_cart(self, request):
        cart_id = request.COOKIES.get('GUEST_CART_ID')
        filters = {
            'is_active': True
        }
        
        if request.user.is_authenticated:
            self.merge_user_guest_carts(request)
            filters['user'] = request.user
        else:
            if not cart_id:
                filters['session_id'] = str(uuid.uuid4())
            else:
                filters['session_id'] = cart_id
                
        cart, cart_created = models.Cart.objects.get_or_create(**filters)
        item, item_created = models.CartItem.objects.get_or_create(cart=cart, product_id=request.data.get('product'), defaults={'quantity': 1})

        if not item_created:
            item.quantity += 1
            item.save()

        status = 200
        if cart_created or item_created:
            status = 201
        
        response = Response(data=serializers.CartSerializer(cart).data, status=status)
        if not request.user.is_authenticated and not request.COOKIES.get("GUEST_CART_ID"):
            response.set_cookie('GUEST_CART_ID', cart.session_id, httponly=True, samesite='lax', max_age=60*60*24)
        
        if request.user.is_authenticated and request.COOKIES.get("GUEST_CART_ID"):
            response.delete_cookie('GUEST_CART_ID')
        
        return response

    def get_serializer_class(self):
        if self.action == 'add_to_cart':
            return serializers.AddToCartSerializer
        return serializers.CartSerializer
    
    def merge_user_guest_carts(self, request):
        cart_id = request.COOKIES.get('GUEST_CART_ID')
        
        if cart_id:
            user_cart, user_cart_created = models.Cart.objects.get_or_create(user=request.user, is_active=True)
            guest_cart = models.Cart.objects.filter(session_id=cart_id, is_active=True).first()
      
            if guest_cart:
                if not user_cart_created:
                    if not user_cart.id == guest_cart.id:
                        for guest_item in guest_cart.items.all():
                            user_product = user_cart.items.filter(product=guest_item.product).first()
                            
                            if user_product:
                                user_product.quantity += guest_item.quantity
                                user_product.save()
                            else:
                                models.CartItem.objects.create(cart=user_cart, product=guest_item.product, quantity=guest_item.quantity)
                else:
                    guest_cart.items.update(cart=user_cart)
            
                guest_cart.delete()
        
    def get_queryset(self):
        filters = {}
        
        if self.request.user.is_authenticated:
            filters['user'] = self.request.user
        else:
            filters['session_id'] = self.request.COOKIES.get("GUEST_CART_ID")
        
        if not self.request.user.is_authenticated and not self.request.COOKIES.get("GUEST_CART_ID"):
            return models.Cart.objects.none()
        
        return models.Cart.objects.prefetch_related('items__product__category').filter(**filters)
    
    def list(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            self.merge_user_guest_carts(request)
            
        response = super().list(request, *args, **kwargs)
        
        if request.user.is_authenticated and request.COOKIES.get("GUEST_CART_ID"):
            response.delete_cookie("GUEST_CART_ID")
        
        return response
    

class CartItemViewSet(ModelViewSet):
    serializer_class = serializers.CartItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return models.CartItem.objects.select_related('product__category').filter(cart__user=self.request.user)