import Link from "next/link";
import React from "react";
import { CATEGORIES } from "@/lib/routes";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-muted-background">
      <div className="inline-padding custom-container mx-auto py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
          <div className="flex flex-col">
            <Link
              href="/"
              className="mb-4 font-space text-xl font-bold tracking-tight lg:text-2xl"
            >
              <span>PC</span>
              <span className="text-light-blue">STORE</span>
            </Link>
            <p className="text-muted-foreground">
              Premium PC hardware and custom builds. Level up your setup.
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-muted-foreground tracking-widest text-xs uppercase mb-4">
              SHOP
            </p>
            <ul className="text-secondary-foreground space-y-2">
              <li>
                <Link
                  href={CATEGORIES.GRAPHICS_CARDS}
                  className="hover:text-light-blue transition-colors"
                >
                  Graphics Cards
                </Link>
              </li>
              <li>
                <Link
                  href={CATEGORIES.PROCESSORS}
                  className="hover:text-light-blue transition-colors"
                >
                  Processors
                </Link>
              </li>
              <li>
                <Link
                  href={CATEGORIES.MONITORS}
                  className="hover:text-light-blue transition-colors"
                >
                  Monitors
                </Link>
              </li>
              <li>
                <Link
                  href={CATEGORIES.MEMORY}
                  className="hover:text-light-blue transition-colors"
                >
                  Memory
                </Link>
              </li>
              <li>
                <Link
                  href={CATEGORIES.STORAGE}
                  className="hover:text-light-blue transition-colors"
                >
                  Storage
                </Link>
              </li>
              <li>
                <Link
                  href={CATEGORIES.AUDIO}
                  className="hover:text-light-blue transition-colors"
                >
                  Audio
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <p className="text-muted-foreground tracking-widest text-xs uppercase mb-4">
              COMPANY
            </p>
            <ul className="text-secondary-foreground space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-light-blue transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-light-blue transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-light-blue transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <p className="text-muted-foreground tracking-widest text-xs uppercase mb-4">
              SUPPORT
            </p>
            <ul className="text-secondary-foreground space-y-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-light-blue transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-light-blue transition-colors"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="hover:text-light-blue transition-colors"
                >
                  Warranty
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-muted-background mt-12 flex justify-center">
          <p className="text-xs text-muted-foreground mt-8">
            © 2026 PCSTORE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
