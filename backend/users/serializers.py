from rest_framework import serializers
from users.mixins import PasswordValidationMixin
from users import models
from django.contrib.auth import get_user_model

User = get_user_model()


class UserCreateSerializer(PasswordValidationMixin, serializers.ModelSerializer):
    verify_password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "password",
            "verify_password",
            "email",
            "date_of_birth",
            "phone_number",
            "first_name",
            "last_name",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        validated_data.pop("verify_password")

        user = User.objects.create_user(**validated_data)

        return user
    

class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserAddress
        fields = [
            "user",
            "city",
            "country",
            "address_line1",
            "postal_code",
            "is_default",
        ]
        
        
class AdminMeUserSerializer(serializers.ModelSerializer):
    addresses = UserAddressSerializer(many=True, read_only=True)
    
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "date_of_birth",
            "phone_number",
            "first_name",
            "last_name",
            "addresses"
        ]