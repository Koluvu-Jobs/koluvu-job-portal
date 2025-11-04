// src/app/dashboard/employee/components/user-dropdown.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function UserDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleNavigation = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login/employee");
    } catch (error) {
      console.error("Logout failed:", error);
      // Force redirect even if logout fails
      localStorage.clear();
      sessionStorage.clear();
      router.push("/auth/login/employee");
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <span className="hidden md:inline font-medium">{user.name}</span>
        <svg
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <button
            onClick={() => handleNavigation("/main/profile")}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            My Profile
          </button>
          <button
            onClick={() => handleNavigation("/main/resume-builder")}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            My Resume
          </button>
          <button
            onClick={() => handleNavigation("/main/settings")}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Account Settings
          </button>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left border-t border-gray-200"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
