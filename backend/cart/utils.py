from . import models

def merge_user_guest_carts(request):
        cart_id = request.COOKIES.get('GUEST_CART_ID')
        
        if cart_id:
            user_cart, user_cart_created = models.Cart.objects.get_or_create(user=request.user, is_active=True)
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
