import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export class ApiError extends Error {
  status: number;
  payload: Record<string, string | number>;

  constructor(status: number, payload: Record<string, string | number>) {
    super(`Api Error: ${status}`);
    this.status = status;
    this.payload = payload;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<T | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("ACCESS_TOKEN")?.value;

  // set token and optional headers
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // check if user is sending post, put or patch then check if body not contain a file
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${process.env.API_URL}/${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // clear token if unauthorized in case of invalid accessToken
    if (response.status === 401 && !isRetry) {
      // fetch refreshToken and set if available
      const refreshToken = cookieStore.get("REFRESH_TOKEN")?.value;
      console.log(refreshToken)
      if (refreshToken) {
        const refreshResponse = await fetch(
          `${process.env.API_URL}/users/token/refresh/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
          },
        );

        
        if (refreshResponse.ok) {
          // set new accessToken or retry request
          const data = (await refreshResponse.json()) as { access: string };
          if (data?.access) {
            cookieStore.set("ACCESS_TOKEN", data.access, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              path: "/",
              sameSite: "lax",
              // 24 hours
              maxAge: 60 * 60 * 24,
            });
            
            return apiFetch<T>(endpoint, options, true);
          }
        }
      }
      // delete tokens and redirect to login if no refreshToken
      cookieStore.delete("ACCESS_TOKEN");
      cookieStore.delete("REFRESH_TOKEN");
      
    }

    // throw error, return {payload: null} if there is no body in response
    const errorData: Record<string, string | number> = (await response
      .json()
      .catch(() => null)) ?? { payload: "null" };

    throw new ApiError(response.status, errorData);
  }

  if (response.status === 204) return null;

  return response.json();
}
