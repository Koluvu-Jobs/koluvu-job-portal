// src/app/dashboard/employee/page.js
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * This page only exists to redirect users to their username-based dashboard.
 * The actual dashboard functionality is in /dashboard/employee/[username]/page.js
 * 
 * This ensures a clean, professional URL structure where every user has their own route.
 */
export default function EmployeeDashboardRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      router.replace("/auth/login/employee");
      return;
    }

    // If user is an employer (not employee), redirect to employer dashboard
    if (user.user_type === "employer" && !user.employee_profile) {
      router.replace("/dashboard/employer");
      return;
    }

    // If user doesn't have a username, there's a data issue
    if (!user.username) {
      console.error("User authenticated but no username found:", user);
      // You might want to redirect to a profile completion page or show an error
      router.replace("/auth/login/employee");
      return;
    }

    // Redirect to the username-based route, preserving any query parameters
    const currentTab = searchParams.get("tab");
    const targetUrl = currentTab 
      ? `/dashboard/employee/${user.username}?tab=${currentTab}`
      : `/dashboard/employee/${user.username}`;
    
    console.log("Redirecting to username-based dashboard:", targetUrl);
    router.replace(targetUrl);
  }, [loading, isAuthenticated, user, router, searchParams]);

  // Show loading state while processing redirect
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}