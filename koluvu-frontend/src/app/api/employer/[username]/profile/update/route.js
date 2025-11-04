// src/app/api/employer/[username]/profile/update/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(request, { params }) {
  try {
    const { username } = await params;
    
    // Extract Access Token
    const authHeader = request.headers.get("authorization");
    const tokenFromHeader = authHeader?.replace("Bearer ", "");

    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get("access_token")?.value;

    const accessToken = tokenFromHeader || tokenFromCookie;

    if (!accessToken) {
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

    const requestBody = await request.json();
    console.log(`Profile update request received for ${username}:`, requestBody);

    // Forward request to Django backend
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/api/employer/${username}/profile/update/`;
    
    const backendResponse = await fetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!backendResponse.ok) {
      console.error(`Backend update request failed: ${backendResponse.status}`);
      const errorText = await backendResponse.text();
      console.error('Backend error:', errorText);
      
      return NextResponse.json(
        { error: "Failed to update profile in backend" },
        { status: backendResponse.status }
      );
    }

    const updatedProfile = await backendResponse.json();
    console.log(`Profile updated successfully for user: ${username}`);

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedProfile
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}