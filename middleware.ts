import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { JWT_SECRET, COOKIE_NAME } from "./lib/constants";

// Base64 URL decode function for Edge Runtime
function base64UrlDecode(str: string): string {
  // Add padding if needed
  str += "=".repeat((4 - (str.length % 4)) % 4);
  // Replace URL-safe characters
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  // Decode base64
  return atob(str);
}

// Custom JWT verification for Edge Runtime
async function verifyTokenInMiddleware(token: string): Promise<boolean> {
  try {
    console.log(
      `🔍 Verifying token with secret: ${
        JWT_SECRET ? "Secret present" : "No secret"
      }`
    );
    console.log(`🎫 Token length: ${token.length}`);

    // Split JWT into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.log(
        `❌ Invalid JWT format: expected 3 parts, got ${parts.length}`
      );
      return false;
    }

    const [header, payload] = parts;

    // Decode header and payload
    const decodedHeader = JSON.parse(base64UrlDecode(header));
    const decodedPayload = JSON.parse(base64UrlDecode(payload));

    console.log(`📋 JWT Header:`, decodedHeader);
    console.log(`📦 JWT Payload:`, decodedPayload);

    // Check if token is expired
    if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
      console.log(`❌ Token expired`);
      return false;
    }

    // For Edge Runtime, we'll do basic validation
    // The real signature verification happens on the server side
    if (!decodedPayload.userId || !decodedPayload.email) {
      console.log(`❌ Missing required payload fields`);
      return false;
    }

    console.log(`✅ Token validation passed for user:`, decodedPayload.email);
    return true;
  } catch (error: any) {
    console.log(`❌ Token verification failed:`, error.message);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const authPaths = ["/login", "/register", "/forgot-password"];
  const protectedPaths = [
    "/home",
    "/dashboard",
    "/profile",
    "/settings",
    "/portfolio/profile",
    "/portfolio/projects",
    "/portfolio/skills",
    "/portfolio/experience",
  ];
  const publicPaths = ["/landing", "/debug"];

  console.log(`🛡️ Middleware: ${request.method} ${path}`);

  // Skip middleware for API routes
  if (path.startsWith("/api")) {
    console.log("⏭️ Skipping API route");
    return NextResponse.next();
  }

  // Allow public portfolio views
  if (path.startsWith("/portfolio/view/")) {
    console.log("🌍 Public portfolio view, allowing access");
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  console.log(`🍪 Auth cookie present: ${!!cookie}`);

  // Allow public paths for everyone
  if (publicPaths.includes(path)) {
    console.log("🌍 Public path, allowing access");
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (authPaths.includes(path)) {
    if (cookie && (await verifyTokenInMiddleware(cookie))) {
      console.log(
        "🔄 Authenticated user on auth page, redirecting to dashboard"
      );
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    console.log("👤 Unauthenticated user on auth page, allowing access");
    return NextResponse.next();
  }

  // Protect dashboard and other protected routes
  if (protectedPaths.some((p) => path.startsWith(p))) {
    if (!cookie || !(await verifyTokenInMiddleware(cookie))) {
      console.log(
        "🚫 Unauthenticated user on protected route, redirecting to login"
      );
      return NextResponse.redirect(new URL("/login", request.url));
    }
    console.log("✅ Authenticated user on protected route, allowing access");
    return NextResponse.next();
  }

  console.log("⏭️ Path not matched, allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
