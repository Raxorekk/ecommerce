"use client";
import React from "react";
import { useState } from "react";
import { Product, Review } from "@/types/api";
import ProductDetailSpecs from "./ProductDetailSpecs";
import ProductDetailReviews from "./ProductDetailReviews";

const ProductDetailSpecsReviews = ({
  specs,
  reviews,
  productSlug,
}: {
  specs: Product["specification_values"];
  reviews: Review[];
  productSlug: Product["slug"];
}) => {
  const [showSpecifications, setShowSpecifications] = useState(false);
  return (
    <div className="flex flex-col mt-16 items-start">
      <div className="border border-muted-background text-sm rounded-lg w-auto bg-card p-1 mb-8">
        <button
          onClick={() => setShowSpecifications(true)}
          className={`px-6 py-2.5 font-medium rounded-sm cursor-pointer ${showSpecifications ? "bg-light-blue text-primary-foreground" : "text-muted-foreground"}`}
        >
          Specifications
        </button>
        <button
          onClick={() => setShowSpecifications(false)}
          className={`px-6 py-2.5 font-medium rounded-sm cursor-pointer ${!showSpecifications ? "bg-light-blue text-primary-foreground" : "text-muted-foreground"}`}
        >
          Reviews ({reviews.length})
        </button>
      </div>
      {showSpecifications ? <ProductDetailSpecs specs={specs}/> : <ProductDetailReviews reviews={reviews}/>}
    </div>
  );
};

export default ProductDetailSpecsReviews;
