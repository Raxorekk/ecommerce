"use server";
import { ApiError, apiFetch } from "@/lib/api";
import { ApiResponse, UserAddress } from "@/types/api";

// A 401 here simply means the visitor is not logged in (a guest has no address book).
export async function getUserAddresses(): Promise<ApiResponse<UserAddress[]>> {
  try {
    const response = await apiFetch<UserAddress[]>("users/addresses/", {
      method: "GET",
    });

    return { success: true, data: response?.data ?? [] };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, status: error.status };
    }

    return { success: false, status: 500 };
  }
}
