/**
 * Employee Settings API Route - Main Settings
 * Handles CRUD operations for employee settings with real-time synchronization.
 */

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// GET /api/employee/settings - Get employee settings
export async function GET(request) {
  try {
    // TODO: Add proper authentication when NextAuth is configured

    const response = await fetch(`${BACKEND_URL}/api/employee/settings/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Employee settings GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch employee settings",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/employee/settings - Update employee settings (partial)
export async function PATCH(request) {
  try {
    // TODO: Add proper authentication when NextAuth is configured

    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/employee/settings/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update employee settings",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Employee settings PATCH error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update employee settings",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT /api/employee/settings - Update employee settings (full)
export async function PUT(request) {
  try {
    // TODO: Add proper authentication when NextAuth is configured

    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/employee/settings/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update employee settings",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Employee settings PUT error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update employee settings",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
