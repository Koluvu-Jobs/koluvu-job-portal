// src/app/api/auth/force-logout/route.js

import { NextResponse } from "next/server";

export async function GET(request) {
  console.log("🔥 Server-side force logout initiated");

  // Create response that redirects to home
  const response = NextResponse.redirect(new URL("/", request.url));

  // List of all possible auth cookies to clear
  const authCookies = [
    "access_token",
    "accessToken",
    "refresh_token",
    "refreshToken",
    "user_type",
    "userType",
    "sb-auth-token",
    "authToken",
    "jwt",
    "token",
  ];

  // Clear ALL auth cookies with Set-Cookie headers
  authCookies.forEach((cookieName) => {
    // Clear for all possible paths and domains
    response.cookies.set(cookieName, "", {
      path: "/",
      expires: new Date(0),
      maxAge: 0,
    });
  });

  console.log("✅ All cookies cleared via Set-Cookie headers");
  console.log("🔄 Redirecting to home page");

  return response;
}
