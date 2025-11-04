// src/app/dashboard/employee/components/Dashboard.js

"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Component() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Fetching dashboard data...");

      // Get access token from localStorage
      const accessToken = localStorage.getItem("access_token");
      console.log("Access token available:", !!accessToken);

      // Debug: Check localStorage
      const localStorageData = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        user: localStorage.getItem("user"),
        userType: localStorage.getItem("userType"),
      };
      console.log("LocalStorage data:", localStorageData);

      // Include Authorization header with token
      const headers = {
        "Content-Type": "application/json",
      };

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch("/api/employee/dashboard", {
        headers: headers,
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Response error:", errorData);

        // Handle stale token automatically
        if (
          errorData.code === "stale_token" &&
          errorData.action === "clear_auth"
        ) {
          console.log(
            "🔧 Stale token detected - clearing auth and redirecting"
          );
          logout(); // This will clear all auth data
          window.location.href = "/auth/login/employee";
          return;
        }

        throw new Error(
          `Failed to fetch dashboard data: ${response.status} - ${
            errorData.error || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      console.log("Dashboard data received:", data);
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const debugCookies = async () => {
    try {
      const response = await fetch("/api/debug/cookies");
      const data = await response.json();
      console.log("Cookie debug data:", data);
      alert(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Cookie debug error:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-12 w-1/3 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading dashboard</h3>
          <p className="text-red-600">{error}</p>
          <div className="mt-2 space-x-2">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
            <button
              onClick={debugCookies}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Debug Cookies
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userData = dashboardData?.user;
  const stats = dashboardData?.stats;

  return (
    <div className="p-8 space-y-6">
      {/* Header with user info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4">
          {/* Profile Picture */}
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            {userData?.google_profile_picture ? (
              <img
                src={userData.google_profile_picture}
                alt={userData.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                {userData?.first_name?.[0]}
                {userData?.last_name?.[0]}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userData?.first_name || "User"}!
            </h1>
            <p className="text-gray-600">
              {userData?.current_designation || "Software Professional"}
              {userData?.location && ` • ${userData.location}`}
            </p>
            <div className="flex items-center mt-2 space-x-4">
              <span className="text-sm text-gray-500">
                Profile: {dashboardData?.profile_completion || 0}% complete
              </span>
              {dashboardData?.social_account && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected via Google
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile completion warning */}
        {!dashboardData?.onboarding_complete && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Complete your profile to get better job matches
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Add your skills, experience, and preferences to help employers
                  find you.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">
                Profile Completion
              </p>
              <p className="text-2xl font-bold text-green-900">
                {dashboardData?.profile_completion || 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-green-600 text-sm">↗ +15%</span>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">
                Applications
              </p>
              <p className="text-2xl font-bold text-yellow-900">
                {stats?.applications || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-yellow-600 text-sm">↗ +23%</span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Interviews</p>
              <p className="text-2xl font-bold text-blue-900">
                {stats?.interviews || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-blue-600 text-sm">↗ +8%</span>
          </div>
        </div>

        <div className="bg-cyan-50 rounded-lg p-6 border border-cyan-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-600 text-sm font-medium">Profile Views</p>
              <p className="text-2xl font-bold text-cyan-900">
                {stats?.profile_views?.toLocaleString() || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-cyan-200 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-cyan-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-cyan-600 text-sm">↗ +31%</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Applied Jobs
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  Senior React Developer
                </p>
                <p className="text-sm text-gray-600">TechCorp Inc.</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Interview Scheduled
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Location-Based Jobs
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Senior Developer</p>
                <p className="text-sm text-gray-600">Bangalore Tech Hub</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                On-site
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
