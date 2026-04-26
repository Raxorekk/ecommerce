import {
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  LucideProps,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { apiFetch } from "@/lib/api";
import { Suspense } from "react";
import { Product, Category } from "@/types/api";
import { notFound } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import ProductDetailActions from "@/components/ProductDetailActions";
import Loading from "@/app/loading";
import ProductDetailSpecsReviews from "@/components/ProductDetailSpecsReviews";

function ExtraShippingInfo({
  Icon,
  title,
  desc,
}: {
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col gap-1 pt-6 items-center text-center">
      <Icon className="w-4 h-4 text-light-blue mb-1" />
      <p className="text-xs font-space font-semibold">{title}</p>
      <span className="text-[10px] text-muted-foreground">{desc}</span>
    </div>
  );
}

export function PageContent({ product }: { product: Product }) {
  return (
    <>
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="group">
          <ProductImage
            productImg={product.product_img}
            productName={product.name}
          />
        </div>
        <div className="flex flex-col">
          <p className="text-light-blue uppercase tracking-widest text-xs mb-2">
            {product.category.name}
          </p>
          <h1 className="text-foreground font-bold text-2xl mb-3">
            {product.name}
          </h1>
          <div className="mb-6">
            <p>234 reviews 4.9</p>
          </div>
          <span className="text-foreground font-bold text-3xl">
            ${product.price}
          </span>
          <p className="text-muted-foreground text-sm mt-6 mb-8">
            {product.description}
          </p>
          <ProductDetailActions product={product} />
          <p className="mt-4 mb-8 text-xs text-muted-foreground">
            <span className="text-light-blue font-medium">In stock</span> —
            ships within 24 hours
          </p>
          <div className="border-t border-muted-background grid grid-cols-3 gap-4">
            <ExtraShippingInfo
              Icon={Truck}
              title={"Free Shipping"}
              desc={"On orders over $99"}
            />
            <ExtraShippingInfo
              Icon={Shield}
              title={"2-Year Warranty"}
              desc={"Full coverage"}
            />
            <ExtraShippingInfo
              Icon={RotateCcw}
              title={"30-Day Returns"}
              desc={"Hassle-free"}
            />
          </div>
        </div>
      </div>
      
        <ProductDetailSpecsReviews
          specs={product.specification_values}
          reviews={product.reviews}
          productSlug={product.slug}
        />
      
    </>
  );
}

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

  if (!product_res) notFound();

  return (
    <div className="bg-background min-h-screen nav-margin">
      <div className="inline-padding mx-auto custom-container">
        <div className="flex flex-row items-center text-xs gap-2 mb-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-light-blue transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="text-muted-foreground w-4 h-4" />
          <Link
            className="text-muted-foreground hover:text-light-blue transition-colors"
            href={`/products/categories/${category_res?.slug}/`}
          >
            Shop
          </Link>
          <ChevronRight className="text-muted-foreground w-4 h-4" />
          <p className="text-foreground font-medium">{product_res?.name}</p>
        </div>
        <PageContent product={product_res} />
      </div>
    </div>
  );
};

export default page;
