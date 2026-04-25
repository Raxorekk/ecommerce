import django_filters
from . import models

class ProductFilter(django_filters.FilterSet):
    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)
        
        # specification values filtering
        for key in self.data.keys():
            print(key)
            if key in self.filters.keys() or key in ['ordering', 'page']:
                continue
            queryset = queryset.filter(specification_values__specification__slug=key, specification_values__value__in=self.data.getlist(key))
        
        return queryset.distinct()
    
    class Meta:
        model = models.Product
        fields = ['name', 'slug', 'category__slug']