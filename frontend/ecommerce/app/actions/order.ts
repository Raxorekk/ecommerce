"use server";
import { cookies } from "next/headers";
import { ApiError, apiFetch } from "@/lib/api";
import {
  CheckoutErrors,
  CheckoutFormData,
  mapOrderErrors,
  toOrderPayload,
  validateCheckoutForm,
} from "@/lib/checkout";
import { OrderCheckoutResponse } from "@/types/api";

export type CreateOrderResult =
  | { success: true; url: string }
  | { success: false; errors: CheckoutErrors; message?: string };

const GENERIC_ERROR = "Couldn't start payment. Please try again.";

export async function createOrder(
  form: CheckoutFormData,
  savedAddressId: number | null,
): Promise<CreateOrderResult> {
  // Server Functions can be called directly, so the data is validated again here.
  // The login state is read from the cookie instead of trusting the client; the
  // backend still has the final word on who is allowed to do what.
  const cookieStore = await cookies();
  const isAuthenticated = Boolean(cookieStore.get("ACCESS_TOKEN"));
  const options = {
    isAuthenticated,
    // guests have no saved addresses
    savedAddressId: isAuthenticated ? savedAddressId : null,
  };

  const errors = validateCheckoutForm(form, options);
  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    const response = await apiFetch<OrderCheckoutResponse>(
      "api/orders/create",
      {
        method: "POST",
        body: JSON.stringify(toOrderPayload(form, options)),
      },
    );

    const url = response?.data.checkout_url;
    if (!url) {
      return { success: false, errors: {}, message: GENERIC_ERROR };
    }

    return { success: true, url };
  } catch (error) {
    if (error instanceof ApiError) {
      const mapped = mapOrderErrors(error.payload);
      return {
        success: false,
        errors: mapped.errors,
        message:
          mapped.message ??
          (Object.keys(mapped.errors).length > 0 ? undefined : GENERIC_ERROR),
      };
    }

    return { success: false, errors: {}, message: GENERIC_ERROR };
  }
}
