import React from "react";
import { Review } from "@/types/api";
import ProductStarRating from "./ProductStarRating";

const ProductDetailReviews = ({ reviews }: { reviews: Review[] }) => {
  let ratingSum = 0;
  reviews.forEach((review) => {
    ratingSum += review.rating;
  });
  const avgRating = Math.ceil((ratingSum / reviews.length) * 10) / 10;

  const ratingBars = [];

  for (let i = 5; i >= 1; i--) {
    const distinctRatingsCount = reviews.filter(
      (review) => review.rating === i,
    ).length;
    const barWidth = ((distinctRatingsCount / reviews.length) * 100).toFixed(0);

    ratingBars.push(
      <div
        key={i}
        className="text-muted-foreground text-xs flex items-center gap-2"
      >
        <p className="w-6 text-right">{i} ★</p>
        <div className="bg-muted rounded-full h-2 flex-1">
          <div
            style={{ width: `${barWidth}%` }}
            className={`h-full rounded-full bg-light-blue transition-all`}
          ></div>
        </div>
        <p className="w-8">{distinctRatingsCount}</p>
      </div>,
    );
  }
  return (
    <div className="flex flex-col w-full gap-8 mb-10">
      <div className="flex flex-col justify-center items-center">
        <span className="text-5xl font-space font-bold mb-2">{avgRating}</span>
        <ProductStarRating rating={avgRating} starsSize="4" />
        <p className="mt-1 text-muted-foreground text-sm">
          {reviews.length} {reviews.length !== 1 ? "reviews" : "review"}
        </p>
      </div>
      <div className="space-y-2">{ratingBars}</div>
      <div className="flex flex-col gap-3 items-center">
        <span className="text-muted-foreground text-sm">
          Bought this product?
        </span>
        <button className="bg-card text-sm font-medium cursor-pointer py-2.5 px-6 rounded-lg border border-muted-background hover:text-light-blue hover:border-light-blue/50 transition-colors">
          Write a Review
        </button>
      </div>
      <div>
        {reviews.map((review) => {
          const createdAt = new Date(review.created_at);
          const createdAtMonth = createdAt.toLocaleString("eng", {
            month: "short",
          });
          const createdAtDay = createdAt.getDate();
          const createdAtYear = createdAt.getFullYear();
          console.log(createdAtYear);
          return (
            <div
              className="border-b last:border-0 border-muted-background pt-6 pb-4 first:pt-0"
              key={review.content}
            >
              <div className="flex flex-row gap-2 items-center mb-2">
                <ProductStarRating rating={review.rating} starsSize="3.5" />
                <span className="font-space text-sm font-semibold text-foreground">
                  {review.title}
                </span>
              </div>
              <div className="flex flex-row gap-2 items-center mb-2">
                <span className="text-xs font-medium">
                  {review.user.first_name.charAt(0).toUpperCase() +
                    review.user.first_name.slice(1)}{" "}
                  {review.user.last_name.charAt(0).toUpperCase()}.
                </span>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="text-xs text-muted-foreground">
                  {createdAtMonth} {createdAtDay}, {createdAtYear}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mt-3 mb-3">
                {review.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductDetailReviews;
