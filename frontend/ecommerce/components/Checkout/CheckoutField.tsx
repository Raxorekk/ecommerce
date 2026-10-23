import { type LucideIcon } from "lucide-react";
import { CheckoutField as CheckoutFieldName } from "@/lib/checkout";

export const inputClassName =
  "w-full rounded-lg border border-muted bg-background/70 py-2.5 pr-3 pl-9 font-body text-sm text-foreground transition-colors placeholder:text-muted-foreground/60 focus:border-light-blue focus:bg-background focus:outline-none focus:ring-2 focus:ring-light-blue/25";

export const fieldLabelClassName =
  "font-body text-[10px] font-semibold uppercase tracking-wider text-muted-foreground";

const CheckoutField = ({
  name,
  label,
  value,
  error,
  onChange,
  icon: Icon,
  type = "text",
  optional,
  autoComplete,
  placeholder,
  className = "",
}: {
  name: CheckoutFieldName;
  label: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  type?: string;
  optional?: boolean;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}) => {
  return (
    <label className={`block ${className}`}>
      <span className={fieldLabelClassName}>
        {label}
        {optional && (
          <span className="ml-1 font-normal normal-case tracking-normal opacity-60">
            (optional)
          </span>
        )}
      </span>
      <span className="group relative mt-1.5 block">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 transition-colors group-focus-within:text-light-blue" />
        <input
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          className={`${inputClassName} ${error ? "border-red-600" : ""}`}
        />
      </span>
      {error && (
        <span className="mt-1.5 block font-body text-xs text-red-600">
          {error}
        </span>
      )}
    </label>
  );
};

export default CheckoutField;
