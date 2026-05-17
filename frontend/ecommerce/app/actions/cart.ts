"use server";
import { apiFetch } from "@/lib/api";
import { Cart, Product } from "@/types/api";

export async function getCartData() {
  const response = await apiFetch("api/cart");

  if (Array.isArray(response) && response.length > 0) {
    return response[0];
  }
}

export async function addToCart(product: Product['id'], quantity: number) {
  const response = await apiFetch("api/cart/add/", {
    method: "POST",
    body: JSON.stringify({
      product,
      quantity,
    }),
  });
  return response
}

export async function deleteCartItem(itemId: Cart["items"][number]["id"]) {
  const response = await apiFetch(`api/cart-items/${itemId}/`, {
    method: "DELETE",
  });
  return response;
}

export async function updateCartItemQuantity(
  itemId: Cart["items"][number]["id"],
  itemQuantity: Cart["items"][number]["quantity"],
) {
  const response = await apiFetch(`api/cart-items/${itemId}/`, {
    method: "PATCH",
    body: JSON.stringify({
      quantity: itemQuantity,
    }),
  });

  return response;
}
