"use client";
import React, { ReactNode } from "react";
import { sendReview } from "@/app/actions/review";
import { usePathname, useParams } from "next/navigation";
import { refresh } from "next/cache";

const ProductReviewForm = ({
  selectedRating,
  stars,
  setShowForm,
  setSelectedRating,
}: {
  selectedRating: number;
  stars: ReactNode[];
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRating: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const params = useParams();
  const ratingProductSlugData = {
    rating: selectedRating,
    productSlug: params.product_slug,
  };

  const handleReviewSubmit = async (formData: FormData) => {
    const response = await sendReview(ratingProductSlugData, formData) 
    if (response.success) {
      setShowForm(false);
      setSelectedRating(0);
    }
  }

  return (
    <form
      className="flex flex-col group bg-card rounded-md border border-muted-background p-6 gap-4 mb-10"
      action={handleReviewSubmit}
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs text-muted-foreground">Your Rating</span>
        <div className="flex flex-row gap-1">{stars}</div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="title" className="text-muted-foreground text-sm mb-1">
            Review Title
          </label>
          <input
            type="text"
            name="title"
            className="bg-muted px-4 py-2.5 placeholder:text-sm text-sm placeholder:text-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-light-blue"
            placeholder="Summarize your experience"
            required
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="content"
            className="text-muted-foreground text-sm mb-1"
          >
            Your Review
          </label>
          <textarea
            name="content"
            className="bg-muted px-4 py-2.5 placeholder:text-sm min-h-20 text-sm placeholder:text-muted-foreground text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-light-blue resize-none"
            placeholder="Write your review of the product"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="blue-button self-start py-2.5 px-8 uppercase text-primary-foreground font-semibold tracking-wider text-sm mt-2 group-invalid:opacity-50 group-invalid:cursor-not-allowed"
      >
        SUBMIT REVIEW
      </button>
    </form>
  );
};

export default ProductReviewForm;
