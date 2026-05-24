import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/atelier", "/api/inquiries"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path)) && !pathname.startsWith("/atelier/login");

  if (!isProtected) {
    return NextResponse.next();
  }

  // Allow public marketing pages under /atelier if any in future
  // For now, everything under /atelier is internal

  const hasValidSession = request.cookies.get("kinform_prod_auth")?.value === "true";

  if (hasValidSession) {
    return NextResponse.next();
  }

  // Redirect to login gate
  const url = new URL("/atelier/login", request.url);
  url.searchParams.set("redirect", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/atelier/:path*", "/api/inquiries/:path*"],
};
