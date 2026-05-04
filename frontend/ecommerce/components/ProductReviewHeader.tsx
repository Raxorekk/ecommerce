"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { Star } from "lucide-react";
import ProductStarRating from "./ProductStarRating";
import ProductReviewForm from "./ProductReviewForm";

const ProductReviewHeader = ({
  avgRating,
  ratingBars,
  reviewsLength,
}: {
  avgRating: number;
  ratingBars: ReactNode[];
  reviewsLength: number;
}) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const stars = [] as ReactNode[];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <button
        key={i}
        type="button"
        value={i}
        onClick={() => setSelectedRating(i)}
        className="cursor-pointer"
      >
        <Star
          className={`w-5 h-5 ${i <= selectedRating ? "text-light-blue fill-light-blue" : "text-muted-foreground"}`}
        />
      </button>,
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:grid md:items-center grid-cols-3 gap-8 mb-10">
        <div className="flex flex-col justify-center items-center">
          <span className="text-5xl font-space font-bold mb-2">
            {avgRating}
          </span>
          <ProductStarRating rating={avgRating} starsSize="4" />
          <p className="mt-1 text-muted-foreground text-sm">
            {reviewsLength} {reviewsLength !== 1 ? "reviews" : "review"}
          </p>
        </div>
        <div className="space-y-2">{ratingBars}</div>
        <div className="flex flex-col gap-3 items-center">
          <span className="text-muted-foreground text-sm">
            Bought this product?
          </span>
          <button
            onClick={() => {
              showForm && setSelectedRating(0);
              setShowForm(!showForm);
            }}
            className="bg-card text-sm font-medium cursor-pointer py-2.5 px-6 rounded-lg border border-muted-background hover:text-light-blue hover:border-light-blue/50 transition-colors"
          >
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        </div>
      </div>
      {showForm && (
        <ProductReviewForm
          selectedRating={selectedRating}
          stars={stars}
          setShowForm={setShowForm}
          setSelectedRating={setSelectedRating}
        />
      )}
    </div>
  );
};

export default ProductReviewHeader;
