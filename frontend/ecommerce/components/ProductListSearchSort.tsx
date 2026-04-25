"use client";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";

export default function SearchSortButtons() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const currentSortingValue = params.get("ordering");
  const pathName = usePathname();
  const sortingOptions = [
    { name: "Featured", value: "" },
    { name: "Price: Low → High", value: "price" },
    { name: "Price: High → Low", value: "-price" },
    { name: "Name: A → Z", value: "name" },
    { name: "Name: Z → A", value: "-name" },
    { name: "Top Rated", value: "2" },
  ];
  const [selectedSortingOption, setSelectedSortingOption] = useState(
    sortingOptions[0],
  );

  useEffect(() => {
    sortingOptions.forEach((el) => {
      if (el.value === currentSortingValue) {
        setSelectedSortingOption(el);
      }
    });
  }, [currentSortingValue]);

  const debounced = useDebouncedCallback((value: string) => {
    handleSearch(value);
  }, 1000);

  const handleSearch = (e: string) => {
    if (e) {
      params.set("search", e);
    } else {
      params.delete("search");
    }

    router.push(`${pathName}/?${params}`);
  };

  return (
    <div className="flex flex-row mt-4 mb-8 items-center gap-3">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-1/2 w-4 h-4 text-muted-foreground" />
        <input
          name="search-bar"
          className="w-44 sm:w-56 card pr-4 pl-9 text-sm placeholder:text-sm placeholder:text-muted-foreground focus:outline-none focus:border-light-blue/50 transition-colors"
          type="text"
          placeholder="Search products..."
          onChange={(e) => debounced(e.target.value)}
        />
      </div>

      <button className="lg:hidden flex flex-row card gap-2 items-center text-sm cursor-pointer hover:border-light-blue/50 transition-colors">
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>
      <div className="relative group">
        <button className="flex flex-row gap-2 items-center justify-between card text-sm cursor-pointer hover:border-light-blue/50 transition-colors">
          <span className="text-muted-foreground">Sort:</span>
          <span>{selectedSortingOption.name}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>

        <div className="absolute opacity-0 invisible group-hover:visible group-hover:opacity-100 z-30 shadow-xl mt-1 right-0 top-full flex flex-col rounded-lg w-48 items-start card px-0 py-0 transition-all">
          {sortingOptions.map((s) => {
            params.set("ordering", s.value);
            return (
              <Link
                href={`${pathName}/?${params}`}
                className={`block cursor-pointer w-full card border-none rounded-none first:rounded-t-lg last:rounded-b-lg text-left text-sm  transition-colors ${selectedSortingOption.value === s.value ? "bg-light-blue/10 text-light-blue" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                key={s.value}
              >
                {s.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
