// src/proxy.js

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Define protected routes and their required roles
const protectedRoutes = {
  "/dashboard/employer": ["employer"],
  "/dashboard/employee": ["employee"],
  "/dashboard/training": ["partner"], // Training dashboard is used for partners
  "/dashboard/admin": ["admin"],
};

// Define registration routes that should redirect authenticated users
const registrationRoutes = [
  "/auth/register/employee",
  "/auth/register/employer",
  "/auth/register/partner",
];

// Define login routes that should redirect authenticated users
const loginRoutes = [
  "/auth/login/employee",
  "/auth/login/employer",
  "/auth/login/partner",
  "/auth/login/admin",
];

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Always allow force-logout routes - no protection
  if (
    pathname === "/auth/force-logout" ||
    pathname === "/api/auth/force-logout"
  ) {
    return NextResponse.next();
  }

  // Check if current path is a protected dashboard route
  const requiredRoles = Object.entries(protectedRoutes).find(([route]) =>
    pathname.startsWith(route)
  )?.[1];

  // Check if current path is a registration or login route
  const isRegistrationRoute = registrationRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isLoginRoute = loginRoutes.some((route) => pathname.startsWith(route));
  const isMainPage = pathname === "/";

  // Get tokens from cookies and headers
  const sessionToken = request.cookies.get("sb-auth-token")?.value;
  const accessToken = request.cookies.get("access_token")?.value; // Fixed: use snake_case
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const token = sessionToken || accessToken || bearerToken;

  // For protected routes, check authentication
  if (requiredRoles) {
    if (!token) {
      console.log(
        `No server-side token found for ${pathname}, allowing client-side auth to handle`
      );
      return NextResponse.next();
    }

    try {
      // Validate the token
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userType = payload.user_type || payload.type;

      console.log(`Server-side: Token payload:`, {
        userType,
        requiredRoles,
        pathname,
      });

      // Check if user has required role
      if (!requiredRoles.includes(userType)) {
        console.log(
          `Server-side: User type '${userType}' not allowed for route '${pathname}'`
        );

        // If user is trying to access wrong dashboard, redirect to correct one
        if (
          userType === "employee" &&
          pathname.startsWith("/dashboard/employer")
        ) {
          const url = new URL("/dashboard/employee", request.url);
          console.log("Redirecting employer route to employee dashboard");
          return NextResponse.redirect(url);
        }

        if (
          userType === "employer" &&
          pathname.startsWith("/dashboard/employee")
        ) {
          const url = new URL("/dashboard/employer", request.url);
          console.log("Redirecting employee route to employer dashboard");
          return NextResponse.redirect(url);
        }

        return redirectToLogin(request, pathname, userType);
      }

      // Check token expiration
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        console.log("Server-side: Token expired, redirecting to login");
        return redirectToLogin(request, pathname);
      }

      console.log(
        `Server-side: Access granted to ${pathname} for user type: ${userType}`
      );
      return NextResponse.next();
    } catch (error) {
      console.error("Server-side token validation error:", error);
      // Don't redirect on token errors, let client-side handle it
      return NextResponse.next();
    }
  }

  // For registration, login routes, and main page - redirect authenticated users
  if (isRegistrationRoute || isLoginRoute || isMainPage) {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userType = payload.user_type || payload.type;
        const username = payload.username;

        // Check token expiration
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          console.log("Server-side: Token expired, allowing access");
          return NextResponse.next();
        }

        // Redirect to appropriate dashboard
        const dashboardPath = getDashboardPath(userType, username);
        console.log(
          `Server-side: Authenticated ${userType} accessing ${pathname}, redirecting to ${dashboardPath}`
        );
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      } catch (error) {
        console.error("Server-side token validation error:", error);
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

function getDashboardPath(userType, username) {
  const basePath =
    {
      employee: "/dashboard/employee",
      employer: "/dashboard/employer",
      partner: "/dashboard/training",
      admin: "/dashboard/admin",
    }[userType] || "/dashboard/employee";

  return username ? `${basePath}/${username}` : basePath;
}

function redirectToLogin(request, from, userType = null) {
  // Determine appropriate login page based on route or user type
  let loginPath = "/auth/login/employer"; // default

  if (from.includes("/employee") || userType === "employee") {
    loginPath = "/auth/login/employee";
  } else if (from.includes("/partner") || userType === "partner") {
    loginPath = "/auth/login/partner";
  } else if (from.includes("/admin") || userType === "admin") {
    loginPath = "/auth/login/admin";
  }

  const url = new URL(loginPath, request.url);
  url.searchParams.set("from", from);

  if (userType && !from.includes(userType)) {
    url.searchParams.set("error", "unauthorized");
  }

  return NextResponse.redirect(url);
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/register/:path*",
    "/auth/login/:path*",
    "/",
  ],
};
