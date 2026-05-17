from django.urls import path, include
from rest_framework_nested import routers
from . import views

router = routers.DefaultRouter()
router.register("cart", views.CartViewSet, basename="cart")
router.register("cart-items", views.CartItemViewSet, basename='cart-items')


urlpatterns = [
    path("", include(router.urls)),
]