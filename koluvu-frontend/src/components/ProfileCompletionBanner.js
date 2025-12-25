// src/components/ProfileCompletionBanner.js
"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function ProfileCompletionBanner({ user }) {
  // Only show if user doesn't have an employer profile
  if (user?.employer_profile) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-900 font-semibold text-sm sm:text-base">
              Complete Your Company Profile
            </h3>
            <p className="text-amber-800 text-sm mt-1">
              You haven't completed your company profile yet. Complete it now to
              unlock all features.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/employer/setup-profile"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm"
        >
          Complete Profile
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
