import React from "react";
import { Star } from "lucide-react";

const ProductStarRating = ({
  rating,
  starsSize,
}: {
  rating: number;
  starsSize: string;
}) => {
  const stars = [];
  let n = 1;

  while (n <= 5) {
    stars.push(
      <Star
        className={`w-${starsSize} h-${starsSize} ${n <= rating ? "text-light-blue fill-light-blue" : "text-muted-foreground"}`}
        key={n}
      />,
    );
    n += 1;
  }

  return <div className="flex flex-row gap-0.5">{stars}</div>;
};

export default ProductStarRating;
