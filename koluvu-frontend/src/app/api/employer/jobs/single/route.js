// src/app/api/employer/jobs/single/route.js

import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("id");

    console.log("🔍 [API Route] Received job ID:", jobId);

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Build backend URL with job ID
    const backendUrl = `${BACKEND_URL}/api/employer/jobs/single/?id=${encodeURIComponent(
      jobId
    )}`;

    console.log("🔍 [API Route] Calling backend:", backendUrl);

    // Forward cookies for authentication
    const cookies = request.headers.get("cookie") || "";

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies,
      },
    });

    console.log("🔍 [API Route] Backend response status:", response.status);

    const data = await response.json();
    console.log("🔍 [API Route] Backend response data:", data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("🔍 [API Route] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch job details", details: error.message },
      { status: 500 }
    );
  }
}
