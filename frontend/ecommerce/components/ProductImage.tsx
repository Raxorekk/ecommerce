import React from "react";
import Image from "next/image";
import { Product } from "@/types/api";

const ProductImage = ({
  productImg,
  productName,
}: {
  productImg: Product["product_img"];
  productName: Product["name"];
}) => {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg border border-muted-background bg-card">
      <Image
        className="w-full h-full object-cover group-hover:scale-105 duration-500 transition-transform"
        width={800}
        height={800}
        src={productImg}
        alt={productName}
      />
    </div>
  );
};

export default ProductImage;
