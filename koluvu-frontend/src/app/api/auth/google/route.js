import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Received request body:", body);

    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google/`;
    console.log("Forwarding to backend:", backendUrl);

    // Normalize the payload expected by the Django backend.
    // The frontend sends { credential, user_type } (Google Identity Services).
    // The backend expects either `credential` or `access_token` field.
    const payload = {
      // Send credential field as expected by Django backend
      credential: body.credential || body.token || body.id_token || null,
      user_type: body.user_type,
    };

    console.log("Forwarding payload to backend:", payload);

    // Forward the request to Django backend
    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Backend response status:", backendResponse.status);
    console.log(
      "Backend response headers:",
      Object.fromEntries(backendResponse.headers)
    );

    let data;
    try {
      data = await backendResponse.json();
      console.log("Backend response data:", data);
    } catch (parseError) {
      console.error("Failed to parse backend response:", parseError);
      const textResponse = await backendResponse.text();
      console.error("Backend response text:", textResponse);
      return NextResponse.json(
        { error: "Backend returned invalid JSON", details: textResponse },
        { status: 500 }
      );
    }

    if (!backendResponse.ok) {
      console.error("Backend error:", data);
      return NextResponse.json(data, { status: backendResponse.status });
    }

    // Create response with user data
    const response = NextResponse.json(data);

    // Set authentication cookies if tokens are present
    if (data.access_token) {
      response.cookies.set("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
    }

    if (data.refresh_token) {
      response.cookies.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

    console.log("Successfully set authentication cookies");
    return response;
  } catch (error) {
    console.error("Google OAuth API error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
