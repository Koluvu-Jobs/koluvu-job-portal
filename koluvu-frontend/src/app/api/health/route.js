// src/app/api/health/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
        NODE_ENV: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Health check failed", details: error.message },
      { status: 500 }
    );
  }
}
