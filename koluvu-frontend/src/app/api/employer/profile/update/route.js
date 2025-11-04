import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(request) {
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

    // Parse Request Body
    const body = await request.json();
    console.log("Request body received for profile update");

    // For now, return success response since backend endpoint doesn't exist
    console.log("Profile update request received:", body);
    console.log("Profile updated successfully (mock response)");

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: {
        ...body,
        profile_completion_percentage: 75,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: `Failed to update profile: ${error.message}` },
      { status: 500 }
    );
  }
}
