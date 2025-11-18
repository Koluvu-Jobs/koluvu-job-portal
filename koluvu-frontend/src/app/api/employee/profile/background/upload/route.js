import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
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

    const formData = await request.formData();
    console.log("Form data received for background image upload");

    // Proxy to Django backend background upload endpoint
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/api/employee/profile/background/upload/`;
    console.log("Calling backend background upload URL:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Let the browser/node set Content-Type for FormData
      },
      body: formData,
    });

    console.log("Backend response status (background upload):", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response (background upload):", errorText);

      if (response.status === 401) {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }

      return NextResponse.json(
        { error: errorData.error || "Failed to upload background image" },
        { status: response.status }
      );
    }

    const data = await response.json();
    // If backend returned a relative media URL, convert it to absolute using backend base
    const backendBase = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}`.replace(/\/$/, '');
    if (data && data.background_image_url && typeof data.background_image_url === 'string' && data.background_image_url.startsWith('/')) {
      data.background_image_url = backendBase + data.background_image_url;
    }

    console.log("Background image uploaded successfully");
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error (background upload):", error);
    return NextResponse.json(
      { error: `Failed to upload background image: ${error.message}` },
      { status: 500 }
    );
  }
}
