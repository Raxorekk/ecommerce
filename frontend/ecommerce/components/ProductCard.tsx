'use client'
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/api";
import { usePathname } from "next/navigation";
import React from "react";

const ProductCard = ({ product }: { product: Product }) => {
  const pathname = usePathname();
  return (
    <Link
      key={product.id}
      className="group block"
      href={`${pathname}/${product.slug}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg border border-muted-background bg-card">
        <Image
          className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
          width={800}
          height={800}
          src={product.product_img}
          alt={product.name}
        />
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
