// src/components/Header/EmployeeHeader.js
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import NotificationBell from "@/components/Notifications/NotificationBell";
import { DropdownLink, MobileNavLink } from "./HeaderComponents";
import styles from "../../styles/components/header/header.module.css";

export const EmployeeHeader = ({
  isDarkMode,
  toggleTheme,
  toggleSidebar,
  showSidebarToggle = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isJobSearchOpen, setIsJobSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [profileProgress, setProfileProgress] = useState(0);
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);
  const [savedJobsCount, setSavedJobsCount] = useState(0);

  const { user, logout, accessToken } = useAuth();
  const { profile: employeeProfile } = useEmployeeProfile();
  const profileRef = useRef(null);
  const jobSearchRef = useRef(null);

  // Get username for dynamic routing
  const username = user?.username || user?.email?.split("@")[0] || "default";

  // Get employee profile data
  const getEmployeeProfile = () => {
    const currentProfile = employeeProfile || user?.employee_profile;

    return {
      name:
        user?.first_name && user?.last_name
          ? `${user.first_name} ${user.last_name}`
          : user?.email?.split("@")[0] || "User",
      title: currentProfile?.job_title || "Job Seeker",
      avatar:
        currentProfile?.effective_profile_picture ||
        user?.google_profile_picture ||
        null,
      location: currentProfile?.location || "Remote",
      experience: currentProfile?.years_of_experience || "Fresher",
    };
  };

  const employeeData = getEmployeeProfile();

  // Calculate profile completion
  useEffect(() => {
    const calculateProgress = () => {
      if (!user) return 0;

      const fields = [
        user.first_name,
        user.last_name,
        user.email,
        employeeProfile?.job_title,
        employeeProfile?.skills,
        employeeProfile?.experience,
      ];

      const completedFields = fields.filter(
        (field) => field && field.length > 0
      ).length;
      let progress = Math.round((completedFields / fields.length) * 100);
      setProfileProgress(progress);
    };

    calculateProgress();
  }, [user, employeeProfile]);

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!accessToken) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employee/dashboard-stats/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAppliedJobsCount(data.applied_jobs_count || 0);
          setSavedJobsCount(data.saved_jobs_count || 0);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Mock data for development
        setAppliedJobsCount(Math.floor(Math.random() * 20) + 1);
        setSavedJobsCount(Math.floor(Math.random() * 15) + 1);
      }
    };

    if (user && accessToken) {
      fetchStats();
      const interval = setInterval(fetchStats, 300000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [user, accessToken]);

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
      if (
        jobSearchRef.current &&
        !jobSearchRef.current.contains(event.target)
      ) {
        setIsJobSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Enhanced Job Search Component
  const JobSearchComponent = () => (
    <div className="flex-1 max-w-2xl mx-6" ref={jobSearchRef}>
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={jobSearchQuery}
            onChange={(e) => setJobSearchQuery(e.target.value)}
            onFocus={() => setIsJobSearchOpen(true)}
            placeholder="🔍 Search your dream job, company, or skill..."
            className="w-full pl-12 pr-16 py-3 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-300 text-sm backdrop-blur-md"
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
            <button
              onClick={() => {
                if (jobSearchQuery.trim()) {
                  window.location.href = `/jobs?search=${encodeURIComponent(
                    jobSearchQuery
                  )}`;
                }
              }}
              className="bg-white text-orange-600 px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-105 border border-orange-200 hover:bg-orange-50"
            >
              Search
            </button>
          </div>
        </div>

        {/* Search Suggestions */}
        {isJobSearchOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  Quick Searches
                </h3>
                <button
                  onClick={() => setIsJobSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  "Frontend Developer",
                  "Backend Developer",
                  "Full Stack",
                  "React Developer",
                  "Python Developer",
                  "Data Scientist",
                  "UI/UX Designer",
                  "DevOps Engineer",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setJobSearchQuery(suggestion);
                      setIsJobSearchOpen(false);
                      window.location.href = `/jobs?search=${encodeURIComponent(
                        suggestion
                      )}`;
                    }}
                    className="text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 px-3 py-2 rounded-lg transition-all duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>💼 {appliedJobsCount} Applications</span>
                  <span>❤️ {savedJobsCount} Saved Jobs</span>
                  <span>📊 {profileProgress}% Profile Complete</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Quick Actions for Employee
  const QuickActions = () => (
    <div className="hidden lg:flex items-center space-x-3">
      <a
        href={`/dashboard/employee/${username}`}
        className="flex items-center space-x-2 bg-white text-orange-600 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg border border-orange-200 hover:bg-orange-50"
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
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
          />
        </svg>
        <span>Dashboard</span>
      </a>

      <a
        href="/jobs"
        className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/30"
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
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <span>Browse Jobs</span>
      </a>

      <a
        href="/resume-builder"
        className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/30"
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
        <span>Resume</span>
      </a>
    </div>
  );

  // Profile Progress Ring
  const ProfileProgressRing = ({ progress }) => {
    const circumference = 2 * Math.PI * 16; // radius = 16
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="16"
            strokeWidth="3"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-xs font-bold">{progress}%</span>
        </div>
      </div>
    );
  };

  // Employee Profile Menu
  const ProfileMenu = () => (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-xl p-2 border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 group min-w-0"
      >
        <div className="relative">
          {employeeData.avatar ? (
            <Image
              src={`${employeeData.avatar}?v=${
                employeeProfile?.updated_at || Date.now()
              }`}
              alt={employeeData.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-cover border border-white/30"
              priority
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border border-white/30">
              <span className="text-white font-bold text-base">
                {employeeData.name.charAt(0)}
              </span>
            </div>
          )}
          {profileProgress < 100 && (
            <div className="absolute -bottom-2 -right-2">
              <ProfileProgressRing progress={profileProgress} />
            </div>
          )}
        </div>

        <div className="hidden md:block text-left min-w-0">
          <div className="text-white font-semibold text-xs truncate max-w-[80px]">
            {employeeData.name}
          </div>
          <div className="text-white/70 text-[10px] truncate max-w-[80px]">
            {employeeData.title}
          </div>
        </div>

        <svg
          className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
            isProfileMenuOpen ? "rotate-180" : ""
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

      {/* Profile Menu Dropdown */}
      <div
        className={`absolute right-0 mt-2 w-80 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 ease-out backdrop-blur-sm ${
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
        <div className="py-3">
          {/* Profile Info */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {employeeData.avatar ? (
                  <img
                    src={`${employeeData.avatar}?v=${
                      employeeProfile?.updated_at || Date.now()
                    }`}
                    alt={employeeData.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">
                      {employeeData.name.charAt(0)}
                    </span>
                  </div>
                )}
                {profileProgress < 100 && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xs font-bold text-orange-600">
                      {profileProgress}%
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {employeeData.name}
                </h3>
                <p className="text-sm text-gray-600">{employeeData.title}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>📍 {employeeData.location}</span>
                  <span>💼 {employeeData.experience}</span>
                </div>
              </div>
            </div>

            {profileProgress < 100 && (
              <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-800">
                    Complete your profile
                  </span>
                  <span className="text-sm font-bold text-orange-600">
                    {profileProgress}%
                  </span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${profileProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-orange-700 mt-1">
                  Complete profiles get 3x more views!
                </p>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {appliedJobsCount}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Applied Jobs
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {savedJobsCount}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Saved Jobs
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <DropdownLink href={`/dashboard/employee/${username}?tab=profile`}>
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
                My Profile
              </span>
            </DropdownLink>

            <DropdownLink
              href={`/dashboard/employee/${username}?tab=applications`}
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                My Applications
                {appliedJobsCount > 0 && (
                  <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {appliedJobsCount}
                  </span>
                )}
              </span>
            </DropdownLink>

            <DropdownLink href={`/dashboard/employee/${username}/settings`}>
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

          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={async () => {
                setIsProfileMenuOpen(false);
                try {
                  await logout("/auth/login/employee");
                } catch (error) {
                  console.error("Logout error:", error);
                  window.location.href = "/auth/login/employee";
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

  // Match global header style
  const headerStyles = {
    background: isScrolled
      ? "linear-gradient(135deg, rgba(250, 127, 4, 0.95) 0%, rgba(230, 114, 10, 0.95) 100%)"
      : "linear-gradient(135deg, #fa7f04 0%, #e6720a 100%)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)", // thinner border
    boxShadow: isScrolled ? "0 6px 18px rgba(250, 127, 4, 0.18)" : "none",
    backdropFilter: isScrolled ? "blur(20px)" : "blur(10px)",
    WebkitBackdropFilter: isScrolled ? "blur(20px)" : "blur(10px)",
    minHeight: "56px", // slightly reduced height
    marginTop: 0, // remove any gap above
    paddingTop: 0,
  };

  const innerContainerStyles = {
    minHeight: "56px", // match header height
    paddingTop: 0,
    paddingBottom: 0,
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={headerStyles}
    >
      <nav className={styles.navWrapper}>
        <div className={styles.navInner} style={innerContainerStyles}>
          <div className={`${styles.logoContainer} gap-3`}>
            {showSidebarToggle && toggleSidebar && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden relative inline-flex items-center justify-center p-2.5 rounded-2xl text-white hover:bg-white/20 focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/20"
                style={{
                  background:
                    "linear-gradient(45deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15))",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.4)",
                }}
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

            <Link
              href={`/dashboard/employee/${username}`}
              className={styles.logoLink}
            >
              <Image
                src="/images/koluvu_logo.jpg"
                alt="Koluvu"
                width={32}
                height={32}
                className={styles.logoImage}
                priority
              />
              <span className={styles.logoText}>Koluvu</span>
            </Link>
          </div>

          <JobSearchComponent />

          <div className="flex items-center space-x-3">
            <QuickActions />
            <NotificationBell />
            <ProfileMenu />
          </div>
        </div>
      </nav>

      <div
        className={`lg:hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-hidden transition-all duration-500 ease-in-out backdrop-blur-sm ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100 border-t border-white/20"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-6 space-y-4">
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={jobSearchQuery}
                onChange={(e) => setJobSearchQuery(e.target.value)}
                placeholder="🔍 Search jobs, companies..."
                className="w-full pl-4 pr-20 py-3 rounded-2xl bg-white/30 border border-white/40 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md"
              />
              <button
                onClick={() => {
                  if (jobSearchQuery.trim()) {
                    window.location.href = `/jobs?search=${encodeURIComponent(
                      jobSearchQuery
                    )}`;
                  }
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-orange-600 px-4 py-1.5 rounded-xl text-sm font-medium border border-orange-200 hover:bg-orange-50"
              >
                Search
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center border border-white/30">
              <div className="text-xl font-bold text-white">
                {appliedJobsCount}
              </div>
              <div className="text-xs text-white/80">Applications</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center border border-white/30">
              <div className="text-xl font-bold text-white">
                {savedJobsCount}
              </div>
              <div className="text-xs text-white/80">Saved Jobs</div>
            </div>
          </div>

          <div className="space-y-2">
            <MobileNavLink
              href="/jobs"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Browse Jobs
              </span>
            </MobileNavLink>

            <MobileNavLink
              href={`/dashboard/employee/${username}?tab=applications`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3"
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
                My Applications
                {appliedJobsCount > 0 && (
                  <span className="ml-auto bg-white/30 text-white text-xs px-2 py-1 rounded-full">
                    {appliedJobsCount}
                  </span>
                )}
              </span>
            </MobileNavLink>

            <MobileNavLink
              href="/resume-builder"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3"
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
                Resume Builder
              </span>
            </MobileNavLink>
          </div>

          {profileProgress < 100 && (
            <div className="mt-6 p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  Complete Profile
                </span>
                <span className="text-sm font-bold text-white">
                  {profileProgress}%
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div
                  className="bg-orange-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profileProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-white/80 mt-1">
                Get 3x more job matches!
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
