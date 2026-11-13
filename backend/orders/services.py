import stripe
import os
from rest_framework.exceptions import ValidationError
from dotenv import load_dotenv
from django.db import transaction
from . import models

load_dotenv()
STRIPE_API_KEY = os.getenv('STRIPE_API_KEY')
STRIPE_ENDPOINT_KEY = os.getenv('STRIPE_ENDPOINT_KEY')
BASE_FRONTEND_URL = os.getenv('BASE_FRONTEND_URL')
stripe.api_key = STRIPE_API_KEY

def create_checkout_session(order):
    line_items = []

    for item in order.items.all():
        line_items.append(
            {
                'price_data': {
                    'currency': order.currency,
                    'unit_amount': int(item.price * 100),
                    'product_data': {
                        'name': item.name
                    }
                },
                'quantity': item.quantity
            })
        
    checkout_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=line_items,
        mode='payment',
        success_url=BASE_FRONTEND_URL,
        cancel_url=BASE_FRONTEND_URL
    )

    return checkout_session

def create_order(validated_data, cart, user=None):
    if not cart:
        raise ValidationError({"cart": "Cart is empty or does not exist."})
    
    cart_items = cart.items.select_related('product').all()
    if not cart_items:
        raise ValidationError({"cart": "Cart is empty"})
    
    order_data = {'status': models.Order.Status.PENDING, 'currency': models.Order.Currency.PLN}
    
    total = 0
    for item in cart_items:
        total += item.product.price * item.quantity

    order_data['total'] = total
        
    if user:
        order_data['user'] = user
        order_data['email'] = user.email
        order_data['first_name'] = user.first_name
        order_data['last_name'] = user.last_name
    else:
        order_data['email'] = validated_data['email']
        order_data['first_name'] = validated_data['first_name']
        order_data['last_name'] = validated_data['last_name']
        
    order_address_data = {}
    
    if validated_data.get('address'):
        order_address_data['city'] = validated_data['address']['city']
        order_address_data['country'] = validated_data['address']['country']
        order_address_data['address_line1'] = validated_data['address']['address_line1']
        order_address_data['postal_code'] = validated_data['address']['postal_code']
    else:
        order_address_data['city'] = validated_data['saved_address'].city
        order_address_data['country'] = validated_data['saved_address'].country
        order_address_data['address_line1'] = validated_data['saved_address'].address_line1
        order_address_data['postal_code'] = validated_data['saved_address'].postal_code
        
    with transaction.atomic():
        order = models.Order.objects.create(**order_data)
        
        models.OrderAddress.objects.create(order=order, **order_address_data)

        for item in cart_items:
            models.OrderItem.objects.create(
                order=order, 
                product=item.product, 
                name=item.product.name, 
                price=item.product.price, 
                quantity=item.quantity
                )
        
        cart.is_active = False
        cart.save(update_fields=['is_active'])
            
    return order


def webhook(payload, sig):
    try:
        event = stripe.Webhook.construct_event(payload=payload, sig_header=sig, secret=STRIPE_ENDPOINT_KEY)
    except ValueError as e:
        raise ValidationError({'payload': 'Invalid payload'})
    except stripe.SignatureVerificationError as e:
        raise ValidationError({'signature': 'Invalid signature'})
    
    obj = event.get('data', {}).get('object')
    status = None
    paid_order_id = None
    
    if event['type'] == 'payment_intent.succeeded':
        paid_order_id = obj.get('payment_details', {}).get('order_reference')
        status = models.Order.Status.PAID
    elif event['type'] == 'checkout.session.expired':
        paid_order_id = obj.get('id')
        status = models.Order.Status.CANCELLED
        
    if status and paid_order_id:
        models.Order.objects.filter(stripe_payment_id=paid_order_id, status=models.Order.Status.PENDING).update(status=status)