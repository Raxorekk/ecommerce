from rest_framework import serializers
from . import models
from products.serializers import ProductLightSerializer


class AddToCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CartItem
        fields = ['product', 'quantity']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductLightSerializer()
    class Meta:
        model = models.CartItem
        fields = ['product', 'quantity']
        

class CartSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = models.Cart
        fields = ['user', 'is_active', 'items']
    
    def get_items(self, obj):
        return CartItemSerializer(
            models.CartItem.objects.select_related('product').filter(cart=obj),
            many=True
        ).data