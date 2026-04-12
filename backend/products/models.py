from django.db import models
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.text import slugify
from .utils import generate_unique_slug
# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=150, blank=False, null=False, unique=True)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self.name, Category, self.pk)
        super().save(*args, **kwargs)
    

class Specification(models.Model):
    TEXT = 'TEXT'
    NUMBER = 'NUMBER'
    BOOLEAN = 'BOOLEAN'
    TYPE_CHOICES = [
        (TEXT, 'text'),
        (NUMBER, 'number'),
        (BOOLEAN, 'boolean')
    ]
    name = models.CharField(max_length=150, blank=False, null=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='specifications', blank=True, null=True)
    type = models.CharField(max_length=15, choices=TYPE_CHOICES, default=TEXT)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'category'], name='unique_specification_per_category')
        ]


class Product(models.Model):
    name = models.CharField(max_length=150, blank=False, null=False)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    specifications = models.ManyToManyField(Specification, through='ProductSpecificationValue', related_name='products')
    slug = models.SlugField(blank=True, unique=True)
    product_img = models.ImageField(upload_to='images/')
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self.name, Product, self.pk)
                    
        super().save(*args, **kwargs)


class ProductSpecificationValue(models.Model):
    value = models.CharField(max_length=150, blank=False, null=False)
    specification = models.ForeignKey(Specification, on_delete=models.CASCADE, related_name='specification_values')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='specification_values')
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['specification', 'product'], name='unique_specification_per_product')
        ]
        

class Review(models.Model):
    title = models.CharField(max_length=100, blank=False, null=False)
    content = models.TextField()
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    created_at = models.DateField(auto_now_add=True)
    rating = models.IntegerField(validators=[
        MinValueValidator(1),
        MaxValueValidator(5)
    ], blank=False, null=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')