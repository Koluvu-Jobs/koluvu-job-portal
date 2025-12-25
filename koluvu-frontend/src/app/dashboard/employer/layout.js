// src/app/dashboard/employer/layout.js
"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Chatbot from "./components/Chatbot";
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployerProfile } from "@/hooks/useEmployerProfile";

export default function EmployerLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const { profile: employerProfile } = useEmployerProfile();

  useEffect(() => {
    setMounted(true);
    // Update active tab based on current route and search params
    const path = pathname.split("/").pop();
    const tab = searchParams.get("tab");

    // Priority: search param tab > direct routes > default dashboard
    if (tab) {
      // Handle all possible tab values from search params
      setActiveTab(tab);
    } else {
      // Handle direct routes (not using ?tab=)
      const directRoutes = {
        "post-jobs": "post-jobs",
        "active-jobs": "active-jobs", 
        "expired-jobs": "expired-jobs",
        "closed-jobs": "closed-jobs",
        "boolean-search": "boolean-search",
        "ats": "ats",
        "interview-scheduler": "interview-scheduler",
        "proxying-detector": "proxying-detector",
        "feedback-form": "feedback-form",
        "candidate-status": "candidate-status",
        "subscription-plans": "subscription-plans",
        "help-center": "help-center",
        "settings": "settings",
        "applications": "applications",
        "profile": "profile",
        "company": "company",
        "subscription": "subscription"
      };
      
      setActiveTab(directRoutes[path] || "dashboard");
    }
  }, [pathname, searchParams]);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Create user profile object from auth data and employer profile
  const getUserProfile = () => {
    if (!user) {
      return {
        name: "Employer",
        role: "Koluvu HR Solutions",
        avatar: null,
      };
    }

    // Use employer profile data from the auth response first, then fetched profile
    const authEmployerProfile = user.employer_profile;
    const currentProfile = employerProfile || authEmployerProfile;

    const name =
      currentProfile?.company_name ||
      (user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.email?.split("@")[0] || "Employer");

    const role = currentProfile?.industry_type || "Koluvu HR Solutions";

    const avatar =
      currentProfile?.profile_picture_url ||
      user.google_profile_picture ||
      null;

    console.log("User profile data:", {
      user,
      authEmployerProfile,
      employerProfile,
      result: { name, role, avatar },
    });

    return { name, role, avatar };
  };

  return (
    <ThemeProvider>
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          isDarkMode
            ? "dark bg-gray-900"
            : "bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20"
        }`}
      >
        <Header
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          toggleSidebar={toggleSidebar}
          showSidebarToggle={true}
        />
        <div className="flex flex-1">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            userProfile={getUserProfile()}
          />
          <main className="flex-1 overflow-auto">
            <div className="min-h-full bg-white/50 backdrop-blur-sm p-2 sm:p-4 lg:p-6">
              <div className="max-w-full mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
        <Footer />
        <Chatbot />
      </div>
    </ThemeProvider>
  );
}
