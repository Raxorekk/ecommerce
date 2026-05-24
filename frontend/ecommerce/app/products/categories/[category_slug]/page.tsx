import SearchSortButtons from "@/components/ProductListSearchSort";
import ProductCategories from "@/components/ProductCategories";
import ProductCard from "@/components/ProductCard";
import ProductListFilters from "@/components/ProductListFilters";
import { ChevronRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Product, Category } from "@/types/api";
import Link from "next/link";
import { notFound } from "next/navigation";

type PaginatedProductResponse = {
  count: number;
  results: Product[];
};

const page = async ({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ category_slug: string }>;
}) => {
  const filters = await searchParams;
  const { category_slug } = await params;
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

  if (category_slug) urlSearchParams.append("category__slug", category_slug);

  const productsPromise = apiFetch<PaginatedProductResponse>(
    `api/products/?${urlSearchParams.toString()}`,
    {
      method: "GET",
      next: {
        tags: [`products_${category_slug}`],
        revalidate: 3600,
      },
    },
  );

  const categoriesPromise = apiFetch<Category[]>(`api/categories`, {
    method: "GET",
    next: {
      tags: [`categories`],
      revalidate: 3600,
    },
  });

  const [products_res, categories_res] = await Promise.all([
    productsPromise,
    categoriesPromise,
  ]);
  const products = products_res?.data;
  const categories = categories_res?.data;

  const selected_category = categories?.find((c) => c.slug === category_slug);

  if (!selected_category) notFound();

  return (
    <div className="bg-background min-h-screen nav-margin mb-12">
      <div className="custom-container inline-padding mx-auto">
        <div className="flex flex-col">
          <div className="flex flex-row items-center text-sm gap-2 mb-6">
            <Link
              href="/"
              className="text-muted-foreground hover:text-light-blue transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="text-muted-foreground w-4 h-4" />
            <p className="text-foreground font-medium">
              {selected_category?.name}
            </p>
          </div>
          <ProductCategories
            categories={categories !== undefined ? categories : []}
            selected_category={selected_category}
          />
          <div className="flex-row w-full mb-8 justify-between md:flex hidden">
            <div className="flex flex-col">
              <h1 className="text-3xl lg:text-5xl font-bold mb-2">
                {selected_category?.name}
              </h1>
              <span className="text-sm text-muted-foreground">
                {products?.count}{" "}
                {products?.count !== 1 ? "products" : "product"}
              </span>
            </div>
            <SearchSortButtons />
          </div>

          <div className="md:hidden block mb-4">
            <h1 className="text-3xl font-bold mb-2">
              {selected_category?.name}
            </h1>
            <span className="text-sm text-muted-foreground">
              {products?.count} {products?.count !== 1 ? "products" : "product"}
            </span>
          </div>
          <div className="md:hidden block mb-8">
            <SearchSortButtons />
          </div>

          <div className="lg:hidden block">
            <div className="grid grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {products?.results.map((product) => {
                return <ProductCard key={product.id} product={product} />;
              })}
            </div>
          </div>

          <div className="lg:flex flex-row gap-8 hidden">
            <div className="overflow-y-auto pr-2 lg:w-64 w-full shrink-0">
              <ProductListFilters
                specifications={selected_category?.specifications}
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {products?.results.map((product) => {
                return <ProductCard key={product.id} product={product} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
