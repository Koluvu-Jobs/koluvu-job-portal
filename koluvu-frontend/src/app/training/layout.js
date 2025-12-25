// src/app/training/layout.js
"use client";

import { useState } from "react";
import { TrainingHeader } from "@/components/Header/TrainingHeader";
import { TrainingFooter } from "@/components/Footer/TrainingFooter";
import { usePathname } from "next/navigation";

// Page title mapping
const pageTitles = {
  "/training/dashboard": "Dashboard",
  "/training/active-trainings": "Active Trainings",
  "/training/post-training": "Post Training",
  "/training/students": "Students",
  "/training/analytics": "Analytics",
  "/training/institute-profile": "Institute Profile",
  "/training/account-settings": "Account Settings",
  "/training/subscription": "Subscription & Billing",
  "/training/notifications": "Notifications",
};

export default function TrainingLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Get page title based on current route
  const pageTitle = pageTitles[pathname] || "Dashboard";

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <TrainingHeader
        pageTitle={pageTitle}
        toggleSidebar={handleToggleSidebar}
        showSidebarToggle={true}
        isSidebarOpen={sidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar (if you have one) */}
        {/* Uncomment and customize as needed
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto pt-20 lg:pt-4">
            <nav className="px-4 py-6">
              {/* Sidebar navigation items *}
            </nav>
          </div>
        </aside>
        */}

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full">
          {children}
        </main>
      </div>

      {/* Footer */}
      <TrainingFooter />
    </div>
  );
}
