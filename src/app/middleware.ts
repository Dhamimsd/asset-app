import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Protect /dashboard and subroutes
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Redirect logged-in users away from login page
  if (req.nextUrl.pathname === "/login" && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch {
      // ignore invalid token
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
