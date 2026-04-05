import { cookies } from "next/headers";

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
): Promise<T | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("ACCESS_TOKEN")?.value;

  let headers: Record<string, string> = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers as Record<string, string>),
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const response = await fetch(`${process.env.API_URL}/${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData: Record<string, string | number> = (await response
      .json()
      .catch(() => null)) ?? { payload: "null" };

    throw new ApiError(response.status, errorData);
  }

  if (response.status === 204) return null;

  return response.json();
}
