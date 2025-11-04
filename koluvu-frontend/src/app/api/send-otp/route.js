// src/app/api/send-otp/route.js

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// In-memory storage for OTPs (use Redis or database in production)
const otpStorage = new Map();

// Create email transporter based on configuration
const createTransporter = () => {
  const emailMode = process.env.EMAIL_MODE || "gmail";

  switch (emailMode) {
    case "sendgrid":
      // SendGrid configuration (professional email service)
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY,
        },
      });

    case "gmail":
      // Gmail SMTP (requires app password)
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

    case "console":
    default:
      // Development mode - no actual email sending
      return null;
  }
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(request) {
  try {
    const { email, phone, type } = await request.json();

    // Validate input - either email or phone is required
    if (!email && !phone) {
      return NextResponse.json(
        { success: false, message: "Email or phone number is required" },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const identifier = email || phone; // Use email or phone as identifier

    // Store OTP with expiration (5 minutes)
    otpStorage.set(identifier, {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0,
      type: email ? "email" : "phone",
    });

    // Handle email OTP
    if (email) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: "Invalid email format" },
          { status: 400 }
        );
      }

      const transporter = createTransporter();

      // Handle console mode (development)
      if (!transporter) {
        console.log(`
╔════════════════════════════════════════╗
║           📧 EMAIL OTP SERVICE         ║
╠════════════════════════════════════════╣
║ To:    ${email.padEnd(25)} ║
║ OTP:   ${otp.padEnd(25)} ║
║ Valid: 5 minutes                       ║
╚════════════════════════════════════════╝
        `);

        return NextResponse.json({
          success: true,
          message: "OTP sent successfully (check console for development mode)",
        });
      }

      const mailOptions = {
        from: {
          name: "Koluvu",
          address:
            process.env.FROM_EMAIL ||
            process.env.GMAIL_USER ||
            "noreply@koluvu.com",
        },
        to: email,
        subject: "Email Verification - Koluvu Registration",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification - Koluvu</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3B82F6; margin: 0; font-size: 28px; font-weight: bold;">KOLUVU</h1>
              <p style="color: #6B7280; margin: 5px 0 0 0; font-size: 14px;">Your Career Journey Starts Here</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #3B82F6 0%, #6366F1 100%); padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
              <h2 style="color: white; margin: 0 0 15px 0; font-size: 24px;">Email Verification</h2>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 0 0 20px 0; font-size: 16px;">
                Please use the following OTP to verify your email address:
              </p>
              <div style="background-color: rgba(255, 255, 255, 0.2); padding: 20px; border-radius: 8px; margin: 20px 0;">
                <span style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </span>
              </div>
              <p style="color: rgba(255, 255, 255, 0.8); margin: 0; font-size: 14px;">
                This OTP is valid for 5 minutes
              </p>
            </div>
            
            <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">Security Tips:</h3>
              <ul style="color: #6B7280; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li>Never share this OTP with anyone</li>
                <li>Koluvu will never ask for your OTP via phone or email</li>
                <li>If you didn't request this verification, please ignore this email</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
              <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                This email was sent from Koluvu Registration System<br>
                If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
        text: `Your Koluvu email verification OTP is: ${otp}. This OTP is valid for 5 minutes. Never share this OTP with anyone.`,
      };

      await transporter.sendMail(mailOptions);

      return NextResponse.json({
        success: true,
        message: "OTP sent successfully to your email",
      });
    }

    // Handle phone OTP (display in console for development)
    if (phone) {
      // Phone validation (basic)
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone.replace(/[^\d]/g, ""))) {
        return NextResponse.json(
          { success: false, message: "Invalid phone number format" },
          { status: 400 }
        );
      }

      // Log OTP to console for development (in production, integrate with SMS service)
      console.log(`
╔════════════════════════════════════════╗
║           📱 SMS OTP SERVICE           ║
╠════════════════════════════════════════╣
║ Phone: ${phone.padEnd(25)} ║
║ OTP:   ${otp.padEnd(25)} ║
║ Valid: 5 minutes                       ║
╚════════════════════════════════════════╝
      `);

      return NextResponse.json({
        success: true,
        message:
          "OTP sent successfully to your phone (check console for development)",
      });
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}

// Verify OTP endpoint
export async function PUT(request) {
  try {
    const { email, phone, otp } = await request.json();
    const identifier = email || phone;

    if (!identifier || !otp) {
      return NextResponse.json(
        { success: false, message: "Email/Phone and OTP are required" },
        { status: 400 }
      );
    }

    const storedData = otpStorage.get(identifier);

    if (!storedData) {
      return NextResponse.json(
        { success: false, message: "OTP not found or expired" },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (Date.now() > storedData.expires) {
      otpStorage.delete(identifier);
      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // Check attempts (max 3 attempts)
    if (storedData.attempts >= 3) {
      otpStorage.delete(identifier);
      return NextResponse.json(
        {
          success: false,
          message:
            "Maximum verification attempts exceeded. Please request a new OTP.",
        },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts += 1;
      otpStorage.set(identifier, storedData);

      return NextResponse.json(
        {
          success: false,
          message: `Invalid OTP. ${
            3 - storedData.attempts
          } attempts remaining.`,
        },
        { status: 400 }
      );
    }

    // OTP is correct - remove from storage
    otpStorage.delete(identifier);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
