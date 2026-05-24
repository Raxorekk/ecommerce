"use server";
import { apiFetch } from "@/lib/api";
import { Cart, Product } from "@/types/api";
import { revalidateTag, updateTag } from "next/cache";

export async function getCartData() {
  const response = await apiFetch<Cart[]>("api/cart/", {
    method: 'GET',
    next: {
      tags: ["cart"],
      revalidate: 3600,
    },
  });

  if (Array.isArray(response?.data) && response?.data.length > 0) {
    return response?.data[0];
  }
}

export async function addToCart(product: Product["id"], quantity: number) {
  const response = await apiFetch<Cart>("api/cart/add/", {
    method: "POST",
    body: JSON.stringify({
      product,
      quantity,
    }),
  });
  updateTag("cart");
  return response?.data;
}

export async function deleteCartItem(itemId: Cart["items"][number]["id"]) {
  const response = await apiFetch<null>(`api/cart-items/${itemId}/`, {
    method: "DELETE",
  });
  updateTag("cart");
  return response;
}

export async function updateCartItemQuantity(
  itemId: Cart["items"][number]["id"],
  itemQuantity: Cart["items"][number]["quantity"],
) {
  const response = await apiFetch<Cart>(`api/cart-items/${itemId}/`, {
    method: "PATCH",
    body: JSON.stringify({
      quantity: itemQuantity,
    }),
  });
  updateTag("cart");
  return response;
}
