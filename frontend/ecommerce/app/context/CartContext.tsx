"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { getCartData } from "../actions/cart";
import { Cart } from "@/types/api";

export const CartContext = createContext<{
  cartData: Cart | null
  cartItemsCount: number;
  setCartItemsCount: React.Dispatch<React.SetStateAction<number>>;
  handleFetchCartData: () => void
}>({ cartData: null, cartItemsCount: 0, setCartItemsCount: () => {}, handleFetchCartData: () => {} });

export default function CartProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartData, setCartData] = useState<Cart | null>(null);

  const handleFetchCartData = async () => {
    const response = await getCartData();
    if (response?.success) {
      let cartItemsCount = 0;
      for (const item of response.data.items) {
        cartItemsCount += item.quantity;
      }
      setCartData(response.data)
      setCartItemsCount(cartItemsCount);
    }
  };

  useEffect(() => {
    handleFetchCartData();
  }, []);

  return (
    <CartContext value={{ cartData, cartItemsCount, setCartItemsCount, handleFetchCartData }}>
      {children}
    </CartContext>
  );
}
