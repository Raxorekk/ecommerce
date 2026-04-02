from django.contrib.auth.password_validation import validate_password
from rest_framework.exceptions import ValidationError
import re


class PasswordValidationMixin:
    def validate_password(self, value):
        validate_password(value)

        return value

    def validate(self, data):
        super().validate(data)
        password = data.get("password")
        verify_password = data.get("verify_password")
        
        if not password or not verify_password:
            raise ValidationError("Missing password input.")

        if password != verify_password:
            raise ValidationError("Both passwords must be the same")

        return data


class PasswordChangeValidationMixin:
    def validate_new_password(self, value):
        validate_password(value)

        return value

    def validate_old_password(self, value):
        user = self.context["request"].user

        if not user.check_password(value):
            raise ValidationError("Incorrect old password")

        return value

    def validate(self, data):
        super().validate(data)
        new_password = data.get("new_password")
        new_password_confirmation = data.get("new_password_confirmation")
        
        if not new_password or not new_password_confirmation:
            raise ValidationError("Missing password input.")
        
        if new_password != new_password_confirmation:
            raise ValidationError("Both passwords must be the same")

        return data
