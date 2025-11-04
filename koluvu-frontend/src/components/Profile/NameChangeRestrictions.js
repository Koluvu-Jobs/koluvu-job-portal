// src/components/Profile/NameChangeRestrictions.js

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export const NameChangeRestrictions = ({
  employerProfile,
  onProfileUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    employer_name: "",
    company_name: "",
  });
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [canChangeName, setCanChangeName] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { user, accessToken } = useAuth();
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Initialize form data
  useEffect(() => {
    if (employerProfile) {
      setFormData({
        employer_name: employerProfile.employer_name || "",
        company_name: employerProfile.company_name || "",
      });
    }
  }, [employerProfile]);

  // Calculate time remaining until next name change is allowed
  const calculateTimeRemaining = useCallback(() => {
    if (!employerProfile?.last_name_change) {
      setCanChangeName(true);
      setTimeRemaining(null);
      return;
    }

    const lastChangeDate = new Date(employerProfile.last_name_change);
    const nextAllowedDate = new Date(
      lastChangeDate.getTime() + 30 * 24 * 60 * 60 * 1000
    ); // 30 days
    const now = new Date();

    if (now >= nextAllowedDate) {
      setCanChangeName(true);
      setTimeRemaining(null);
    } else {
      setCanChangeName(false);
      const diffTime = nextAllowedDate - now;
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining({ days, hours, minutes });
    }
  }, [employerProfile?.last_name_change]);

  // Update countdown every minute
  useEffect(() => {
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [calculateTimeRemaining]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.employer_name.trim()) {
      newErrors.employer_name = "Employer name is required";
    } else if (formData.employer_name.trim().length < 2) {
      newErrors.employer_name = "Employer name must be at least 2 characters";
    }

    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company name is required";
    } else if (formData.company_name.trim().length < 2) {
      newErrors.company_name = "Company name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canChangeName) {
      toast.error("You can only change names once every 30 days");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/employer/profile/update-names/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employer_name: formData.employer_name.trim(),
            company_name: formData.company_name.trim(),
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

      // Update parent component
      if (onProfileUpdate) {
        onProfileUpdate({
          employer_name: formData.employer_name.trim(),
          company_name: formData.company_name.trim(),
          last_name_change: new Date().toISOString(),
        });
      }

      setIsEditing(false);
      toast.success("Names updated successfully!");

      // Recalculate restrictions
      setTimeout(calculateTimeRemaining, 100);
    } catch (error) {
      console.error("Error updating names:", error);
      toast.error(error.message || "Failed to update names. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      employer_name: employerProfile?.employer_name || "",
      company_name: employerProfile?.company_name || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Name Information
          </h3>
          <p className="text-sm text-gray-600">
            Manage your employer and company names
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            disabled={!canChangeName}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              canChangeName
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Edit Names
          </button>
        )}
      </div>

      {/* Restriction Warning */}
      <AnimatePresence>
        {!canChangeName && timeRemaining && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-amber-900 mb-1">
                  Name Change Restriction Active
                </h4>
                <p className="text-sm text-amber-800 mb-2">
                  You can change your names again in:
                </p>
                <div className="flex items-center space-x-4 text-sm font-medium text-amber-900">
                  <div className="flex items-center space-x-1">
                    <span className="text-xl">{timeRemaining.days}</span>
                    <span>days</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xl">{timeRemaining.hours}</span>
                    <span>hours</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xl">{timeRemaining.minutes}</span>
                    <span>minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Employer Name */}
          <div>
            <label
              htmlFor="employer_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Employer Name
            </label>
            <input
              type="text"
              id="employer_name"
              name="employer_name"
              value={formData.employer_name}
              onChange={handleInputChange}
              disabled={!isEditing || !canChangeName}
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                errors.employer_name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              } ${
                !isEditing || !canChangeName
                  ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-900 focus:ring-2"
              }`}
              placeholder="Enter employer name"
            />
            <AnimatePresence>
              {errors.employer_name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.employer_name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Company Name */}
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Company Name
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              disabled={!isEditing || !canChangeName}
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                errors.company_name
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
              } ${
                !isEditing || !canChangeName
                  ? "bg-gray-50 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-900 focus:ring-2"
              }`}
              placeholder="Enter company name"
            />
            <AnimatePresence>
              {errors.company_name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {errors.company_name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex space-x-3 pt-4 border-t border-gray-200"
              >
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !canChangeName}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    canChangeName && !isLoading
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Updating...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Information Note */}
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
              Name Change Policy
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Names can only be changed once every 30 days</li>
              <li>
                • Both employer and company names must be updated together
              </li>
              <li>• Changes are reflected immediately across your profile</li>
              <li>
                • Historical data and job postings will retain the previous
                names
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
