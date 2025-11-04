// src/app/api/employer/[username]/profile/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request, { params }) {
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
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const userFromToken = tokenPayload.username || tokenPayload.email?.split('@')[0];
      
      if (userFromToken !== username) {
        return NextResponse.json(
          { error: "Unauthorized access to this profile" },
          { status: 403 }
        );
      }
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    console.log(`Fetching real profile data for user: ${username}`);

    // Forward request to Django backend
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/api/employer/${username}/profile/`;
    
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!backendResponse.ok) {
      console.error(`Backend request failed: ${backendResponse.status}`);
      const errorText = await backendResponse.text();
      console.error('Backend error:', errorText);
      
      return NextResponse.json(
        { error: "Failed to fetch profile from backend" },
        { status: backendResponse.status }
      );
    }

    const profileData = await backendResponse.json();
    console.log('Backend profile data received:', profileData);

    return NextResponse.json(profileData);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: `Failed to fetch profile: ${error.message}` },
      { status: 500 }
    );
  }
}