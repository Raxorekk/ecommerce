from django.urls import path, include
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register("products", views.ProductViewSet, basename="products")
router.register("categories", views.CategoryViewSet, basename="categories")
router.register("reviews", views.ReviewViewSet, basename='reviews')

urlpatterns = [
    path("", include(router.urls)),
]