"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Product } from "@/types/api";
import ProductImage from "./ProductImage";
import { ShoppingBag } from "lucide-react";
import { addToCart } from "@/app/actions/cart";
import { CartContext } from "@/app/context/CartContext";
import { useContext } from "react";

const ProductCard = ({ product }: { product: Product }) => {
  const pathname = usePathname();
  const {cartItemsQuantity, setCartItemsQuantity} = useContext(CartContext);

  const handleAddToCart = async () => {
    const response = await addToCart(product.id, 1);
  }

  return (
    <Link
      key={product.id}
      className="group block"
      href={`${pathname}/${product.slug}`}
    >
      <div className="relative">
        <ProductImage
          productImg={product.product_img}
          productName={product.name}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleAddToCart();
            setCartItemsQuantity(cartItemsQuantity + 1);
          }}
          className="absolute bottom-3 right-3 flex flex-row gap-1 px-3 py-2 blue-button tracking-wider text-primary-foreground font-semibold text-xs items-center"
        >
          <ShoppingBag className="w-4 h-4" /> ADD
        </button>
      </div>
      <div className="flex flex-col mt-2 font-space">
        <p className="text-muted-foreground text-xs tracking-wider uppercase">
          {product.category.name}
        </p>
        <p className="font-semibold text-sm text-foreground mt-1 group-hover:text-light-blue transition-colors">
          {product.name}
        </p>
        <p className="font-semibold text-sm text-foreground mt-1">
          ${product.price}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
