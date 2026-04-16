import React from "react";
import Image from "next/image";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: {
    name: string;
    slug: string;
  };
  reviews: Object[];
  slug: string;
  specification_values: {
    name: string;
    value: string;
  }[];
  product_img: string;
};

const ProductsGrid = ({
  productsArray,
}: {
  productsArray: Product[] | undefined;
}) => {
  return (
    <div className="grid-cols-2">
      {productsArray?.map((product) => {

        return <button key={product.id}>
          <div>
            <Image width={1920} height={1080} src={product.product_img} alt={product.name}/>
          </div>
        </button>;
      })}
    </div>
  );
};

export default ProductsGrid;
