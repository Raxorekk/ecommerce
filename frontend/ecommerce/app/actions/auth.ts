"use server";
import { ApiError, apiFetch } from "@/lib/api";
import { TURBOPACK_CLIENT_MIDDLEWARE_MANIFEST } from "next/dist/shared/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleAuth(
  type: "login" | "register",
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const verify_password = formData.get("verify_password") as string;
  const date_of_birth = formData.get("date_of_birth") as string;
  const phone_number = formData.get("phone_number") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;

  const bodyData = {
    email,
    password,
    // add aditional data for registration
    ...(type === "register" && {
      verify_password,
      date_of_birth,
      phone_number,
      first_name,
      last_name,
    }),
  };

  try {
    const response = await apiFetch<{ access: string; refresh: string }>(
      `users/${type === "login" ? "token/" : "create-account"}`,
      {
        method: "POST",
        body: JSON.stringify(bodyData),
      },
    );
    if (response?.access) {
      const cookieStore = await cookies();
      cookieStore.set("ACCESS_TOKEN", response.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        // 24 hours
        maxAge: 60 * 60 * 24,
      });

      if (response?.refresh) {
        const cookieStore = await cookies();
        cookieStore.set("REFRESH_TOKEN", response.refresh, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
          // 24 hours
          maxAge: 60 * 60 * 24,
        });
      }
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`Error status: ${error.status}`, error.payload);
      return;
    }
    return;
  }

  redirect("/");
}
