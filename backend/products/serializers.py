from rest_framework import serializers
from users.serializers import UserLightSerializer
from . import models
        
        
class SpecificationSerializer(serializers.ModelSerializer):
    values = serializers.SerializerMethodField()
    
    class Meta:
        model = models.Specification
        fields = ["name", "type", "slug", "values"]
        
    def get_values(self, obj):
        return models.ProductSpecificationValue.objects.select_related("specification") \
            .filter(specification=obj) \
            .values_list('value', flat=True) \
            .distinct()


class SpecificationValueSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='specification.name')
    slug = serializers.CharField(source="specification.slug")
    
    class Meta:
        model = models.ProductSpecificationValue
        fields = ["name", "slug", "value"]


class CategorySerializer(serializers.ModelSerializer):
    specifications = serializers.SerializerMethodField()
    
    class Meta:
        model = models.Category
        fields = ["name", "slug", "emoji", "specifications"]
        
    def get_specifications(self, obj):
        return SpecificationSerializer(
            models.Specification.objects.prefetch_related("specification_values") 
            .select_related("category") 
            .filter(category=obj) 
            .distinct(), 
            many=True 
        ).data
        

class CategoryLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ["name", "slug", "emoji"]
        

class ReviewSerializer(serializers.ModelSerializer):
    user = UserLightSerializer()
    
    class Meta:
        model = models.Review
        fields = ['title', 'content', 'user', 'created_at', 'rating', 'product']


class ProductSerializer(serializers.ModelSerializer):
    category = CategoryLightSerializer()
    specification_values = SpecificationValueSerializer(many=True)
    reviews = ReviewSerializer(many=True)
    
    class Meta:
        model = models.Product
        fields = ['id', 'name', 'description', 'price', 'category', 'specification_values', "slug", "reviews", "product_img"]