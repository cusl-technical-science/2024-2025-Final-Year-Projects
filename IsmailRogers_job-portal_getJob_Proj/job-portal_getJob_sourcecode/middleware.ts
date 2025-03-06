import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isProtectedRoute = createRouteMatcher(["/admin", "/user/dashboard", "/dashboard/routes"]);
const isPublicRoute = createRouteMatcher(["/", "/landing", "/sign-in"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = new URL(req.url);

  // ✅ Allow Public Routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // ✅ Protect Admin Routes
  if (isAdminRoute(req)) {
    if (!userId || sessionClaims?.metadata?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ✅ Protect Other Routes
  if (isProtectedRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL("/landing", req.url));
    }
  }

  // ✅ Redirect Users After Login
  if (url.pathname === "/sign-in" && userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", 
    "/admin/jobs",
    "/user/dashboard",
    "/dashboard/routes",
    "/admin",
    "/sign-in",
    "/(api|trpc)(.*)"
  ],
};
