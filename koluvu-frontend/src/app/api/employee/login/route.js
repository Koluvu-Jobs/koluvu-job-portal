import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(request) {
  try {
    const { email, password, captcha_value, captcha_key } =
      await request.json();

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

    // Forward request to Django backend
    const response = await fetch(`${BACKEND_URL}/api/employee/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email, // Django expects 'username' field
        password: password,
        captcha_value,
        captcha_key,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Create response with JWT tokens in cookies
    const responseObj = NextResponse.json(data, { status: 200 });

    if (data.access_token) {
      // Set HTTP-only cookies for JWT tokens
      responseObj.cookies.set("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour (same as JWT access token lifetime)
      });
    }

    if (data.refresh_token) {
      responseObj.cookies.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days (same as JWT refresh token lifetime)
      });
    }

    return responseObj;
  } catch (error) {
    console.error("Employee login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
