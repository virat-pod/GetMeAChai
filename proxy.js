import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/home"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && (pathname === "/" || pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}