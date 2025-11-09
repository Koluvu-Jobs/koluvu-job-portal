// src/app/dashboard/employee/layout.js
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/sidebar";
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";

export default function EmployeeLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // Update active tab based on current route
    const path = pathname.split("/").pop();
    if (path) {
      setActiveTab(path === "employee" ? "dashboard" : path);
    }
  }, [pathname]);

  useEffect(() => {
    const previousPaddingTop = document.body.style.paddingTop;
    document.body.style.paddingTop = "0px";

    return () => {
      document.body.style.paddingTop = previousPaddingTop;
    };
  }, []);

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

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
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
        />
        <main
          className="flex-1 p-2 sm:p-4 lg:p-6 overflow-auto"
          style={{ marginTop: "var(--header-height)" }}
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
