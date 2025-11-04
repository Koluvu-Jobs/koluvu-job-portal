// src/components/Profile/ActivationControls.js

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export const ActivationControls = ({ employerProfile, onProfileUpdate }) => {
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const { user, userType, accessToken } = useAuth();
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Only show to employers
  if (userType !== "employer") {
    return null;
  }

  // Initialize activation status
  useEffect(() => {
    if (employerProfile?.is_active !== undefined) {
      setIsActive(employerProfile.is_active);
    }
  }, [employerProfile]);

  // Handle activation toggle
  const handleToggleActivation = (newStatus) => {
    setPendingAction(newStatus);
    setShowConfirmDialog(true);
  };

  // Confirm activation change
  const confirmActivationChange = async () => {
    if (!user || !accessToken || pendingAction === null) return;

    setIsLoading(true);
    setShowConfirmDialog(false);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/employer/profile/toggle-activation/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: pendingAction,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      setIsActive(pendingAction);

      // Update parent component
      if (onProfileUpdate) {
        onProfileUpdate({ is_active: pendingAction });
      }

      toast.success(
        pendingAction
          ? "Company activated successfully!"
          : "Company deactivated successfully!"
      );
    } catch (error) {
      console.error("Error toggling activation:", error);
      toast.error(
        error.message || "Failed to update activation status. Please try again."
      );
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  };

  // Cancel activation change
  const cancelActivationChange = () => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Company Status
            </h3>
            <p className="text-sm text-gray-600">
              Control your company's visibility and job posting capabilities
            </p>
          </div>

          {/* Status Badge */}
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isActive
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mr-2 ${
                isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {isActive ? "Active" : "Inactive"}
          </div>
        </div>

        {/* Current Status Info */}
        <div
          className={`p-4 rounded-lg mb-6 ${
            isActive
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-start">
            <svg
              className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${
                isActive ? "text-green-500" : "text-red-500"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isActive ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              )}
            </svg>
            <div>
              <h4
                className={`text-sm font-medium mb-1 ${
                  isActive ? "text-green-900" : "text-red-900"
                }`}
              >
                {isActive ? "Company is Active" : "Company is Inactive"}
              </h4>
              <div
                className={`text-sm ${
                  isActive ? "text-green-800" : "text-red-800"
                }`}
              >
                {isActive ? (
                  <ul className="space-y-1">
                    <li>• Your company profile is visible to job seekers</li>
                    <li>• You can post new job openings</li>
                    <li>• Existing job posts remain active</li>
                    <li>• Applications and messages are being received</li>
                  </ul>
                ) : (
                  <ul className="space-y-1">
                    <li>• Your company profile is hidden from job seekers</li>
                    <li>• You cannot post new job openings</li>
                    <li>• Existing job posts are hidden</li>
                    <li>• New applications are paused</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {isActive ? (
            <button
              onClick={() => handleToggleActivation(false)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Deactivate Company"
              )}
            </button>
          ) : (
            <button
              onClick={() => handleToggleActivation(true)}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Activate Company"
              )}
            </button>
          )}
        </div>

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
                Important Notes
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Only company owners/admins can change activation status
                </li>
                <li>• Deactivation takes effect immediately</li>
                <li>• You can reactivate your company at any time</li>
                <li>
                  • Your data and settings are preserved during deactivation
                </li>
                <li>• Pending applications and interviews remain accessible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      pendingAction
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {pendingAction ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      )}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {pendingAction
                        ? "Activate Company"
                        : "Deactivate Company"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      This action will affect your company's visibility
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  {pendingAction
                    ? "Are you sure you want to activate your company? This will make your profile and job postings visible to job seekers."
                    : "Are you sure you want to deactivate your company? This will hide your profile and job postings from job seekers."}
                </p>

                <div
                  className={`p-3 rounded-lg ${
                    pendingAction
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <h4
                    className={`text-sm font-medium mb-2 ${
                      pendingAction ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {pendingAction
                      ? "After activation:"
                      : "After deactivation:"}
                  </h4>
                  <ul
                    className={`text-sm space-y-1 ${
                      pendingAction ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {pendingAction ? (
                      <>
                        <li>• Company profile becomes visible</li>
                        <li>• Job postings go live</li>
                        <li>• New applications can be received</li>
                      </>
                    ) : (
                      <>
                        <li>• Company profile gets hidden</li>
                        <li>• Job postings become inactive</li>
                        <li>• New applications are paused</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-gray-50 flex space-x-3">
                <button
                  onClick={cancelActivationChange}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmActivationChange}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    pendingAction
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {pendingAction ? "Activate" : "Deactivate"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
