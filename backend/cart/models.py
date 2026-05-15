from django.db import models
from django.db.models import Sum, F
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator 
from products.models import Product
# Create your models here.


class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='carts')
    is_active = models.BooleanField(default=False)
    
    
    @property
    def total(self):
        result = self.items.aggregate(
            total_price = Sum(F('quantity') * F('product__price'))
        )

        return result['total_price'] or 0
    

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, blank=False, null=False, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=False, related_name="cart_item")
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])

