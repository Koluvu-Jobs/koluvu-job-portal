// src/app/api/training/profile/check-completeness/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token found" },
        { status: 401 }
      );
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    console.log("🔍 Checking profile completeness via server-side API");
    
    const response = await fetch(`${API_BASE_URL}/api/training/profile/check-completeness/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Backend error:", error);
      return NextResponse.json(
        { error: "Failed to check profile completeness" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Profile check result:", data.is_complete);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Profile check API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
