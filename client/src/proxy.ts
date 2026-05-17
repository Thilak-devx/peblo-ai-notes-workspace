import { NextResponse } from "next/server";

// Backend auth cookies are issued from the API origin, so the frontend runtime
// cannot reliably inspect them at the edge in production. Route protection is
// enforced client-side after /auth/me resolves.
export function proxy() {
  return NextResponse.next();
}
