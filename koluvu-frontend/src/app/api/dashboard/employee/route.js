import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    console.log("Dashboard API called");

    // Check Authorization header first (for localStorage tokens)
    const authHeader = request.headers.get("authorization");
    const tokenFromHeader = authHeader?.replace("Bearer ", "");

    // Fallback to cookie (for cookie-based auth)
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get("access_token")?.value;

    // Use whichever token exists
    const accessToken = tokenFromHeader || tokenFromCookie;

    console.log("Access token found:", !!accessToken);
    console.log(
      "Token source:",
      tokenFromHeader ? "header" : tokenFromCookie ? "cookie" : "none"
    );

    if (!accessToken) {
      console.log("No access token found");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employee/dashboard/`;
    console.log("Calling backend URL:", backendUrl);

    // Fetch dashboard data from Django backend
    const response = await fetch(backendUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Backend response status:", response.status);
    console.log("Backend response ok:", response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response:", errorText);

      // Handle token expiration - try to refresh
      if (
        response.status === 401 ||
        (response.status === 403 && errorText.includes("Token is expired"))
      ) {
        console.log("Token expired, attempting refresh...");

        // Get refresh token from cookie
        const refreshToken = cookieStore.get("refresh_token")?.value;

        if (refreshToken) {
          try {
            // Call backend refresh endpoint
            const refreshResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh-token/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
              }
            );

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              console.log("Token refreshed successfully");

              // Retry the original request with new token
              const retryResponse = await fetch(backendUrl, {
                headers: {
                  Authorization: `Bearer ${refreshData.access_token}`,
                  "Content-Type": "application/json",
                },
              });

              if (retryResponse.ok) {
                const retryData = await retryResponse.json();

                // Set new access token in cookie
                const nextResponse = NextResponse.json(retryData);
                nextResponse.cookies.set(
                  "access_token",
                  refreshData.access_token,
                  {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24, // 24 hours
                    path: "/",
                  }
                );

                return nextResponse;
              }
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
          }
        }

        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      }

      if (response.status === 403 && errorText.includes("User not found")) {
        console.log("🔧 Detected stale token - clearing authentication");
        return NextResponse.json(
          {
            error: "Authentication invalid - please login again",
            code: "stale_token",
            action: "clear_auth",
          },
          { status: 401 }
        );
      }

      throw new Error(`Backend error: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log("Backend response text:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse backend response as JSON:", e);
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 500 }
      );
    }

    // Ensure user object exists with required fields
    const normalizedData = {
      user: {
        ...data?.user,
        first_name: data?.user?.first_name || "",
        last_name: data?.user?.last_name || "",
        email: data?.user?.email || "",
        profile_picture_url:
          data?.user?.effective_profile_picture ||
          data?.profile?.effective_profile_picture ||
          null,
        google_profile_picture:
          data?.user?.google_profile_picture ||
          data?.profile?.google_profile_picture ||
          null,
        current_designation: data?.user?.current_designation || "",
        location: data?.user?.location || "",
        phone_number: data?.user?.phone_number || "",
        bio: data?.user?.bio || "",
        linkedin_url: data?.user?.linkedin_url || "",
      },
      profile_completion: data?.profile_completion || 0,
      stats: data?.stats || {
        applications: 0,
        interviews: 0,
        profile_views: 0,
      },
      onboarding_complete: data?.onboarding_complete || false,
    };

    console.log("Normalized data:", normalizedData);
    return NextResponse.json(normalizedData);
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: `Failed to fetch dashboard data: ${error.message}` },
      { status: 500 }
    );
  }
}
