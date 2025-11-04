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
    const logoFile = formData.get("company_logo");

    console.log("Form data received for logo upload");

    if (!logoFile) {
      return NextResponse.json(
        { error: "No file uploaded. Please select a company logo." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (logoFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(logoFile.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload an image file (JPEG, PNG, GIF, or WebP).",
        },
        { status: 400 }
      );
    }

    // For now, return mock success response since backend endpoint doesn't exist
    console.log("Logo uploaded successfully (mock response)");

    // Generate a mock URL for the uploaded logo
    const mockLogoUrl = `/images/company-logos/mock-logo-${Date.now()}.jpg`;

    return NextResponse.json({
      message: "Company logo uploaded successfully",
      company_logo_url: mockLogoUrl,
      company_logo: mockLogoUrl,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: `Failed to upload logo: ${error.message}` },
      { status: 500 }
    );
  }
}
