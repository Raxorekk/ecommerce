from rest_framework import serializers
from . import models


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Cart
        fields = ['user', 'is_active', 'items']
        

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CartItem
        fields = ['cart', 'product', 'quantity']