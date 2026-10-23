"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronDown,
  CreditCard,
  Globe,
  Hash,
  Home,
  Mail,
  Map as MapIcon,
  MapPin,
  Phone,
  Truck,
  User,
} from "lucide-react";
import { Cart, UserAddress } from "@/types/api";
import { createOrder } from "@/app/actions/order";
import {
  CheckoutErrors,
  CheckoutField as CheckoutFieldName,
  CheckoutFormData,
  CheckoutOptions,
  ShippingMethodId,
  countries,
  emptyCheckoutForm,
  shippingCost,
  shippingMethods,
  validateCheckoutForm,
} from "@/lib/checkout";
import CheckoutSection from "./CheckoutSection";
import CheckoutField, {
  fieldLabelClassName,
  inputClassName,
} from "./CheckoutField";
import SavedAddresses, { SelectedAddress } from "./SavedAddresses";
import ShippingMethods from "./ShippingMethods";
import CheckoutOrderSummary from "./CheckoutOrderSummary";

const CheckoutForm = ({
  cart,
  savedAddresses,
  isAuthenticated,
}: {
  cart: Cart;
  savedAddresses: UserAddress[];
  isAuthenticated: boolean;
}) => {
  const [form, setForm] = useState<CheckoutFormData>(emptyCheckoutForm);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [methodId, setMethodId] = useState<ShippingMethodId>("standard");
  const [submitting, setSubmitting] = useState(false);
  // the default address is preselected, without any saved address the form is shown
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress>(
    savedAddresses.find((address) => address.is_default)?.id ??
      savedAddresses[0]?.id ??
      "new",
  );

  const options: CheckoutOptions = {
    isAuthenticated,
    savedAddressId: selectedAddress === "new" ? null : selectedAddress,
  };
  const showAddressForm = selectedAddress === "new";

  const selectedMethod =
    shippingMethods.find((method) => method.id === methodId) ??
    shippingMethods[0];
  const shipping = shippingCost(selectedMethod, cart.total);

  // Section badges follow the live validity of the form, errors are only shown after a submit.
  const liveErrors = validateCheckoutForm(form, options);
  const contactOk = !liveErrors.email && !liveErrors.phone;
  const addressOk =
    !liveErrors.fullName &&
    !liveErrors.address1 &&
    !liveErrors.city &&
    !liveErrors.postalCode &&
    !liveErrors.country;
  const detailsOk = contactOk && addressOk;

  const handleChange =
    (name: CheckoutFieldName) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [name]: e.target.value }));
      if (errors[name]) {
        setErrors((current) => ({ ...current, [name]: undefined }));
      }
    };

  const fieldProps = (name: CheckoutFieldName) => ({
    name,
    value: form[name],
    error: errors[name],
    onChange: handleChange(name),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);

    const validationErrors = validateCheckoutForm(form, options);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFormMessage("Please check your shipping details");
      return;
    }

    setSubmitting(true);
    const result = await createOrder(form, options.savedAddressId);

    if (result.success) {
      // Stripe's hosted page is on another origin, so a full navigation is needed.
      window.location.assign(result.url);
      return;
    }

    setErrors(result.errors);
    setFormMessage(
      result.message ??
        (Object.keys(result.errors).length > 0
          ? "Please check your shipping details"
          : null),
    );
    setSubmitting(false);
  };

  return (
    <>
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-1.5 font-body text-xs text-muted-foreground transition-colors hover:text-light-blue"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to cart
      </Link>
      <h1 className="mb-2 text-3xl font-bold text-foreground lg:text-4xl">
        Checkout
      </h1>
      <ol className="mb-8 flex flex-wrap items-center gap-3">
        <li className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full font-body text-[11px] font-bold transition-colors ${
              detailsOk
                ? "bg-light-blue text-primary-foreground"
                : "border border-light-blue/50 bg-light-blue/10 text-light-blue"
            }`}
          >
            {detailsOk ? <Check className="h-3.5 w-3.5" /> : "1"}
          </span>
          <span className="font-body text-xs font-semibold text-light-blue">
            Shipping
          </span>
        </li>
        <li
          aria-hidden
          className={`h-px w-8 transition-colors ${
            detailsOk ? "bg-light-blue/60" : "bg-muted"
          }`}
        />
        <li className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-muted bg-muted-background font-body text-[11px] font-bold text-muted-foreground">
            2
          </span>
          <span className="inline-flex items-center gap-1.5 font-body text-xs text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5" /> Payment with Stripe
          </span>
        </li>
      </ol>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto grid max-w-270 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14"
      >
        <div className="space-y-6">
          {formMessage && (
            <p
              role="alert"
              className="rounded-lg border border-red-600/50 bg-red-600/10 px-4 py-3 font-body text-sm text-red-600"
            >
              {formMessage}
            </p>
          )}

          <CheckoutSection
            step={1}
            icon={Mail}
            title="Contact"
            hint="Order updates and delivery alerts go here"
            complete={contactOk}
          >
            {isAuthenticated && (
              <p className="font-body text-xs text-muted-foreground">
                Order updates will be sent to the email of your account.
              </p>
            )}
            <div
              className={`grid gap-4 ${isAuthenticated ? "" : "sm:grid-cols-2"}`}
            >
              {!isAuthenticated && (
                <CheckoutField
                  {...fieldProps("email")}
                  label="Email"
                  type="email"
                  autoComplete="email"
                  icon={Mail}
                  placeholder="you@example.com"
                />
              )}
              <CheckoutField
                {...fieldProps("phone")}
                label="Phone"
                type="tel"
                autoComplete="tel"
                icon={Phone}
                placeholder="+1 555 000 1234"
              />
            </div>
          </CheckoutSection>

          <CheckoutSection
            step={2}
            icon={MapPin}
            title="Shipping address"
            hint={
              savedAddresses.length > 0
                ? "Choose one of your addresses or enter a new one"
                : "Where your order should arrive"
            }
            complete={addressOk}
          >
            {savedAddresses.length > 0 && (
              <SavedAddresses
                addresses={savedAddresses}
                selected={selectedAddress}
                onChange={setSelectedAddress}
              />
            )}

            {showAddressForm && (
              <>
                {!isAuthenticated && (
                  <CheckoutField
                    {...fieldProps("fullName")}
                    label="Full name"
                    autoComplete="name"
                    icon={User}
                    placeholder="Alex Kowalski"
                  />
                )}
                <CheckoutField
                  {...fieldProps("address1")}
                  label="Street address"
                  autoComplete="address-line1"
                  icon={MapPin}
                  placeholder="123 Main Street"
                />
                <CheckoutField
                  {...fieldProps("address2")}
                  label="Apartment, suite, etc."
                  optional
                  autoComplete="address-line2"
                  icon={Building2}
                  placeholder="Apt 4B"
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <CheckoutField
                    {...fieldProps("city")}
                    label="City"
                    autoComplete="address-level2"
                    icon={Home}
                    placeholder="Austin"
                  />
                  <CheckoutField
                    {...fieldProps("state")}
                    label="State / Region"
                    optional
                    autoComplete="address-level1"
                    icon={MapIcon}
                    placeholder="TX"
                  />
                  <CheckoutField
                    {...fieldProps("postalCode")}
                    label="Postal code"
                    autoComplete="postal-code"
                    icon={Hash}
                    placeholder="78701"
                  />
                </div>
                <label className="block">
                  <span className={fieldLabelClassName}>Country</span>
                  <span className="group relative mt-1.5 block">
                    <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70 transition-colors group-focus-within:text-light-blue" />
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange("country")}
                      autoComplete="country"
                      className={`${inputClassName} cursor-pointer appearance-none pr-9`}
                    >
                      {countries.map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </span>
                  {errors.country && (
                    <span className="mt-1.5 block font-body text-xs text-red-600">
                      {errors.country}
                    </span>
                  )}
                </label>
              </>
            )}
          </CheckoutSection>

          <CheckoutSection
            step={3}
            icon={Truck}
            title="Delivery method"
            hint="Pick how fast you want it"
            complete={false}
          >
            <ShippingMethods
              methods={shippingMethods}
              selectedId={methodId}
              subtotal={cart.total}
              onChange={setMethodId}
            />
          </CheckoutSection>
        </div>

        <CheckoutOrderSummary
          items={cart.items}
          subtotal={cart.total}
          shipping={shipping}
          submitting={submitting}
        />
      </form>
    </>
  );
};

export default CheckoutForm;
