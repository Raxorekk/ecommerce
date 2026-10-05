"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { getCartData } from "../actions/cart";
import { Cart } from "@/types/api";

export const CartContext = createContext<{
  cartData: Cart | null
  cartItemsQuantity: number;
  setCartItemsQuantity: React.Dispatch<React.SetStateAction<number>>;
  handleFetchCartData: () => void
}>({ cartData: null, cartItemsQuantity: 0, setCartItemsQuantity: () => {}, handleFetchCartData: () => {} });

export default function CartProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cartItemsQuantity, setCartItemsQuantity] = useState(0);
  const [cartData, setCartData] = useState<Cart | null>(null);

  const handleFetchCartData = async () => {
    const response = await getCartData();
    if (response?.success) {
      let cartItemsQuantity = 0;
      for (const item of response.data.items) {
        cartItemsQuantity += item.quantity;
      }
      setCartData(response.data)
      setCartItemsQuantity(cartItemsQuantity);
    }
  };

  useEffect(() => {
    handleFetchCartData();
  }, []);

  return (
    <CartContext value={{ cartData, cartItemsQuantity, setCartItemsQuantity, handleFetchCartData }}>
      {children}
    </CartContext>
  );
}
