import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";

export async function proxy(request) {
  const session = await getServerSession();
  const pathname = request.nextUrl.pathname;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (
    !token &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/home"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/home/:path*", "/"],
};
