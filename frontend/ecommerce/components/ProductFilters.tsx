"use client";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function FilterSortButtons() {
  const router = useRouter();
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

  return (
    <div className="flex flex-row mt-4 items-center gap-3">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-1/2 w-4 h-4 text-muted-foreground" />
        <input
          name="search-bar"
          className="w-44 sm:w-56 card pr-4 pl-9 text-sm placeholder:text-sm placeholder:text-muted-foreground focus:outline-none focus:border-light-blue/50 transition-colors"
          type="text"
          placeholder="Search products..."
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
            return (
              <button
                className={`block cursor-pointer w-full card border-none rounded-none first:rounded-t-lg last:rounded-b-lg text-left text-sm  transition-colors ${selectedSortingOption.value === s.value ? "bg-light-blue/10 text-light-blue" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                key={s.value}
                onClick={() => {
                  setSelectedSortingOption(s);
                  router.push(`?ordering=${s.value}`)
                }}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
