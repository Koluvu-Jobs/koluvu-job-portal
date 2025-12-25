// src/app/auth/force-logout/page.js

"use client";

import { useEffect } from "react";

export default function ForceLogout() {
  useEffect(() => {
    // Clear client-side storage first
    if (typeof window !== "undefined") {
      console.log(
        "🔥 Client-side: Clearing localStorage and sessionStorage..."
      );

      localStorage.clear();
      sessionStorage.clear();

      // Clear all cookies client-side
      document.cookie.split(";").forEach((c) => {
        const cookieName = c.split("=")[0].trim();
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=localhost`;
      });

      console.log("✅ Client-side storage cleared");

      // Now redirect to API route which will clear server-side cookies
      console.log("🔄 Redirecting to server-side logout...");
      window.location.href = "/api/auth/force-logout";
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mx-auto mb-4"></div>
        <h1 className="text-white text-2xl font-bold mb-2">
          Force Logging Out...
        </h1>
        <p className="text-gray-300">Clearing all authentication data...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait...</p>
      </div>
    </div>
  );
}
