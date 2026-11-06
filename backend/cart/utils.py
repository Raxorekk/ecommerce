import uuid
from rest_framework.exceptions import ValidationError
from . import models

def merge_user_guest_carts(cart_id=None, user=None):
    if cart_id:
        try: 
            uuid.UUID(cart_id)
        except ValueError:
            raise ValidationError("Invalid session_id format") 
        user_cart, user_cart_created = models.Cart.objects.get_or_create(user=user, is_active=True)
        guest_cart = models.Cart.objects.filter(session_id=cart_id, is_active=True).first()

        if guest_cart:
            if not user_cart_created:
                if not user_cart.id == guest_cart.id:
                    for guest_item in guest_cart.items.all():
                        user_product = user_cart.items.filter(product=guest_item.product).first()
                        
                        if user_product:
                            user_product.quantity += guest_item.quantity
                            user_product.save()
                        else:
                            models.CartItem.objects.create(cart=user_cart, product=guest_item.product, quantity=guest_item.quantity)
            else:
                guest_cart.items.update(cart=user_cart)
        
            guest_cart.delete()


def get_active_cart(request):
    filters = {'is_active': True}
    logged_in = request.user.is_authenticated
    session_id = request.COOKIES.get("GUEST_CART_ID")
    
    if logged_in:
        filters['user'] = request.user
    elif session_id:
        try: 
            uuid.UUID(session_id)
        except ValueError:
            raise ValidationError("Invalid session_id format")
        filters['session_id'] = session_id
        
    if logged_in or session_id:    
        return models.Cart.objects.prefetch_related('items').filter(**filters).order_by('-id').first()
    else:
        return None