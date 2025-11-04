// src/components/Profile/CompanyProfileSection.js

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogoUpload } from "@/components/Upload/LogoUpload";
import { useLogoUpload } from "@/hooks/useLogoUpload";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export const CompanyProfileSection = ({
  employerProfile = null,
  onProfileUpdate,
}) => {
  const [currentLogo, setCurrentLogo] = useState(null);
  const { uploadLogo, deleteLogo, isUploading } = useLogoUpload();
  const { user } = useAuth();

  // Set current logo from profile
  useEffect(() => {
    if (employerProfile?.profile_picture_url) {
      setCurrentLogo(employerProfile.profile_picture_url);
    } else if (employerProfile?.company_logo) {
      setCurrentLogo(employerProfile.company_logo);
    } else if (user?.google_profile_picture) {
      setCurrentLogo(user.google_profile_picture);
    }
  }, [employerProfile, user]);

  // Handle logo upload
  const handleLogoUpload = async (file) => {
    try {
      const result = await uploadLogo(file);
      setCurrentLogo(result.logoUrl);

      if (onProfileUpdate) {
        onProfileUpdate({ profile_picture_url: result.logoUrl });
      }

      toast.success(result.message || "Logo uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(error.message || "Failed to upload logo. Please try again.");
      throw error; // Re-throw to let LogoUpload component handle it
    }
  };

  // Handle logo deletion
  const handleLogoDelete = async () => {
    try {
      const result = await deleteLogo();
      setCurrentLogo(null);

      if (onProfileUpdate) {
        onProfileUpdate({ profile_picture_url: null });
      }

      toast.success(result.message || "Logo deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete logo. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Company Logo
        </h3>
        <p className="text-sm text-gray-600">
          Upload your company logo to personalize your profile. This will be
          displayed on your job postings and company page.
        </p>
      </div>

      <LogoUpload
        currentLogo={currentLogo}
        onUpload={handleLogoUpload}
        onDelete={handleLogoDelete}
        isLoading={isUploading}
        className="max-w-lg"
      />

      {/* Additional Information */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Logo Guidelines
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use a square or circular logo for best results</li>
              <li>• Minimum recommended size: 200x200 pixels</li>
              <li>
                • Ensure your logo is clearly visible on both light and dark
                backgrounds
              </li>
              <li>
                • Avoid text-heavy logos that may be hard to read when scaled
                down
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
