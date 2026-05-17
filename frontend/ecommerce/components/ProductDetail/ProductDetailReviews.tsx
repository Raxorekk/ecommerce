import React, { ReactNode } from "react";
import { Review } from "@/types/api";
import ProductStarRating from "../ProductStarRating";
import ProductReviewForm from "../ProductReviewForm";
import ProductReviewHeader from "../ProductReviewHeader";

const ProductDetailReviews = ({
  reviews,
  reviewsToDisplay,
}: {
  reviews: Review[];
  reviewsToDisplay: Review[];
}) => {
  let ratingSum = 0;
  reviews.forEach((review) => {
    ratingSum += review.rating;
  });
  const avgRating = Math.ceil((ratingSum / reviews.length) * 10) / 10;
  const ratingBars = [] as ReactNode[];

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
    <div className="flex flex-col w-full">
      <ProductReviewHeader
        avgRating={avgRating}
        reviewsLength={reviews.length}
        ratingBars={ratingBars}
      />
      <div>
        {reviewsToDisplay.map((review, index) => {
          const createdAt = new Date(review.created_at);
          const createdAtMonth = createdAt.toLocaleString("eng", {
            month: "short",
          });
          const createdAtDay = createdAt.getDate();
          const createdAtYear = createdAt.getFullYear();

          return (
            <div
              className="border-b last:border-0 border-muted-background pt-6 pb-4 first:pt-0"
              key={index}
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
