// src/app/api/employer/login/route.js

import supabase from "../../../../lib/supabaseClient";
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

    // Then authenticate with Supabase
    const { data: supabaseData, error: supabaseError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (supabaseError) {
      console.error("Supabase auth error during login:", supabaseError);
      if (supabaseError.code === "email_not_confirmed") {
        return NextResponse.json(
          {
            error:
              "Email not verified. Please verify your email before logging in.",
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Invalid login credentials." },
        { status: supabaseError.status || 401 }
      );
    }

    if (!supabaseData.user) {
      console.error("No user data returned after sign in");
      return NextResponse.json(
        { error: "Failed to login: No user data returned." },
        { status: 500 }
      );
    }

    // Set the cookie server-side
    const response = NextResponse.json(
      {
        message: "Employer logged in successfully!",
        user: supabaseData.user,
        session: supabaseData.session,
        employerProfile: djangoData.employer,
      },
      { status: 200 }
    );

    if (supabaseData.session?.access_token) {
      response.cookies.set("sb-auth-token", supabaseData.session.access_token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        // httpOnly: true, // Uncomment if you want HTTP-only
      });
    }

    return response;
  } catch (error) {
    console.error("Internal server error during login:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
