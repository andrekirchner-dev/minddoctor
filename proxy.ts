import { NextRequest, NextResponse } from "next/server";

// Public routes — no auth required
const PUBLIC_PATHS = ["/login", "/favicon.ico"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Firebase Auth is client-side (JWT stored in browser).
  // Full server-side guard would require Firebase Admin SDK + session cookies
  // and is scoped to Phase 1 backend work.
  // Client-side: AuthProvider redirects unauthenticated users to /login.
  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
