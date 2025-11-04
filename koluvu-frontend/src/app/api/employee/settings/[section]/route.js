/**
 * Employee Settings Section API Route
 * Handles section-specific CRUD operations for employee settings.
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// GET /api/employee/settings/[section] - Get section-specific settings
export async function GET(request, { params }) {
  try {
    // TODO: Add proper authentication when NextAuth is configured

    const { section } = params;

    const response = await fetch(
      `${BACKEND_URL}/api/employee/settings/${section}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Employee settings section GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to fetch ${params.section} settings`,
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/employee/settings/[section] - Update section-specific settings
export async function PATCH(request, { params }) {
  try {
    // TODO: Add proper authentication when NextAuth is configured

    const { section } = params;
    const body = await request.json();

    const response = await fetch(
      `${BACKEND_URL}/api/employee/settings/${section}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          success: false,
          error: `Failed to update ${section} settings`,
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Employee settings section PATCH error:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Failed to update ${params.section} settings`,
        details: error.message,
      },
      { status: 500 }
    );
  }
}
