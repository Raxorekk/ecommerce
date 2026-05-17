"use client";
import { Product } from "@/types/api";
import React from "react";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { addToCart } from "@/app/actions/cart";

const ProductDetailActions = ({ product }: { product: Product }) => {
  const handleAddToCart = async () => {
    const response = await addToCart(product.id, 1);
    console.log(response);
  }

  return (
    <div className="flex flex-row">
      <button onClick={handleAddToCart} className="blue-button text-primary-foreground px-6 text-sm lg:text-base font-semibold flex-1 lg:max-w-64 justify-center tracking-wider gap-2 flex flex-row items-center">
        <ShoppingBag className="h-4 w-4 lg:h-5 lg:w-5" />
        ADD TO CART
      </button>
    </div>
  );
};

export default ProductDetailActions;
