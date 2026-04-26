"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Product } from "@/types/api";
import ProductImage from "./ProductImage";

const ProductCard = ({ product }: { product: Product }) => {
  const pathname = usePathname();
  return (
    <Link
      key={product.id}
      className="group block"
      href={`${pathname}/${product.slug}`}
    >
      <ProductImage
        productImg={product.product_img}
        productName={product.name}
      />
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
