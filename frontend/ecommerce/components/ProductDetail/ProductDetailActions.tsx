"use client";
import { Product } from "@/types/api";
import React from "react";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { addToCart } from "@/app/actions/cart";
import { CartContext } from "@/app/context/CartContext";
import { useContext } from "react";

const ProductDetailActions = ({ product }: { product: Product }) => {
  const { cartItemsCount, setCartItemsCount } = useContext(CartContext);

  const handleAddToCart = async () => {
    const response = await addToCart(product.id, 1);
    if (response?.status === 200 || response?.status === 201) {
      setCartItemsCount(cartItemsCount + 1);
    }
  };

  return (
    <div className="flex flex-row">
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleAddToCart();
        }}
        className="blue-button text-primary-foreground px-6 text-sm lg:text-base font-semibold flex-1 lg:max-w-64 justify-center tracking-wider gap-2 flex flex-row items-center"
      >
        <ShoppingBag className="h-4 w-4 lg:h-5 lg:w-5" />
        ADD TO CART
      </button>
    </div>
  );
};

export default ProductDetailActions;
