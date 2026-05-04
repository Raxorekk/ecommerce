"use server";
import { ParamValue } from "next/dist/server/request/params";
import { apiFetch } from "@/lib/api";
import React from "react";
import { refresh, revalidateTag } from "next/cache";

interface ratingProductSlugData {
  rating: number;
  productSlug: ParamValue;
}

export async function sendReview(
  ratingProductSlugData: ratingProductSlugData,
  formData: FormData,
) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const product_slug = ratingProductSlugData.productSlug;
  const rating = ratingProductSlugData.rating;

  const bodyData = {
    title,
    content,
    product: product_slug,
    rating,
  };

  try {
    const response = await apiFetch("api/reviews/", {
      method: "POST",
      body: JSON.stringify(bodyData),
    });

    revalidateTag(`product_${product_slug}`, "max");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
