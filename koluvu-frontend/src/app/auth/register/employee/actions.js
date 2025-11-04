// src/app/auth/register/employee/actions.js

"use server";

export async function registerEmployee(formData) {
  try {
    const fullName = formData.get("fullName");
    const mobileNumber = formData.get("mobileNumber");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const captcha = formData.get("captcha");
    const captchaKey = formData.get("captchaKey");

    // Split full name into first and last name
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Check if email is verified
    const emailVerified = formData.get("emailVerified");
    if (!emailVerified) {
      return {
        success: false,
        message: "Please verify your email address before proceeding",
      };
    }

    // Check if mobile is verified (if you want both verifications)
    const mobileVerified = formData.get("mobileNumberVerified");
    if (!mobileVerified) {
      return {
        success: false,
        message: "Please verify your mobile number before proceeding",
      };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords don't match" };
    }

    const requestBody = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      confirm_password: confirmPassword,
      captcha_key: captchaKey, // Backend expects captcha_key
      captcha_value: captcha, // Backend expects captcha_value
      profile: {
        phone: mobileNumber,
      },
    };

    // Log the request body for debugging
    console.log(
      "Registration request body:",
      JSON.stringify(requestBody, null, 2)
    );

    const response = await fetch(
      "http://127.0.0.1:8000/api/employee/register/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message:
          errorData.error ||
          errorData.details?.confirm_password?.[0] ||
          "Registration failed",
      };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An error occurred during registration.",
    };
  }
}
