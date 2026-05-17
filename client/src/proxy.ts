import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedPaths = ["/dashboard", "/notes"];
const authCookieName = "token";

function matchesPath(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasAuthCookie = Boolean(request.cookies.get(authCookieName)?.value);

  if (!hasAuthCookie && matchesPath(pathname, protectedPaths)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/notes/:path*"],
};
