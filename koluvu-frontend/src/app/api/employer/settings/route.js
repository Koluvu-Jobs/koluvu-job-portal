import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function GET() {
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
      `${API_BASE_URL}/api/employer/settings/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("Backend settings fetch failed:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch settings" },
        { status: backendResponse.status }
      );
    }

    const settingsData = await backendResponse.json();
    return NextResponse.json(settingsData);
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const requestBody = await request.json();

    const backendResponse = await fetch(
      `${API_BASE_URL}/api/employer/settings/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("Backend settings update failed:", errorText);
      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: backendResponse.status }
      );
    }

    const settingsData = await backendResponse.json();
    return NextResponse.json(settingsData);
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const requestBody = await request.json();

    const backendResponse = await fetch(
      `${API_BASE_URL}/api/employer/settings/`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error("Backend settings full update failed:", errorText);
      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: backendResponse.status }
      );
    }

    const settingsData = await backendResponse.json();
    return NextResponse.json(settingsData);
  } catch (error) {
    console.error("Settings full update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
