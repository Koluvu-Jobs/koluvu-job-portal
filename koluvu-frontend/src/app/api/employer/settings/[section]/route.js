import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(request, { params }) {
  try {
    const { section } = params;
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const backendResponse = await fetch(
      `${API_BASE_URL}/api/employer/settings/${section}/`,
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
      console.error(
        `Backend settings section ${section} fetch failed:`,
        errorText
      );
      return NextResponse.json(
        { error: `Failed to fetch ${section} settings` },
        { status: backendResponse.status }
      );
    }

    const sectionData = await backendResponse.json();
    return NextResponse.json(sectionData);
  } catch (error) {
    console.error("Settings section fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { section } = params;
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
      `${API_BASE_URL}/api/employer/settings/${section}/`,
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
      console.error(
        `Backend settings section ${section} update failed:`,
        errorText
      );
      return NextResponse.json(
        { error: `Failed to update ${section} settings` },
        { status: backendResponse.status }
      );
    }

    const sectionData = await backendResponse.json();
    return NextResponse.json(sectionData);
  } catch (error) {
    console.error("Settings section update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
