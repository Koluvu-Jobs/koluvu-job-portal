import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    // Extract Access Token
    const authHeader = request.headers.get("authorization");
    const tokenFromHeader = authHeader?.replace("Bearer ", "");

    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get("access_token")?.value;

    const accessToken = tokenFromHeader || tokenFromCookie;

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

    // For now, return mock data since backend endpoint doesn't exist
    console.log("Returning mock profile data");

    const mockData = {
      company_name: "Your Company",
      employer_name: "Employer Name",
      contact_person: "",
      designation: "",
      phone: "",
      company_location: "",
      website: "",
      industry_type: "",
      company_size: "",
      total_employees: "",
      bio: "",
      employer_introduction: "",
      linkedin_profile_url: "",
      github_profile_url: "",
      twitter_profile_url: "",
      facebook_profile_url: "",
      instagram_profile_url: "",
      company_logo: null,
      company_logo_url: "",
      profile_picture_url: "",
      profile_completion_percentage: 25,
      user: {
        email: "employer@example.com",
      },
    };

    return NextResponse.json(mockData);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: `Failed to fetch profile: ${error.message}` },
      { status: 500 }
    );
  }
}
