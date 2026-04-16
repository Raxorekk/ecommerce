import React from "react";
import { Category } from "@/types/api";
import Link from "next/link";

const ProductCategories = ({
  categories,
  selected_category,
}: {
  categories: Category[] | undefined;
  selected_category: Category | undefined;
}) => {
  return (
    <div className="flex flex-row overflow-x-auto pb-2 mb-8 gap-2">
      {categories?.map((category) => {
        return (
          <Link
            key={category.slug}
            className={`flex flex-row items-center px-4 py-2 gap-2 text-sm whitespace-nowrap rounded-full border ${category.slug === selected_category?.slug ? "text-primary-foreground bg-light-blue font-medium" : "border-muted-background bg-card text-muted-foreground hover:text-foreground hover:border-light-blue/30 transition-colors"}`}
            href={`/products/categories/${category.slug}`}
          >
            <span>{category.emoji}</span> {category.name}
          </Link>
        );
      })}
    </div>
  );
};

export default ProductCategories;
