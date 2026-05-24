"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { getCartData } from "../actions/cart";

export const CartContext = createContext<{
  cartItemsQuantity: number;
  setCartItemsQuantity: React.Dispatch<React.SetStateAction<number>>;
}>({ cartItemsQuantity: 0, setCartItemsQuantity: () => {} });

export default function CartProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cartItemsQuantity, setCartItemsQuantity] = useState(0);

  useEffect(() => {
    const handleFetchCartData = async () => {
      const response = await getCartData();
      if (response) {
        let cartItemsQuantity = 0;
        for (const item of response.items) {
          cartItemsQuantity += item.quantity;
        }
        setCartItemsQuantity(cartItemsQuantity);
      }
    };

    handleFetchCartData();
  }, []);

  return (
    <CartContext value={{ cartItemsQuantity, setCartItemsQuantity }}>
      {children}
    </CartContext>
  );
}
