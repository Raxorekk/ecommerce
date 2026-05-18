"use client";
import "../globals.css";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Cart } from "@/types/api";
import { getCartData } from "../actions/cart";
import Link from "next/link";
import CartItem from "@/components/CartItem";

const PageContent = () => {
  const router = useRouter();
  const [data, setData] = useState<Cart | null>(null);
  const [itemsQuantity, setItemsQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchCart = async () => {
    const cartData = await getCartData();
    setData(cartData);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (data) {
      setItemsQuantity(0);
      setTotalPrice(0);
      for (const el of data?.items) {
        setItemsQuantity((prev) => (prev += el.quantity));
        setTotalPrice(prev => prev += Number(el.product.price) * el.quantity)
      }
    }
  }, [data]);

  return (
    <div className="bg-background nav-margin mb-10 lg:mb-16">
      <div className="custom-container mx-auto inline-padding">
        <button
          className="flex mb-6 items-center text-xs gap-2 text-muted-foreground cursor-pointer hover:text-light-blue transition-colors"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Continue shopping
        </button>
        <div className="flex flex-row items-center gap-3 mb-2">
          <ShoppingBag className="text-light-blue w-7 h-7" />
          <h1 className="font-semibold text-3xl lg:text-4xl">Your Cart</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          {itemsQuantity && itemsQuantity !== 1
            ? `${itemsQuantity} items`
            : `${itemsQuantity} item`}{" "}
          in your cart
        </p>
        {data?.items.length === 0 ? (
          <div className="flex flex-col w-full card bg-card/40 rounded-2xl items-center justify-center py-20 px-6">
            <div className="bg-muted/40 p-4 rounded-full mb-4">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="font-semibold text-lg mb-1">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Browser our catalog to find your next upgrade.
            </p>
            <Link
              className="blue-button text-primary-foreground tracking-wider text-sm px-6 py-3 uppercase font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              href="/"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            <div className="space-y-2">
              {data?.items.map((item) => {
                return (
                  <CartItem key={item.id} item={item} onUpdate={fetchCart} setTotalCartPrice={setTotalPrice} setCartItemQuantity={setItemsQuantity} />
                );
              })}
            </div>
            <div className="card bg-card/40 p-6">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="flex flex-row justify-between mb-2">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-sm text-foreground font-medium">
                  ${data?.total.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-row justify-between">
                <span className="text-sm text-muted-foreground">Shipping</span>
                <span className="text-sm text-foreground font-medium">
                  Calculated at checkout
                </span>
              </div>
              <div className="border border-muted-background mt-4 mb-4"></div>
              <div className="flex flex-row justify-between mb-4 items-baseline">
                <h4 className="font-bold">Total</h4>
                <h3 className="text-2xl font-bold">
                  ${totalPrice.toFixed(2)}
                </h3>
              </div>
              <button className="blue-button w-full text-primary-foreground font-semibold text-sm tracking-wider hover:opacity-90 transition-opacity">
                CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const page = () => {
  return (
    <Suspense fallback={"Loading..."}>
      <PageContent />
    </Suspense>
  );
};

export default page;
