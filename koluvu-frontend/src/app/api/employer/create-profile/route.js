// src/app/api/employer/create-profile/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    // Extract all fields from the request
    const {
      username,
      company_name,
      employer_name,
      contact_person,
      designation,
      email,
      phone,
      company_location,
      website,
      industry_type,
      company_size,
      total_employees,
      bio,
      employer_introduction,
      linkedin_profile_url,
      github_profile_url,
      twitter_profile_url,
      facebook_profile_url,
      instagram_profile_url,
    } = body;

    // Validate required fields
    if (!username || !company_name || !employer_name) {
      return NextResponse.json(
        { error: "Username, company name, and employer name are required" },
        { status: 400 }
      );
    }

    // Get access token from cookies
    const accessToken = request.cookies.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Forward the request to Django backend
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${backendUrl}/api/employer/create-profile/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        username,
        company_name,
        employer_name,
        contact_person,
        designation,
        email,
        phone,
        company_location,
        website,
        industry_type,
        company_size,
        total_employees,
        bio,
        employer_introduction,
        linkedin_profile_url,
        github_profile_url,
        twitter_profile_url,
        facebook_profile_url,
        instagram_profile_url,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to create profile" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
