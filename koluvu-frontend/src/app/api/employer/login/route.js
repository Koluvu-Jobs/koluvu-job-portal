// src/app/api/employer/login/route.js

import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(request) {
  try {
    const { email, password, captcha_value, captcha_key } =
      await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Verify CAPTCHA first if provided
    if (captcha_value && captcha_key) {
      const captchaResponse = await fetch(
        `${BACKEND_URL}/api/auth/captcha/verify/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            captcha_value,
            captcha_key,
          }),
        }
      );

      const captchaData = await captchaResponse.json();
      if (!captchaData.valid) {
        return NextResponse.json(
          { error: "Invalid CAPTCHA. Please try again." },
          { status: 400 }
        );
      }
    }

    // First, try to authenticate with Django
    const djangoApiUrl =
      process.env.NEXT_PUBLIC_DJANGO_API_URL ||
      "http://localhost:8000/api/employer/login/";
    const djangoResponse = await fetch(djangoApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        captcha_value,
        captcha_key,
      }),
    });

    if (!djangoResponse.ok) {
      const errorData = await djangoResponse.json();
      return NextResponse.json(
        { error: errorData.error || "Login failed" },
        { status: djangoResponse.status }
      );
    }

    const djangoData = await djangoResponse.json();

    // Return Django authentication result (Supabase removed)
    return NextResponse.json(
      {
        message: "Employer logged in successfully!",
        user: djangoData.user,
        employerProfile: djangoData.employer,
        accessToken: djangoData.access_token,
        refreshToken: djangoData.refresh_token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal server error during login:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
