"use client";
import "../app/globals.css";
import {
  Menu,
  ShoppingBag,
  Monitor,
  Cpu,
  Tag,
  LucideLifeBuoy,
  User,
  X,
  LucideProps,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Category } from "@/types/api";

function NavBarDropdownButton({
  setShowDropdown,
  href,
  text,
  Icon,
  emoji
}: {
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  href: string;
  text: string;
  Icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  emoji?: string;
}) {
  return (
    <Link
      onClick={() => setShowDropdown(false)}
      className="flex flex-row items-center font-semibold text-sm p-3 rounded-lg hover:text-light-blue hover:bg-light-blue/5 transition-all transition-duration-150 ease-in-out"
      href={href}
    >
      {Icon && <Icon className="text-light-blue w-4.5 h-4.5 ml-0.5 mr-3" />}{emoji && <span className="text-base mr-2">{emoji}</span>} {text}
    </Link>
  );
}

export default function NavBar({categories}: {categories: Category[] | undefined}) {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const blockScroll = () => {
      showDropdown
        ? document.body.classList.add("overflow-hidden")
        : document.body.classList.remove("overflow-hidden");
    };

    blockScroll();
    return () => document.body.classList.remove("overflow-hidden");
  }, [showDropdown]);

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth >= 768 && setShowDropdown(false);
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <nav className="fixed left-0 top-0 right-0 flex z-50 h-16 lg:h-20 bg-background/80 border-b border-muted-background backdrop-blur-md">
      <div className="custom-container inline-padding mx-auto flex flex-row items-center justify-between">
        <Link href="/" className="font-space text-xl font-bold tracking-tight lg:text-2xl">
          <span>
            PC
          </span>
          <span className="text-light-blue">
            STORE
          </span>
        </Link>
        <div className="hidden md:visible md:flex flex-row gap-8 text-muted-foreground text-sm items-center">
          <Link className="hover:text-light-blue transition-colors" href="/">Shop</Link>
          <Link className="hover:text-light-blue transition-colors" href="/">Builds</Link>
          <Link className="hover:text-light-blue transition-colors" href="/">Deals</Link>
          <Link className="hover:text-light-blue transition-colors" href="/">Support</Link>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <button className="hidden md:flex md:visible cursor-pointer flex-row text-sm items-center text-muted-foreground gap-1 hover:text-light-blue transition-colors"><User className="h-4 w-4" />Account</button>
          <button className="cursor-pointer h-5 w-5">
            <ShoppingBag className="h-5 w-5 hover:text-light-blue transition-colors" />
          </button>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="md:hidden cursor-pointer h-5 w-5"
          >
            {!showDropdown ? (
              <Menu className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      {showDropdown && (
        <div className="md:hidden fixed flex flex-col left-0 top-15 w-full gap-1 bg-background py-4 px-6 border-b border-b-muted-background shadow-2xl animate-fade-in-down [animation-duration:200ms]">
          {categories?.map(category => {
            return (
              <NavBarDropdownButton setShowDropdown={setShowDropdown} key={category.slug} href={`/products/categories/${category.slug}`} emoji={category.emoji} text={category.name} />
            )
          })}
          <div className="h-px bg-muted-background my-2"></div>
          <NavBarDropdownButton setShowDropdown={setShowDropdown} href="/" Icon={Monitor} text="Shop" />
          <NavBarDropdownButton setShowDropdown={setShowDropdown} href="/" Icon={Cpu} text="Builds" />
          <NavBarDropdownButton setShowDropdown={setShowDropdown} href="/" Icon={Tag} text="Deals" />
          <NavBarDropdownButton setShowDropdown={setShowDropdown} href="/" Icon={LucideLifeBuoy} text="Support" />
          <div className="h-px bg-muted-background my-2"></div>
          <NavBarDropdownButton setShowDropdown={setShowDropdown} href="/" Icon={User} text="Account" />
        </div>
      )}
    </nav>
  );
}
