import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET(request, { params }) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Forward request to Django backend
    const response = await fetch(
      `${BACKEND_URL}/api/employer/applicants/${id}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return NextResponse.json(
        {
          error: "Backend returned non-JSON response",
          status: response.status,
          bodyPreview: text.slice(0, 200),
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch applicant detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applicant details. Please try again." },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Forward request to Django backend
    const response = await fetch(
      `${BACKEND_URL}/api/employer/applicants/${id}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return NextResponse.json(
        {
          error: "Backend returned non-JSON response",
          status: response.status,
          bodyPreview: text.slice(0, 200),
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update applicant error:", error);
    return NextResponse.json(
      { error: "Failed to update applicant. Please try again." },
      { status: 500 }
    );
  }
}
