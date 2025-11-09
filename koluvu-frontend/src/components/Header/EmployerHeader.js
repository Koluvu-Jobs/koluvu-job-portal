// src/components/Header/EmployerHeader.js
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployerProfile } from "@/hooks/useEmployerProfile";
import { NotificationDropdown } from "@/components/Notifications/NotificationDropdown";
import NotificationBell from "@/components/Notifications/NotificationBell";
import {
  DropdownLink,
  MobileNavLink,
  MobileAuthButton,
} from "./HeaderComponents";

export const EmployerHeader = ({
  isDarkMode,
  toggleTheme,
  toggleSidebar,
  showSidebarToggle = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState({
    activeJobs: 0,
    pendingApplications: 0,
    newMessages: 0,
    todayViews: 0,
  });

  const { user, logout, accessToken } = useAuth();
  const { profile: employerProfile } = useEmployerProfile();
  const profileRef = useRef(null);
  const companyRef = useRef(null);

  // Get current user's username for navigation
  const getCurrentUsername = () => {
    if (user?.username) return user.username;
    if (user?.email) return user.email.split("@")[0];
    return "profile"; // fallback
  };

  // Get company profile data
  const getCompanyProfile = () => {
    const authEmployerProfile = user?.employer_profile;
    const currentProfile = employerProfile || authEmployerProfile;

    return {
      name: currentProfile?.company_name || "Your Company",
      industry: currentProfile?.industry_type || "Industry",
      logo:
        currentProfile?.company_logo_display ||
        currentProfile?.company_logo ||
        null,
      size: currentProfile?.company_size || "Growing",
      location: currentProfile?.company_location || "Global",
    };
  };

  const companyProfile = getCompanyProfile();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target)) {
        setIsCompanyMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch real-time stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!accessToken) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employer/dashboard-stats/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRealTimeStats({
            activeJobs: data.active_jobs_count || 0,
            pendingApplications: data.pending_applications_count || 0,
            newMessages: data.unread_messages_count || 0,
            todayViews: data.today_views_count || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Mock data for development
        setRealTimeStats({
          activeJobs: Math.floor(Math.random() * 20) + 1,
          pendingApplications: Math.floor(Math.random() * 50) + 1,
          newMessages: Math.floor(Math.random() * 10),
          todayViews: Math.floor(Math.random() * 100) + 50,
        });
      }
    };

    if (user && accessToken) {
      fetchStats();
      const interval = setInterval(fetchStats, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [user, accessToken]);

  // Professional Quick Actions Component
  const QuickActions = () => (
    <div className="hidden xl:flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
      <button
        onClick={() =>
          (window.location.href = "/dashboard/employer/jobs/create")
        }
        className="flex items-center space-x-2 text-white hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 group"
      >
        <svg
          className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span className="font-medium">Post Job</span>
      </button>

      <div className="w-px h-6 bg-white/30"></div>

      <button
        onClick={() =>
          (window.location.href = "/dashboard/employer/applications")
        }
        className="flex items-center space-x-2 text-white hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 group"
      >
        <svg
          className="w-5 h-5 group-hover:bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="font-medium">Review Applications</span>
        {realTimeStats.pendingApplications > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            {realTimeStats.pendingApplications}
          </span>
        )}
      </button>
    </div>
  );

  // Real-time Stats Display
  const RealTimeStats = () => (
    <div className="hidden lg:flex items-center space-x-6 text-white/90">
      <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">
          {realTimeStats.activeJobs} Active Jobs
        </span>
      </div>

      <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">
          {realTimeStats.todayViews} Views Today
        </span>
      </div>
    </div>
  );

  // Company Profile Menu
  const CompanyMenu = () => (
    <div className="relative" ref={companyRef}>
      <button
        onClick={() => setIsCompanyMenuOpen(!isCompanyMenuOpen)}
        className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl p-1.5 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
      >
        <div className="relative">
          {companyProfile.logo ? (
            <img
              src={`${
                process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
              }${companyProfile.logo}?v=${
                employerProfile?.updated_at || Date.now()
              }`}
              alt={companyProfile.name}
              className="w-8 h-8 rounded-xl object-cover border-2 border-white/30"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center border-2 border-white/30">
              <span className="text-white font-bold text-sm">
                {companyProfile.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        </div>

        <div className="hidden lg:block text-left min-w-0">
          <div className="text-white font-medium text-xs truncate max-w-20 xl:max-w-28">
            {companyProfile.name}
          </div>
          <div className="text-white/70 text-[10px] truncate max-w-20 xl:max-w-28">
            {companyProfile.industry}
          </div>
        </div>

        <svg
          className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 ${
            isCompanyMenuOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Company Menu Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-72 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 ease-out backdrop-blur-sm ${
          isCompanyMenuOpen
            ? "scale-100 opacity-100 transform translate-y-0"
            : "scale-95 opacity-0 pointer-events-none transform -translate-y-2"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="py-3">
          {/* Company Info */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              {companyProfile.logo ? (
                <img
                  src={`${
                    process.env.NEXT_PUBLIC_BACKEND_URL ||
                    "http://127.0.0.1:8000"
                  }${companyProfile.logo}?v=${
                    employerProfile?.updated_at || Date.now()
                  }`}
                  alt={companyProfile.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {companyProfile.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {companyProfile.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {companyProfile.industry}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>📍 {companyProfile.location}</span>
                  <span>👥 {companyProfile.size}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {realTimeStats.activeJobs}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Active Jobs
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {realTimeStats.todayViews}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Today's Views
                </div>
              </div>
            </div>
          </div>

          {/* Company Menu Items */}
          <div className="py-2">
            <DropdownLink
              href={`/dashboard/employer/${getCurrentUsername()}/profile`}
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Company Profile
              </span>
            </DropdownLink>

            <DropdownLink
              href={`/dashboard/employer/${getCurrentUsername()}?tab=analytics`}
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Analytics & Reports
              </span>
            </DropdownLink>

            <DropdownLink
              href={`/dashboard/employer/${getCurrentUsername()}?tab=settings`}
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </span>
            </DropdownLink>
          </div>
        </div>
      </div>
    </div>
  );

  // Personal Profile Menu
  const ProfileMenu = () => (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-xl p-1.5 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
      >
        <img
          src={
            employerProfile?.profile_picture_url
              ? `${
                  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
                }${employerProfile.profile_picture_url}?v=${
                  employerProfile.updated_at || Date.now()
                }`
              : user?.profile_picture
              ? `${
                  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
                }${user.profile_picture}?v=${
                  employerProfile?.updated_at || Date.now()
                }`
              : user?.google_profile_picture || "/images/default-avatar.png"
          }
          alt="Profile"
          className="w-8 h-8 rounded-xl border-2 border-white/30 object-cover"
        />
        <div className="hidden md:block text-left">
          <div className="text-white font-medium text-xs truncate max-w-28">
            {user?.first_name || user?.email?.split("@")[0] || "User"}
          </div>
          <div className="text-white/70 text-[10px]">Administrator</div>
        </div>
        <svg
          className="w-3.5 h-3.5 text-white/70 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 ease-out backdrop-blur-sm ${
          isProfileMenuOpen
            ? "scale-100 opacity-100 transform translate-y-0"
            : "scale-95 opacity-0 pointer-events-none transform -translate-y-2"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="py-2">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <p className="text-xs text-orange-600 font-medium">
              Employer Admin
            </p>
          </div>

          <DropdownLink
            href={`/dashboard/employer/${getCurrentUsername()}/profile`}
          >
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Personal Profile
            </span>
          </DropdownLink>

          <DropdownLink
            href={`/dashboard/employer/${getCurrentUsername()}?tab=settings`}
          >
            <span className="flex items-center">
              <svg
                className="w-4 h-4 mr-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Account Settings
            </span>
          </DropdownLink>

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={async () => {
                setIsProfileMenuOpen(false);
                try {
                  await logout("/auth/login/employer");
                } catch (error) {
                  console.error("Logout error:", error);
                  window.location.href = "/auth/login/employer";
                }
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const headerStyles = {
    background: isScrolled
      ? "linear-gradient(135deg, rgba(250,127,4,0.95) 0%, rgba(230,114,10,0.95) 100%)"
      : "linear-gradient(135deg, #fa7f04 0%, #e6720a 100%)",
    borderBottom: "none",
    boxShadow: "none",
    backdropFilter: isScrolled ? "blur(20px)" : "blur(10px)",
    WebkitBackdropFilter: isScrolled ? "blur(20px)" : "blur(10px)",
    height: "64px",
    marginBottom: 0,
  };

  const innerStyles = {
    height: "64px",
    display: "flex",
    alignItems: "center",
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={headerStyles}
    >
      <div
        className="max-w-[1400px] mx-auto px-2 sm:px-4 h-full"
        style={innerStyles}
      >
        <div className="flex items-center h-full w-full">
          {/* Left Section - Logo & Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            {/* Mobile Menu Toggle Button */}
            {showSidebarToggle && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all flex-shrink-0"
                aria-label="Toggle menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            {/* Logo */}
            <Link
              href={`/dashboard/employer/${getCurrentUsername()}`}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <Image
                src="/images/koluvu_logo.jpg"
                alt="Koluvu"
                width={32}
                height={32}
                className="rounded-lg object-cover"
                priority
              />
              <div className="hidden sm:block">
                <div className="text-white font-bold text-base sm:text-lg">
                  Koluvu
                </div>
              </div>
            </Link>
          </div>

          {/* Right Section - Stats, Actions, Notifications & Profile */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Stats - Moved to right side */}
            <div className="hidden lg:flex items-center gap-2 mr-3">
              <div className="flex items-center gap-1 text-xs xl:text-sm">
                <span className="flex items-center gap-1 text-white/90">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>{realTimeStats.activeJobs} Active</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs xl:text-sm">
                <span className="flex items-center gap-1 text-white/90">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>{realTimeStats.todayViews} Views</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-2 md:gap-3 mr-2">
              <Link
                href={`/dashboard/employer/${getCurrentUsername()}`}
                className="bg-white/20 hover:bg-white/30 px-2 sm:px-3 lg:px-4 py-2 rounded-lg transition-all flex items-center gap-1 sm:gap-2 font-medium text-white text-xs sm:text-sm lg:text-base"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0V11a1 1 0 011-1h2a1 1 0 011 1v10m3 0a1 1 0 001-1V10M9 21h6"
                  />
                </svg>
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <Link
                href={`/dashboard/employer/${getCurrentUsername()}?tab=post-jobs`}
                className="bg-white/20 hover:bg-white/30 px-2 sm:px-3 lg:px-4 py-2 rounded-lg transition-all flex items-center gap-1 sm:gap-2 font-medium text-white text-xs sm:text-sm lg:text-base"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden md:inline">Post Job</span>
              </Link>
              <Link
                href={`/dashboard/employer/${getCurrentUsername()}?tab=applications`}
                className="bg-white/20 hover:bg-white/30 px-2 sm:px-3 lg:px-4 py-2 rounded-lg transition-all flex items-center gap-1 sm:gap-2 font-medium text-white text-xs sm:text-sm lg:text-base relative"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="hidden md:inline">Review</span>
                {realTimeStats.pendingApplications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {realTimeStats.pendingApplications}
                  </span>
                )}
              </Link>
            </div>

            {/* Profile & Notifications */}
            <NotificationBell />
            <CompanyMenu />
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};
