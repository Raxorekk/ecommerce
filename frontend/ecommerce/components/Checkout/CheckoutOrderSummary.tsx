import Image from "next/image";
import { Loader2, Lock } from "lucide-react";
import { Cart } from "@/types/api";

const CheckoutOrderSummary = ({
  items,
  subtotal,
  shipping,
  submitting,
}: {
  items: Cart["items"];
  subtotal: number;
  shipping: number;
  submitting: boolean;
}) => {
  const total = subtotal + shipping;

  return (
    <aside className="h-fit space-y-4 rounded-xl border border-muted bg-card/40 p-6 lg:sticky lg:top-28">
      <h2 className="text-lg font-bold text-foreground">Order Summary</h2>
      <div className="max-h-72 space-y-3 overflow-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <Image
              src={item.product.product_img}
              alt={item.product.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-md border border-muted object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 font-body text-sm text-foreground">
                {item.product.name}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                Qty {item.quantity}
              </p>
            </div>
            <span className="font-body text-sm font-medium text-foreground">
              ${(Number(item.product.price) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="space-y-2 border-y border-muted py-4 font-body text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-foreground">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span className="text-foreground">Calculated on payment</span>
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-base font-semibold text-foreground">Total</span>
        <span className="text-2xl font-bold text-foreground">
          ${total.toFixed(2)}
        </span>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="blue-button inline-flex w-full items-center justify-center gap-2 px-6 text-sm font-semibold uppercase tracking-wider text-primary-foreground disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
        Continue to payment
      </button>
      <p className="text-center font-body text-xs text-muted-foreground">
        You&apos;ll be redirected to Stripe to pay securely.
      </p>
    </aside>
  );
};

export default CheckoutOrderSummary;
