// src/app/api/employer/[username]/profile/create/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request, { params }) {
  try {
    const { username } = await params;

    // Extract Access Token
    const authHeader = request.headers.get("authorization");
    const tokenFromHeader = authHeader?.replace("Bearer ", "");

    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get("access_token")?.value;

    const accessToken = tokenFromHeader || tokenFromCookie;

    console.log(
      "Token source:",
      tokenFromHeader ? "header" : tokenFromCookie ? "cookie" : "none"
    );

    if (!accessToken) {
      console.log("No access token found");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify that the requested username matches the authenticated user
    try {
      const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
      const userIdFromToken = tokenPayload.user_id;

      if (!userIdFromToken) {
        return NextResponse.json(
          { error: "Invalid token format" },
          { status: 401 }
        );
      }

      // Fetch user details from backend
      const userCheckUrl = `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
      }/api/auth/user/`;
      const userCheckResponse = await fetch(userCheckUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userCheckResponse.ok) {
        return NextResponse.json(
          { error: "Failed to verify user identity" },
          { status: 401 }
        );
      }

      const userData = await userCheckResponse.json();
      const emailPrefix = userData.email?.split("@")[0];
      const isAuthorized =
        userData.username === username ||
        emailPrefix === username ||
        String(userData.id) === username;

      if (!isAuthorized) {
        return NextResponse.json(
          { error: "Unauthorized: You can only create your own profile" },
          { status: 403 }
        );
      }
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    console.log(`Creating profile for user: ${username}`);

    // Get request body
    const body = await request.json();

    // Forward request to Django backend
    const backendUrl = `${
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
    }/api/employer/${username}/profile/create/`;

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      console.error(`Backend request failed: ${backendResponse.status}`);
      const errorText = await backendResponse.text();
      console.error("Backend error:", errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        return NextResponse.json(
          { error: "Failed to create profile" },
          { status: backendResponse.status }
        );
      }

      return NextResponse.json(
        { error: errorData.error || "Failed to create profile" },
        { status: backendResponse.status }
      );
    }

    const profileData = await backendResponse.json();
    console.log("Profile created successfully:", profileData);

    return NextResponse.json(profileData, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: `Failed to create profile: ${error.message}` },
      { status: 500 }
    );
  }
}
