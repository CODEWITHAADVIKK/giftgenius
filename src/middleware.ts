import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
  // We only want to protect routes inside /api/profile or similar
  if (req.nextUrl.pathname.startsWith("/api/profile")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Missing authentication token." }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      
      // In Next.js middleware (Edge runtime), we use 'jose' instead of 'jsonwebtoken'
      const { payload } = await jose.jwtVerify(token, secret);
      
      // Pass the userId to the target route via headers
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-id", payload.userId as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (_err) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/api/profile/:path*",
  ],
};
