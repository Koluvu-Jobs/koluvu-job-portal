// src/app/api/training/profile/update/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token found" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
    
    console.log("📝 Updating profile via server-side API");
    
    const response = await fetch(`${API_BASE_URL}/api/training/profile/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Backend error:", error);
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    console.log("✅ Profile updated successfully");
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Profile update API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
