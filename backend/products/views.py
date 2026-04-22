from django.shortcuts import render
from rest_framework import filters
from django_filters import rest_framework as django_filters
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.pagination import PageNumberPagination
from . import models
from . import serializers
from .filters import ProductFilter

# Create your views here.


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 1000


class ProductViewSet(ModelViewSet):
    queryset = models.Product.objects.select_related("category").prefetch_related("specification_values__specification").all()    
    serializer_class = serializers.ProductSerializer
    pagination_class = StandardResultsSetPagination
    lookup_field = "slug"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, django_filters.DjangoFilterBackend]
    search_fields = ["slug", "name"]
    filterset_class = ProductFilter
    ordering_fields = ["name", "price", "id"]
    ordering = ["id"]
    
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
            
        return [permission() for permission in permission_classes]
    

class CategoryViewSet(ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    lookup_field = "slug"


    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
            
        return [permission() for permission in permission_classes]
