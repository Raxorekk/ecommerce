"use client";
import "../globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cart, UserAddress } from "@/types/api";
import { getCartData } from "../actions/cart";
import { getUserAddresses } from "../actions/address";
import CheckoutForm from "@/components/Checkout/CheckoutForm";

type CheckoutData = {
  cart: Cart;
  savedAddresses: UserAddress[];
  isAuthenticated: boolean;
};

const Page = () => {
  const router = useRouter();
  const [data, setData] = useState<CheckoutData | null>(null);

  useEffect(() => {
    const loadCheckoutData = async () => {
      const [cartResponse, addressesResponse] = await Promise.all([
        getCartData(),
        getUserAddresses(),
      ]);

      // getCartData returns nothing when the visitor has no cart at all
      if (!cartResponse?.success || cartResponse.data.items.length === 0) {
        router.replace("/cart");
        return;
      }

      setData({
        cart: cartResponse.data,
        // the address book is only available (and only needed) for logged-in users
        savedAddresses: addressesResponse.success ? addressesResponse.data : [],
        isAuthenticated: addressesResponse.success,
      });
    };

    loadCheckoutData();
  }, [router]);

  return (
    <div className="bg-background nav-margin mb-10 lg:mb-16">
      <div className="custom-container mx-auto inline-padding">
        {data ? (
          <CheckoutForm
            cart={data.cart}
            savedAddresses={data.savedAddresses}
            isAuthenticated={data.isAuthenticated}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Page;
