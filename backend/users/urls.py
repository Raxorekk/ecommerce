from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_nested import routers
from users import views

router = routers.DefaultRouter()
router.register("", views.AdminUserViewSet, basename="users")

users_router = routers.NestedSimpleRouter(router, "", lookup='')
users_router.register("addresses", views.UserAddressViewSet, basename='addresses')

urlpatterns = [
    path("create-account", views.CreateUserView.as_view(), name="create-account"),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh", TokenRefreshView.as_view(), name="refresh_token"),
    path("", include(router.urls)),
    path("", include(users_router.urls)),
]
