// src/app/api/employer/register/route.js

import supabase from "../../../../lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    const companyName = formData.get("companyName");
    // Only send email, password, and companyName to Supabase
    if (!email || !password || !companyName) {
      return NextResponse.json(
        { error: "Email, password, and company name are required." },
        { status: 400 }
      );
    }

    // Step 1: Register user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { companyName },
      },
    });
    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || "Failed to register user." },
        { status: 500 }
      );
    }

    // Step 2: Send all employer details to Django API using snake_case keys
    const djangoFormData = new FormData();
    djangoFormData.append("user_id", authData.user.id); // Supabase user id
    djangoFormData.append("email", email);
    djangoFormData.append("company_name", companyName);
    // Map camelCase to snake_case for Django
    const fieldMap = {
      totalEmployees: "total_employees",
      industryType: "industry_type",
      companyWebsite: "company_website",
      contactPerson: "contact_person",
      designation: "designation",
      phone: "phone",
      companyLocation: "company_location",
      linkedinOrWebsite: "linkedin_or_website",
    };
    for (const [camel, snake] of Object.entries(fieldMap)) {
      const value = formData.get(camel);
      if (value) djangoFormData.append(snake, value);
    }
    // Add files if present, using Django model field names
    const fileMap = {
      companyLogo: "company_logo",
      companyRegistrationDoc: "company_registration_doc",
      gstCertificate: "gst_certificate",
    };
    for (const [camel, snake] of Object.entries(fileMap)) {
      const file = formData.get(camel);
      if (file) djangoFormData.append(snake, file);
    }

    const djangoApiUrl =
      process.env.NEXT_PUBLIC_DJANGO_API_URL ||
      "http://localhost:8000/api/employer/register/";
    const djangoResponse = await fetch(djangoApiUrl, {
      method: "POST",
      body: djangoFormData,
    });
    const djangoResult = await djangoResponse.json();
    if (!djangoResponse.ok) {
      return NextResponse.json(
        {
          error:
            djangoResult.error ||
            "Failed to save employer details in local database.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Employer registered successfully!",
        user: authData.user,
        djangoResult,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Internal server error during registration:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
