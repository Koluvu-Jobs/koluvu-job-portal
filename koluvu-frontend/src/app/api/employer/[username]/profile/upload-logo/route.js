// src/app/api/employer/[username]/profile/upload-logo/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request, { params }) {
  try {
    const { username } = await params;
    
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify that the requested username matches the authenticated user
    try {
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const userFromToken = tokenPayload.username || tokenPayload.email?.split('@')[0];
      
      if (userFromToken !== username) {
        return NextResponse.json(
          { error: "Unauthorized access to this profile" },
          { status: 403 }
        );
      }
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get the form data from the request
    const formData = await request.formData();
    const logoFile = formData.get('company_logo');
    
    console.log(`Form data received for logo upload for user: ${username}`);
    
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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(logoFile.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload an image file (JPEG, PNG, GIF, or WebP)." },
        { status: 400 }
      );
    }
    
    // Forward request to Django backend
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/api/employer/${username}/profile/upload-logo/`;
    
    const backendFormData = new FormData();
    backendFormData.append('company_logo', logoFile);
    
    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: backendFormData,
    });

    if (!backendResponse.ok) {
      console.error(`Backend logo upload failed: ${backendResponse.status}`);
      const errorText = await backendResponse.text();
      console.error('Backend error:', errorText);
      
      return NextResponse.json(
        { error: "Failed to upload logo to backend" },
        { status: backendResponse.status }
      );
    }

    const uploadResult = await backendResponse.json();
    console.log(`Logo uploaded successfully for user: ${username}`);
    
    return NextResponse.json(uploadResult);

  } catch (error) {
    console.error("Logo upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload company logo" },
      { status: 500 }
    );
  }
}