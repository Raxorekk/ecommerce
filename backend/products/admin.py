from django.contrib import admin
from . import models

# Register your models here.
admin.site.register(models.Category)
admin.site.register(models.Specification)
admin.site.register(models.Review)

class ProductSpecificationValuesInline(admin.StackedInline):
    model=models.ProductSpecificationValue
    extra=1

class ProductAdmin(admin.ModelAdmin):
    inlines=[ProductSpecificationValuesInline]
    readonly_fields = ['slug']

admin.site.register(models.Product, ProductAdmin)