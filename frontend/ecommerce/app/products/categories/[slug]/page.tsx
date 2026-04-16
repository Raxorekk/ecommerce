import React from "react";
import FilterSortButtons from "@/components/ProductFilters";
import ProductsGrid from "@/components/ProductsGrid";
import ProductCategories from "@/components/ProductCategories";
import { apiFetch } from "@/lib/api";
import { Product, Category } from "@/types/api";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type PaginatedProductResponse = {
  count: number;
  results: Product[];
};

type PaginatedCategoryResponse = {
  count: number;
  results: Category[];
};


const page = async ({
  searchParams,
  params
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ slug: string }>;
}) => {
  const filters = await searchParams;
  const { slug: category_slug } = await params;
  let urlSearchParams = new URLSearchParams();

  for (let [key, value] of Object.entries(filters)) {
    if (value === undefined) {
    }
    if (Array.isArray(value)) {
      for (const s of value) {
        urlSearchParams.append(key, s);
      }
    }
    if (typeof value === "string") {
      urlSearchParams.append(key, value);
    }
  }

  if (category_slug) urlSearchParams.append('category__slug', category_slug);

  const productsPromise = apiFetch<PaginatedProductResponse>(`api/products/?${urlSearchParams.toString()}`, {
    method: "GET",
    next: {
      tags: [`products_${category_slug}`],
      revalidate: 3600,
    }
  });

  const categoriesPromise = apiFetch<PaginatedCategoryResponse>(`api/categories`, {
    method: "GET",
    next: {
      tags: [`categories`],
      revalidate: 3600,
    }
  }).then(categories_res => categories_res?.results);

  const [products_res, categories_res] = await Promise.all([productsPromise, categoriesPromise]);
  
  const selected_category = categories_res?.find(c => c.slug === category_slug)
  return (
    <div className="bg-background min-h-screen pt-20 lg:pt-24">
      <div className="mx-auto h-full w-full py-12 px-6">
        <div className="flex flex-col ">
          <div className="flex flex-row items-center text-sm gap-2 mb-6">
            <Link href="/" className="text-muted-foreground hover:text-light-blue transition-colors">Home</Link>
            <ChevronRight className="text-muted-foreground w-4 h-4"/>
            <p>{selected_category?.name}</p>
          </div>
          <ProductCategories categories={categories_res} selected_category={selected_category}/>
          <h1 className="text-3xl font-bold mb-2">{selected_category?.name}</h1>
          <span className="text-sm text-muted-foreground">{products_res?.count} products</span>
          <FilterSortButtons />
          <ProductsGrid productsArray={products_res?.results} />
        </div>
      </div>
    </div>
  );
};

export default page;
