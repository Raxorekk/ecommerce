"use client";
import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Category } from "@/types/api";
import Link from "next/link";

const ProductListFilters = ({
  specifications,
}: {
  specifications: Category["specifications"] | undefined;
}) => {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  if (!specifications) return null;

  return (
    <>
      {specifications.map((spec) => {
        return (
          <div
            className="flex flex-col mt-6 text-muted-foreground"
            key={spec.name}
          >
            <p className="text-xs tracking-wider font-semibold uppercase mb-3">
              {spec.name}
            </p>
            {spec.values.map((value) => {
              const params = new URLSearchParams(searchParams.toString());
              let isActive = false;
              params.forEach((value, key) => {
                if (value === value && key === spec.slug) {
                  params.delete(spec.slug, value);
                  isActive = true;
                }
              });

              !isActive && params.set(spec.slug, value);

              return (
                <Link
                  href={`${pathName}/?${params}`}
                  key={value}
                  className={`flex flex-row group items-center gap-3 px-3 py-2 rounded-md text-sm  ${isActive ? `bg-light-blue/10 text-light-blue font-medium` : `hover:text-foreground hover:bg-muted-foreground/10 transition-colors`}`}
                >
                  <span
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isActive ? `bg-light-blue` : `border-muted`}`}
                  >
                    {isActive && (
                      <span className="text-primary-foreground font-bold text-[10px]">
                        ✓
                      </span>
                    )}
                  </span>
                  {value}
                </Link>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default ProductListFilters;
