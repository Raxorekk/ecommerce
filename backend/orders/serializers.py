from rest_framework import serializers
from . import models
from users.models import UserAddress
from products.serializers import ProductLightSerializer


class UserAddressField(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        request = self.context.get('request')
            
        if request and request.user.is_authenticated:
            return UserAddress.objects.filter(user=request.user)
        return UserAddress.objects.none()


class OrderAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrderAddress
        fields = ['city', 'country', 'address_line1', 'postal_code']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrderItem
        fields = ['quantity', 'price', 'name']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, required=False, read_only=True)
    saved_address = UserAddressField(write_only=True, required=False)
    address = OrderAddressSerializer(write_only=True, required=False)
    
    class Meta:
        model = models.Order
        fields = ['id', 'user', 'email', 'first_name', 'last_name', 'created_at', 'status', 'stripe_payment_id', 'currency', 'total', 'items', 'saved_address', 'address']
        read_only_fields = ['id','total', 'status', 'stripe_payment_id', 'user', 'created_at', 'currency']
        extra_kwargs = {
            'email': {'required': False, 'allow_blank': True},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
        }
        
    def validate(self, attrs):
        request = self.context.get('request')
        email = attrs.get('email')
        first_name = attrs.get('first_name')
        last_name = attrs.get('last_name')
        address = attrs.get('address')
        saved_address = attrs.get('saved_address')
        errors = {}

        if not request.user.is_authenticated:
            if not email:
                errors['email'] = 'Guest must provide email'
            if not first_name:
                errors['first_name'] = 'Guest must provide first name'
            if not last_name:
                errors['last_name'] = 'Guest must provide last name'
            if saved_address:
                errors['saved_address'] = "Guest must provide new address"
                
        if not saved_address and not address:
            errors['address'] = 'Provide address'
        if saved_address and address:
            errors['address'] = 'Provide only one address'
            
        if errors:
            raise serializers.ValidationError(errors)
        
        return attrs