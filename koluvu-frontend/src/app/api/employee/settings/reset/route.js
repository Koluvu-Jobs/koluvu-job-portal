/**
 * Employee Settings Reset API Route
 * Handles resetting employee settings to default values.
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// POST /api/employee/settings/reset - Reset employee settings to defaults
export async function POST(request) {
  try {
    // TODO: Add proper authentication when NextAuth is configured

    const response = await fetch(
      `${BACKEND_URL}/api/employee/settings/reset/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          success: false,
          error: "Failed to reset employee settings",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Employee settings reset error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to reset employee settings",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
