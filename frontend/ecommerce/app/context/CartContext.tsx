"use client";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { getCartData } from "../actions/cart";
import { Cart } from "@/types/api";

export const CartContext = createContext<{
  cartData: Cart | null
  // false until the first fetch has finished, so "still loading" is not mistaken for "no cart"
  isCartLoaded: boolean;
  cartItemsCount: number;
  setCartItemsCount: React.Dispatch<React.SetStateAction<number>>;
  handleFetchCartData: () => Promise<void>
}>({ cartData: null, isCartLoaded: false, cartItemsCount: 0, setCartItemsCount: () => {}, handleFetchCartData: async () => {} });

export default function CartProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [cartData, setCartData] = useState<Cart | null>(null);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  const applyCartResponse = useCallback((response: Awaited<ReturnType<typeof getCartData>>) => {
    if (response?.success) {
      let cartItemsCount = 0;
      for (const item of response.data.items) {
        cartItemsCount += item.quantity;
      }
      setCartData(response.data)
      setCartItemsCount(cartItemsCount);
    } else if (!response) {
      // getCartData returns nothing when the visitor has no cart at all
      setCartData(null);
      setCartItemsCount(0);
    }
    setIsCartLoaded(true);
  }, []);

  const handleFetchCartData = useCallback(async () => {
    applyCartResponse(await getCartData());
  }, [applyCartResponse]);

  useEffect(() => {
    getCartData().then(applyCartResponse);
  }, [applyCartResponse]);

  return (
    <CartContext value={{ cartData, isCartLoaded, cartItemsCount, setCartItemsCount, handleFetchCartData }}>
      {children}
    </CartContext>
  );
}
