"use client";
import { Product } from "@/types/api";
import React from "react";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";

const ProductDetailActions = ({ product }: { product: Product }) => {
  const [quantityAddToCart, setQuantityAddToCart] = useState(1);

  return (
    <div className="flex flex-row">
      <div className="flex flex-row text-foreground border items-center border-muted rounded-md bg-card text-sm font-medium mr-3">
        <button
          onClick={() => {
            quantityAddToCart > 1 && setQuantityAddToCart((prev) => prev - 1);
          }}
          className="border-r border-muted-background px-3.5 py-3 cursor-pointer hover:bg-muted transition-colors"
        >
          −
        </button>
        <p className="px-3.5 py-3 w-12 text-center">{quantityAddToCart}</p>
        <button
          onClick={() => setQuantityAddToCart((prev) => prev + 1)}
          className="border-l border-muted-background px-3.5 py-3 cursor-pointer hover:bg-muted transition-colors"
        >
          +
        </button>
      </div>
      <button className="blue-button text-primary-foreground px-6 text-sm lg:text-base font-semibold flex-1 lg:max-w-64 justify-center tracking-wider gap-2 flex flex-row items-center">
        <ShoppingBag className="h-4 w-4 lg:h-5 lg:w-5" />
        ADD TO CART
      </button>
    </div>
  );
};

export default ProductDetailActions;
