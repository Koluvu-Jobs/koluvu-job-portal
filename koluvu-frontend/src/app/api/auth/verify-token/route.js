import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
    
    let authorization = request.headers.get("authorization");
    
    // If no Authorization header, try to get from cookies
    if (!authorization) {
      const accessToken = request.cookies.get('access_token')?.value;
      if (accessToken) {
        authorization = `Bearer ${accessToken}`;
      }
    }

    console.log('Verify token request:', {
      hasAuthHeader: !!request.headers.get("authorization"),
      hasAccessTokenCookie: !!request.cookies.get('access_token')?.value,
      finalAuth: !!authorization,
      backendUrl
    });

    if (!authorization) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Forward the request to Django backend
    const backendResponse = await fetch(
      `${backendUrl}/api/auth/verify-token/`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
        },
        credentials: 'include'
      }
    );

    console.log('Backend response status:', backendResponse.status);

    const responseText = await backendResponse.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse backend response:', responseText);
      return NextResponse.json(
        { error: "Backend returned invalid response", details: responseText },
        { status: 500 }
      );
    }

    if (!backendResponse.ok) {
      console.error('Backend error:', data);
      return NextResponse.json(data, { status: backendResponse.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Token verification API error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
