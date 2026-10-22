from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator 
from products.models import Product
from users.models import Address

# Create your models here.

class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending'
        PAID = 'paid'
        SHIPPED = 'shipped'
        DELIVERED = 'delivered'
        FAILED = 'failed'
        CANCELLED = 'cancelled'

    class Currency(models.TextChoices):
        PLN = 'pln'
        EUR = 'eur'
        USD = 'usd'
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    email = models.EmailField(blank=False)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=25, choices=Status, default=Status.PENDING)
    stripe_payment_id = models.CharField(max_length=200, blank=True, null=True)
    currency = models.CharField(max_length=3, choices=Currency, default=Currency.PLN)
    total = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    name = models.CharField(max_length=150, blank=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=False)
    quantity = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['order', 'product'],
                name='unique_order_product'
            ),
            models.CheckConstraint(
                condition=models.Q(quantity__gte=1),
                name='quantity_gte_1',
                violation_error_message='Quantity must be greater than 0'
            )
        ]


class OrderAddress(Address):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=False, related_name='address')