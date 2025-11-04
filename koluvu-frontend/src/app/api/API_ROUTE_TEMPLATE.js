// API Route Template - Copy this for new protected API routes
// Location: src/app/api/[your-route]/route.js

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * GET Handler Template
 * Supports both localStorage (Authorization header) and cookie-based authentication
 */
export async function GET(request) {
  try {
    // ============================================
    // STEP 1: Extract Access Token
    // ============================================
    // Check Authorization header first (for localStorage tokens)
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.replace('Bearer ', '');
    
    // Fallback to cookie (for cookie-based auth)
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get("access_token")?.value;
    
    // Use whichever token exists (priority: header > cookie)
    const accessToken = tokenFromHeader || tokenFromCookie;
    
    // Debug logging
    console.log("Token source:", tokenFromHeader ? "header" : tokenFromCookie ? "cookie" : "none");

    // ============================================
    // STEP 2: Validate Token Exists
    // ============================================
    if (!accessToken) {
      console.log("No access token found");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // ============================================
    // STEP 3: Call Django Backend
    // ============================================
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/your-endpoint/`;
    console.log("Calling backend URL:", backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Backend response status:", response.status);

    // ============================================
    // STEP 4: Handle Backend Response
    // ============================================
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);

      // Handle token expiration
      if (response.status === 401) {
        return NextResponse.json(
          { error: "Token expired" },
          { status: 401 }
        );
      }

      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    // ============================================
    // STEP 5: Return Success Response
    // ============================================
    const data = await response.json();
    console.log("Backend data received successfully");
    return NextResponse.json(data);

  } catch (error) {
    // ============================================
    // STEP 6: Handle Errors
    // ============================================
    console.error("API error:", error);
    return NextResponse.json(
      { error: `Failed to process request: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * POST Handler Template
 * Supports both localStorage (Authorization header) and cookie-based authentication
 */
export async function POST(request) {
  try {
    // ============================================
    // STEP 1: Extract Access Token (Same as GET)
    // ============================================
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.replace('Bearer ', '');
    
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get("access_token")?.value;
    
    const accessToken = tokenFromHeader || tokenFromCookie;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // ============================================
    // STEP 2: Parse Request Body
    // ============================================
    const body = await request.json();
    console.log("Request body received");

    // ============================================
    // STEP 3: Call Django Backend
    // ============================================
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/your-endpoint/`;

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // ============================================
    // STEP 4: Handle Response (Same as GET)
    // ============================================
    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      
      const errorText = await response.text();
      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: `Failed to process request: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * PUT Handler Template (for updates)
 */
export async function PUT(request) {
  try {
    // Extract token (same pattern)
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.replace('Bearer ', '');
    
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get("access_token")?.value;
    
    const accessToken = tokenFromHeader || tokenFromCookie;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse body
    const body = await request.json();

    // Call backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/your-endpoint/`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("API update error:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

/**
 * DELETE Handler Template
 */
export async function DELETE(request) {
  try {
    // Extract token (same pattern)
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.replace('Bearer ', '');
    
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get("access_token")?.value;
    
    const accessToken = tokenFromHeader || tokenFromCookie;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get ID from URL if needed
    // const { searchParams } = new URL(request.url);
    // const id = searchParams.get('id');

    // Call backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/your-endpoint/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }
      throw new Error(`Backend error: ${response.status}`);
    }

    return NextResponse.json({ message: "Deleted successfully" });

  } catch (error) {
    console.error("API delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}

/**
 * NOTES:
 * 
 * 1. Token Extraction Pattern:
 *    - Always check Authorization header first (localStorage)
 *    - Fallback to cookie (for backward compatibility)
 *    - Use whichever exists
 * 
 * 2. Error Handling:
 *    - Return 401 if no token
 *    - Return 401 if token expired (backend returns 401)
 *    - Return 500 for other errors
 * 
 * 3. Logging:
 *    - Log token source for debugging
 *    - Log backend URL being called
 *    - Log response status
 *    - Log errors
 * 
 * 4. Security:
 *    - Always validate token exists before backend call
 *    - Forward token to backend in Authorization header
 *    - Let Django backend validate JWT token
 * 
 * 5. Response Format:
 *    - Return JSON responses
 *    - Include appropriate status codes
 *    - Provide clear error messages
 */
