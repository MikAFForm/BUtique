import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/creator", "/api", "/dev/graphiql"];
const STATIC_EXT = /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public assets and public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/static") ||
    STATIC_EXT.test(pathname) ||
    PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.get("session_user_id");
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
