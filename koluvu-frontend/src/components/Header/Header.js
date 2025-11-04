// src/components/Header/Header.js
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { EmployerHeader } from "./EmployerHeader";
import { EmployeeHeader } from "./EmployeeHeader";
import { RoleBasedHeader } from "./RoleBasedHeader";

export default function Header({
  isDarkMode,
  toggleTheme,
  toggleSidebar,
  showSidebarToggle = false,
}) {
  const { user, userType } = useAuth();

  // Use role-specific headers for authenticated users
  if (user && userType === "employer") {
    return (
      <EmployerHeader
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
        showSidebarToggle={showSidebarToggle}
      />
    );
  }

  if (user && userType === "employee") {
    return (
      <EmployeeHeader
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
        showSidebarToggle={showSidebarToggle}
      />
    );
  }

  // Fallback to original header for guests or unknown user types
  return (
    <RoleBasedHeader
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      toggleSidebar={toggleSidebar}
      showSidebarToggle={showSidebarToggle}
    />
  );
}
