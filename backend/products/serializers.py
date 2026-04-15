from rest_framework import serializers
from . import models


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ["name", "slug"]
        

class SpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Specification
        fields = ["id", "name", "category", "type"]
        

class SpecificationValueSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='specification.name')
    
    class Meta:
        model = models.ProductSpecificationValue
        fields = ["name", "value"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    specification_values = SpecificationValueSerializer(many=True)
    
    class Meta:
        model = models.Product
        fields = ['id', 'name', 'description', 'price', 'category', 'specification_values', "slug", "reviews", "product_img"]