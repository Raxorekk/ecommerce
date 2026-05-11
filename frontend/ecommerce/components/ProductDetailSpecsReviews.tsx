"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { Product, Review } from "@/types/api";
import ProductDetailSpecs from "./ProductDetailSpecs";
import ProductDetailReviews from "./ProductDetailReviews";

const ProductDetailSpecsReviews = ({
  specs,
  reviews,
}: {
  specs: Product["specification_values"];
  reviews: Review[];
}) => {
  const [showSpecifications, setShowSpecifications] = useState(false);
  const [reviewsToDisplay, setReviewsToDisplay] = useState(reviews);
  const reviewsLeftToDisplay = reviews.length - reviewsToDisplay.length;

  useEffect(() => {
    if (reviews.length > 5) setReviewsToDisplay(reviews.slice(0, 5));
  }, []);

  const expandReviewsToDisplay = (reviews: Review[]) => {
    if (reviews.length - reviewsToDisplay.length < 5) 
      setReviewsToDisplay(
        reviews.slice(
          0,
          reviewsToDisplay.length + reviewsLeftToDisplay,
        ),
      );
    
    setReviewsToDisplay(reviews.slice(0, reviewsToDisplay.length + 5));
  };

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
      {showSpecifications ? (
        <ProductDetailSpecs specs={specs} />
      ) : (
        <ProductDetailReviews
          reviews={reviews}
          reviewsToDisplay={reviewsToDisplay}
        />
      )}
      {!showSpecifications && reviewsLeftToDisplay > 0 && (
        <button
          onClick={() => expandReviewsToDisplay(reviews)}
          className="self-center card cursor-pointer text-muted-foreground text-sm px-24 lg:px-36 font-medium hover:border-light-blue/50 hover:text-light-blue transition-colors"
        >
          Show more ({reviewsLeftToDisplay})
        </button>
      )}
    </div>
  );
};

export default ProductDetailSpecsReviews;
