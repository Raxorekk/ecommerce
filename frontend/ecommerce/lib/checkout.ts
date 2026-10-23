export type ShippingMethodId = "standard" | "express" | "pickup";

export type ShippingMethod = {
  id: ShippingMethodId;
  label: string;
  desc: string;
  price: number;
  freeOver?: number;
};

export const shippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    label: "Standard Shipping",
    desc: "3-5 business days",
    price: 9.99,
    freeOver: 99,
  },
  {
    id: "express",
    label: "Express Shipping",
    desc: "1-2 business days",
    price: 14.99,
  },
  {
    id: "pickup",
    label: "In-Store Pickup",
    desc: "Same day (Austin, TX)",
    price: 0,
  },
];

export const shippingCost = (method: ShippingMethod, subtotal: number) =>
  method.freeOver !== undefined && subtotal >= method.freeOver
    ? 0
    : method.price;

export const countries: [code: string, name: string][] = [
  ["US", "United States"],
  ["CA", "Canada"],
  ["GB", "United Kingdom"],
  ["PL", "Poland"],
  ["DE", "Germany"],
  ["FR", "France"],
  ["NL", "Netherlands"],
  ["AU", "Australia"],
];

export type CheckoutFormData = {
  email: string;
  fullName: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CheckoutField = keyof CheckoutFormData;
export type CheckoutErrors = Partial<Record<CheckoutField, string>>;

export const emptyCheckoutForm: CheckoutFormData = {
  email: "",
  fullName: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

// Backend rules that change what the checkout has to collect:
// - a guest gives email, name and a new address (no saved addresses);
// - a logged-in user is identified by the account (email and name come from it)
//   and gives either one of their saved addresses or a new one, never both.
export type CheckoutOptions = {
  isAuthenticated: boolean;
  savedAddressId: number | null;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d\s()-]+$/;
// matches OrderAddress.address_line1 max_length on the backend
const ADDRESS_LINE_MAX = 150;
// matches OrderAddress.city max_length on the backend
const CITY_MAX = 50;

const joinAddressLines = (address1: string, address2: string) =>
  [address1.trim(), address2.trim()].filter(Boolean).join(", ");

// Mirrors the rules of the Lovable design; the backend remains the source of truth.
export function validateCheckoutForm(
  form: CheckoutFormData,
  { isAuthenticated, savedAddressId }: CheckoutOptions,
): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (!isAuthenticated) {
    const email = form.email.trim();
    if (!EMAIL_PATTERN.test(email) || email.length > 255) {
      errors.email = "Enter a valid email";
    }

    const fullName = form.fullName.trim();
    if (fullName.split(/\s+/).filter(Boolean).length < 2) {
      errors.fullName = "Enter your first and last name";
    } else if (fullName.length > 100) {
      errors.fullName = "Name is too long";
    }
  }

  const phone = form.phone.trim();
  if (phone.length < 6) {
    errors.phone = "Enter a phone number";
  } else if (phone.length > 20 || !PHONE_PATTERN.test(phone)) {
    errors.phone = "Invalid phone number";
  }

  // a saved address is already complete, only a new one has to be checked
  if (savedAddressId !== null) {
    return errors;
  }

  if (form.address1.trim().length < 3) {
    errors.address1 = "Enter your street address";
  } else if (
    joinAddressLines(form.address1, form.address2).length > ADDRESS_LINE_MAX
  ) {
    errors.address1 = "Street address is too long";
  }

  const city = form.city.trim();
  if (city.length < 2) {
    errors.city = "Enter your city";
  } else if (city.length > CITY_MAX) {
    errors.city = "City name is too long";
  }

  const postalCode = form.postalCode.trim();
  if (postalCode.length < 2) {
    errors.postalCode = "Enter a postal code";
  } else if (postalCode.length > 20) {
    errors.postalCode = "Postal code is too long";
  }

  if (form.country.trim().length !== 2) {
    errors.country = "Select a country";
  }

  return errors;
}

// Shape expected by the backend's OrderSerializer (orders/serializers.py).
// The backend rejects a payload with both `saved_address` and `address`.
export type OrderPayload = {
  email?: string;
  first_name?: string;
  last_name?: string;
  saved_address?: number;
  address?: {
    city: string;
    country: string;
    address_line1: string;
    postal_code: string;
  };
};

export function toOrderPayload(
  form: CheckoutFormData,
  { isAuthenticated, savedAddressId }: CheckoutOptions,
): OrderPayload {
  const payload: OrderPayload = {};

  // for a logged-in user the backend takes email and name from the account
  if (!isAuthenticated) {
    const [firstName, ...lastNameParts] = form.fullName.trim().split(/\s+/);

    payload.email = form.email.trim();
    payload.first_name = firstName;
    payload.last_name = lastNameParts.join(" ");
  }

  if (savedAddressId !== null) {
    payload.saved_address = savedAddressId;
  } else {
    payload.address = {
      city: form.city.trim(),
      country: form.country,
      address_line1: joinAddressLines(form.address1, form.address2),
      postal_code: form.postalCode.trim(),
    };
  }

  return payload;
}

const API_FIELD_TO_FORM_FIELD: Record<string, CheckoutField | undefined> = {
  email: "email",
  first_name: "fullName",
  last_name: "fullName",
};

const API_ADDRESS_FIELD_TO_FORM_FIELD: Record<string, CheckoutField | undefined> =
  {
    city: "city",
    country: "country",
    address_line1: "address1",
    postal_code: "postalCode",
  };

const firstMessage = (value: unknown): string | undefined => {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return firstMessage(value[0]);
  return undefined;
};

// Translates a DRF validation payload into per-field messages for the form.
// Anything that cannot be attached to a field (e.g. a rejected saved address)
// ends up in `message`.
export function mapOrderErrors(payload: unknown): {
  errors: CheckoutErrors;
  message?: string;
} {
  const errors: CheckoutErrors = {};
  let message: string | undefined;

  if (typeof payload !== "object" || payload === null) {
    return { errors };
  }

  for (const [key, value] of Object.entries(payload)) {
    const isNestedAddress =
      key === "address" &&
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value);

    if (isNestedAddress) {
      for (const [addressKey, addressValue] of Object.entries(value)) {
        const field = API_ADDRESS_FIELD_TO_FORM_FIELD[addressKey];
        const text = firstMessage(addressValue);
        if (!text) continue;
        if (field) errors[field] ??= text;
        else message ??= text;
      }
      continue;
    }

    const text = firstMessage(value);
    if (!text) continue;

    const field = API_FIELD_TO_FORM_FIELD[key];
    if (field) errors[field] ??= text;
    else message ??= text;
  }

  return { errors, message };
}
