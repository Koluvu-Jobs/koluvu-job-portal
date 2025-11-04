import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function POST() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(
      `${API_BASE_URL}/api/employer/settings/reset/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("Backend settings reset failed:", errorText);
      return NextResponse.json(
        { error: "Failed to reset settings" },
        { status: backendResponse.status }
      );
    }

    const resetData = await backendResponse.json();
    return NextResponse.json(resetData);
  } catch (error) {
    console.error("Settings reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
