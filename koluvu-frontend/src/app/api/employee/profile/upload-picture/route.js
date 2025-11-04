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

    // Get the form data from the request
    const formData = await request.formData();
    console.log("Form data received for profile picture upload");

    // Call Django Backend
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employee/profile/picture/upload/`;
    console.log("Calling backend URL:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Don't set Content-Type for FormData, let the browser set it with boundary
      },
      body: formData,
    });

    console.log("Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);

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
        { error: errorData.error || "Failed to upload profile picture" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Profile picture uploaded successfully");
    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: `Failed to upload profile picture: ${error.message}` },
      { status: 500 }
    );
  }
}
