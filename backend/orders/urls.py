from django.urls import path, include
from rest_framework_nested import routers
from . import views


router = routers.DefaultRouter()
router.register("orders", views.OrderViewSet, basename="orders")

urlpatterns = [
    path(
        "orders/create",
        views.CreateOrderView.as_view(),
        name="orders-create",
    ),
    path(
        "stripe/webhook/",
        views.StripeWebhookView.as_view(),
        name='stripe-webhook'
    ),
    path("", include(router.urls)),
]