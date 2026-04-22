import django_filters
from . import models
import json

class ProductFilter(django_filters.FilterSet):

    def filter_queryset(self, queryset):
        super().filter_queryset(queryset)
        
        
        for key, value in dict(self.data).items():
            print(key, value)
            if key in self.Meta.fields:
                continue
        
        return queryset
    
    class Meta:
        model = models.Product
        fields = ['name', 'slug', 'category__slug']