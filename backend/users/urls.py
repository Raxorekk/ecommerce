from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_nested import routers
from users import views

router = routers.DefaultRouter()
router.register("addresses", views.UserAddressViewSet, basename="user_addresses")
router.register("accounts", views.AdminUserViewSet, basename="user_accounts")


urlpatterns = [
    path("create-account", views.CreateUserView.as_view(), name="create-account"),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh", TokenRefreshView.as_view(), name="refresh_token"),
    path("", include(router.urls)),
]
