"use server";
import { ApiError, apiFetch } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleAuth(
  type: "login" | "register",
  formData: FormData,
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  console.log(JSON.stringify(email));

  const verify_password = formData.get("verify_password") as string;
  const date_of_birth = formData.get("date_of_birth") as string;
  const phone_number = formData.get("phone_number") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;

  const bodyData = {
    email,
    password,
    ...(type === "register" && {
      verify_password,
      date_of_birth,
      phone_number,
      first_name,
      last_name,
    }),
  };

  try {
    const response = await apiFetch<{ token: string }>(`users/${type === 'login' ? 'token/' : 'create-account'}`, {
      method: "POST",
      body: JSON.stringify(bodyData),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`Error status: ${error.status}`, error.payload);
      return;
    }
    return;
  }

  redirect("/");
}

