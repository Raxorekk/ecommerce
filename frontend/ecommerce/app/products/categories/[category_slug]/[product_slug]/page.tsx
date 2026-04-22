import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { apiFetch } from "@/lib/api";
import { Product, Category } from "@/types/api";

const page = async ({
  params,
}: {
  params: Promise<{ category_slug: string; product_slug: string }>;
}) => {
  const { category_slug, product_slug } = await params;

  const productPromise = apiFetch<Product>(`api/products/${product_slug}/`, {
    method: "GET",
    next: {
      tags: [`products_${category_slug}`, `product_${product_slug}`],
      revalidate: 3600,
    },
  });

  const categoryPromise = apiFetch<Category>(
    `api/categories/${category_slug}/`,
    {
      method: "GET",
      next: {
        tags: [`categories`, `category_${category_slug}`],
        revalidate: 3600,
      },
    },
  );

  const [product_res, category_res] = await Promise.all([
    productPromise,
    categoryPromise,
  ]);

  return (
    <div className="bg-background min-h-screen nav-margin">
      <div className="inline-padding mx-auto custom-container">
        <div className="flex flex-row items-center text-sm gap-2 mb-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-light-blue transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="text-muted-foreground w-4 h-4" />
          <p className="text-foreground font-medium"></p>
        </div>
      </div>
    </div>
  );
};

export default page;
