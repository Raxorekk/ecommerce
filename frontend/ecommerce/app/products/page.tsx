import React from "react";
import FilterSortButtons from "@/components/ProductFilters";
import ProductsGrid from "@/components/ProductsGrid";
import { apiFetch } from "@/lib/api";
import { Product } from "@/types/api";

type PaginatedResponse = {
  count: number;
  results: Product[];
};

const page = async ({
  searchParams,
  category
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  category: string;
}) => {
  const filters = await searchParams;
  let params = new URLSearchParams();

  for (let [key, value] of Object.entries(filters)) {
    if (value === undefined) {
    }
    if (Array.isArray(value)) {
      for (const s of value) {
        params.append(key, s);
      }
    }
    if (typeof value === "string") {
      params.append(key, value);
    }
  }

  const res = await apiFetch<PaginatedResponse>(`api/products/?${params.toString()}`, {
    method: "GET",
    next: {
      tags: ["products"],
      revalidate: 3600,
    }
  }).then((res) => res?.results);

  return (
    <div className="bg-background min-h-screen pt-20 lg:pt-24">
      <div className="mx-auto h-full w-full py-12 px-6">
        <div className="flex flex-col ">
          <p className="text-light-blue uppercase tracking-widest text-xs font-medium mb-2">
            BROWSE
          </p>
          <h1 className="text-3xl font-bold mb-2">All Products</h1>
          <span className="text-sm text-muted-foreground">18 products</span>
          <FilterSortButtons />
          <ProductsGrid productsArray={res} />
        </div>
      </div>
    </div>
  );
};

export default page;
