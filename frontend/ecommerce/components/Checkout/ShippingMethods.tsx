import { Check, Store, Truck, Zap, type LucideIcon } from "lucide-react";
import {
  ShippingMethod,
  ShippingMethodId,
  shippingCost,
} from "@/lib/checkout";

const methodIcons: Record<ShippingMethodId, LucideIcon> = {
  standard: Truck,
  express: Zap,
  pickup: Store,
};

const ShippingMethods = ({
  methods,
  selectedId,
  subtotal,
  onChange,
}: {
  methods: ShippingMethod[];
  selectedId: ShippingMethodId;
  subtotal: number;
  onChange: (id: ShippingMethodId) => void;
}) => {
  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const Icon = methodIcons[method.id];
        const cost = shippingCost(method, subtotal);
        const selected = selectedId === method.id;

        return (
          <label
            key={method.id}
            className={`group relative flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all duration-200 ${
              selected
                ? "border-light-blue/70 bg-light-blue/7 shadow-glow-cyan"
                : "border-muted hover:border-light-blue/40 hover:bg-light-blue/3"
            }`}
          >
            <input
              type="radio"
              name="method"
              checked={selected}
              onChange={() => onChange(method.id)}
              className="sr-only"
            />
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                selected
                  ? "border-light-blue/50 bg-light-blue/15 text-light-blue"
                  : "border-muted bg-background/60 text-muted-foreground group-hover:text-light-blue"
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {method.label}
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {method.desc}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <span
                className={`font-body text-sm font-semibold ${
                  cost === 0 ? "text-light-blue" : "text-foreground"
                }`}
              >
                {cost === 0 ? "Free" : `$${cost.toFixed(2)}`}
              </span>
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                  selected
                    ? "border-light-blue bg-light-blue text-primary-foreground"
                    : "border-muted"
                }`}
              >
                {selected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
              </span>
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default ShippingMethods;
