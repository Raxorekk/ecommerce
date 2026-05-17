from rest_framework import serializers
from . import models
from products.serializers import ProductLightSerializer


class AddToCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CartItem
        fields = ['product', 'quantity']


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductLightSerializer(read_only=True)
    
    class Meta:
        model = models.CartItem
        fields = ['id','cart', 'product', 'quantity']
        

class CartSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = models.Cart
        fields = ['user', 'is_active', 'total', 'items']
    
    def get_items(self, obj):
        return CartItemSerializer(
            obj.items.all(),
            many=True,
            context=self.context
        ).data
        