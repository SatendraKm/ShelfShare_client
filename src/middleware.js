import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token");
  const isAuthenticated = token?.value;

  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  // Unauthenticated users trying to access protected pages
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Authenticated users trying to access auth pages
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/books/:path*",
    "/feed/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
    "/login",
    "/signup",
  ],
};
