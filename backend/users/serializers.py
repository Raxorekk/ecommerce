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
    

class UserAddressesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserAddress
        fields = [
            "user",
            "city",
            "country",
            "address_line1",
            "is_default",
        ]