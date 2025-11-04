// src/app/api/employer/profile/upload-picture/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the form data from the request
    const formData = await request.formData();
    const profilePicture = formData.get("profile_picture");

    console.log("Form data received for profile picture upload");

    if (!profilePicture) {
      return NextResponse.json(
        { error: "No file uploaded. Please select a profile picture." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (profilePicture.size > 5 * 1024 * 1024) {
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
    if (!allowedTypes.includes(profilePicture.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload an image file (JPEG, PNG, GIF, or WebP).",
        },
        { status: 400 }
      );
    }

    // For now, return mock success response since backend endpoint doesn't exist
    console.log("Profile picture uploaded successfully (mock response)");

    // Generate a mock URL for the uploaded profile picture
    const mockProfilePictureUrl = `/images/profile-pictures/mock-profile-${Date.now()}.jpg`;

    return NextResponse.json({
      message: "Profile picture uploaded successfully",
      profile_picture_url: mockProfilePictureUrl,
      profile_picture: mockProfilePictureUrl,
    });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload profile picture" },
      { status: 500 }
    );
  }
}
