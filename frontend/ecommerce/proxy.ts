import { NextResponse, type NextRequest } from "next/server";
import { PROTECTED_ROUTES, AUTH_ROUTES } from "./lib/routes";
import { cookies } from "next/headers";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    path.startsWith(route),
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => path.startsWith(route));
  const cookieStore = await cookies();

  const token = cookieStore.get("ACCESS_TOKEN")?.value;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}
