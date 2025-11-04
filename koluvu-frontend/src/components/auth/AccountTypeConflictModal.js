"use client";

import React from "react";
import Link from "next/link";

const AccountTypeConflictModal = ({
  isOpen,
  onClose,
  errorMessage,
  existingUserType,
  attemptedUserType,
}) => {
  if (!isOpen) return null;

  const getCurrentLoginUrl = () => {
    return existingUserType === "employee"
      ? "/auth/login/employee"
      : "/auth/login/employer";
  };

  const getCorrectDashboardUrl = () => {
    return existingUserType === "employee"
      ? "/dashboard/employee"
      : "/dashboard/employer";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Account Type Mismatch
            </h3>
            <p className="text-sm text-gray-500">
              This account is already registered
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Your account is already registered as an{" "}
            <span className="font-semibold capitalize text-blue-600">
              {existingUserType}
            </span>
            . You cannot use the same Google account for multiple account types.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-900 mb-2">What you can do:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use the correct login page for your account type</li>
              <li>
                • Use a different Google account for {attemptedUserType}{" "}
                registration
              </li>
              <li>• Contact support if you need to change your account type</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={getCurrentLoginUrl()}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            onClick={onClose}
          >
            Login as{" "}
            {existingUserType.charAt(0).toUpperCase() +
              existingUserType.slice(1)}
          </Link>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Try Different Account
          </button>
        </div>

        {/* Help link */}
        <div className="mt-4 text-center">
          <Link
            href="/help/account-types"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Learn about account types
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeConflictModal;
