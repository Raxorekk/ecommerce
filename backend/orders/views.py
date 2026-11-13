from . import serializers, models, services
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet,ReadOnlyModelViewSet
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from cart.utils import get_active_cart, merge_user_guest_carts
from cart.models import Cart

# Create your views here.

class OrderViewSet(ReadOnlyModelViewSet):
    serializer_class = serializers.OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        filters = {}
        
        if not self.request.user.is_authenticated:
            return models.Order.objects.none()
        elif not self.request.user.is_staff:
            filters['user'] = self.request.user
        
        return models.Order.objects.prefetch_related('items').filter(**filters)
    

class CreateOrderView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = serializers.OrderSerializer
          
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = None
        if self.request.user.is_authenticated:
            user = self.request.user
            merge_user_guest_carts(user=user, cart_id=self.request.COOKIES.get('GUEST_CART_ID', None))
            
        cart = get_active_cart(self.request)
        order = services.create_order(serializer.validated_data, cart, user)
        checkout_session = services.create_checkout_session(order)
        order.stripe_payment_id = checkout_session.id
        order.save(update_fields=['stripe_payment_id'])

        serializer.instance = order
        data = dict(serializer.data)
        data['checkout_url'] = checkout_session.url
        
        headers = self.get_success_headers(serializer.data)
        
        return Response(data, status=201, headers=headers)


class StripeWebhookView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    
    def post(self, request):
        payload = request.body
        sig = request.META.get('HTTP_STRIPE_SIGNATURE')
        
        services.webhook(payload, sig)
        
        return Response(status=200)