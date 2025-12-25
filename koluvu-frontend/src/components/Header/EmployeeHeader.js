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
  isSidebarOpen = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isJobSearchOpen, setIsJobSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [jobSearchQuery, setJobSearchQuery] = useState("");
  const [profileProgress, setProfileProgress] = useState(0);
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInProgress, setSearchInProgress] = useState(false);

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
    <div className="w-full" ref={jobSearchRef}>
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 lg:h-5 lg:w-5 text-white/70"
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
            placeholder="Search jobs, companies..."
            className="w-full pl-10 lg:pl-12 pr-14 lg:pr-16 py-2 lg:py-3 rounded-xl lg:rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-300 text-sm backdrop-blur-md"
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          />
          <div className="absolute inset-y-0 right-0 pr-2 lg:pr-3 flex items-center">
            <button
              onClick={() => {
                if (jobSearchQuery.trim()) {
                  window.location.href = `/jobs?search=${encodeURIComponent(
                    jobSearchQuery
                  )}`;
                }
              }}
              className="bg-white text-orange-600 px-2 lg:px-4 py-1 lg:py-1.5 rounded-lg lg:rounded-xl text-xs font-medium transition-all duration-200 hover:scale-105 border border-orange-200 hover:bg-orange-50"
            >
              <span className="hidden lg:inline">Search</span>
              <svg
                className="w-4 h-4 lg:hidden"
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
    <div className="hidden xl:flex items-center space-x-2">
      <a
        href={`/dashboard/employee/${username}`}
        className="flex items-center space-x-1 lg:space-x-2 bg-white text-orange-600 px-2 lg:px-4 py-2 rounded-lg lg:rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg border border-orange-200 hover:bg-orange-50 text-xs lg:text-sm"
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
        <span className="hidden lg:inline">Dashboard</span>
      </a>

      <a
        href="/jobs"
        className="flex items-center space-x-1 lg:space-x-2 bg-white/20 hover:bg-white/30 text-white px-2 lg:px-4 py-2 rounded-lg lg:rounded-xl font-medium transition-all duration-300 hover:scale-105 backdrop-blur-md border border-white/30 text-xs lg:text-sm"
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
        <span className="hidden lg:inline">Jobs</span>
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
        onClick={() => {
          // If opening the profile menu on small screens and the sidebar is open, close the sidebar first
          const isOpening = !isProfileMenuOpen;
          if (
            isOpening &&
            typeof window !== "undefined" &&
            window.innerWidth < 1024
          ) {
            if (isSidebarOpen && typeof toggleSidebar === "function") {
              try {
                toggleSidebar();
              } catch (e) {
                // ignore
              }
            }
          }
          setIsProfileMenuOpen(!isProfileMenuOpen);
        }}
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

        <div className="hidden lg:block text-left min-w-0">
          <div className="text-white font-semibold text-xs truncate max-w-[60px] xl:max-w-[80px]">
            {employeeData.name}
          </div>
          <div className="text-white/70 text-[10px] truncate max-w-[60px] xl:max-w-[80px]">
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
        className={`fixed sm:absolute right-0 sm:mt-2 w-full sm:w-80 origin-top rounded-none sm:rounded-2xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 ease-out backdrop-blur-sm ${
          isProfileMenuOpen
            ? "scale-100 opacity-100 transform translate-y-0 top-[64px] sm:top-auto"
            : "scale-95 opacity-0 pointer-events-none transform -translate-y-2 top-[64px] sm:top-auto"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          maxHeight: isProfileMenuOpen ? "calc(100vh - 64px)" : "0px",
          overflowY: "auto",
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
              <button
                onClick={() => {
                  const username =
                    user?.username || user?.email?.split("@")[0] || "profile";
                  window.location.href = `/dashboard/employee/${username}?tab=profile&highlight=missing`;
                }}
                className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer w-full text-left"
              >
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
                  Complete profiles get 3x more views! Click to fix missing
                  details.
                </p>
              </button>
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
            {/* Quick Actions Section - Visible on Mobile */}
            <div className="px-4 py-3 mb-2 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl md:hidden">
              <h4 className="text-xs font-semibold text-orange-800 mb-3 uppercase tracking-wider flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <DropdownLink
                  href={`/dashboard/employee/${username}`}
                  className="!p-0 group"
                >
                  <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-orange-100 hover:bg-orange-50 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md">
                    <svg
                      className="w-6 h-6 text-orange-600 mb-1.5 transform transition-transform group-hover:scale-110"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <span className="text-xs font-medium text-orange-900">
                      Dashboard
                    </span>
                  </div>
                </DropdownLink>

                <DropdownLink href="/jobs" className="!p-0">
                  <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                    <svg
                      className="w-5 h-5 text-orange-600 mb-1"
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
                    <span className="text-xs font-medium text-orange-900">
                      Browse Jobs
                    </span>
                  </div>
                </DropdownLink>

                <DropdownLink href="/resume-builder" className="!p-0">
                  <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                    <svg
                      className="w-5 h-5 text-orange-600 mb-1"
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
                    <span className="text-xs font-medium text-orange-900">
                      Resume
                    </span>
                  </div>
                </DropdownLink>

                <DropdownLink href="/search" className="!p-0">
                  <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-orange-100 hover:bg-orange-50 transition-all duration-200">
                    <svg
                      className="w-5 h-5 text-orange-600 mb-1"
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
                    <span className="text-xs font-medium text-orange-900">
                      Search
                    </span>
                  </div>
                </DropdownLink>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-2">
              <DropdownLink
                href={`/dashboard/employee/${username}?tab=profile`}
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
          </div>

          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={async () => {
                setIsProfileMenuOpen(false);
                try {
                  await logout("/");
                } catch (error) {
                  console.error("Logout error:", error);
                  window.location.href = "/";
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
    borderBottom: "none",
    boxShadow: "none",
    backdropFilter: isScrolled ? "blur(20px)" : "blur(10px)",
    WebkitBackdropFilter: isScrolled ? "blur(20px)" : "blur(10px)",
    height: "64px",
  };

  const innerContainerStyles = {
    height: "64px",
    display: "flex",
    alignItems: "center",
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={headerStyles}
    >
      <nav className="w-full">
        <div
          className="max-w-[1400px] mx-auto px-2 sm:px-4 flex items-center justify-between"
          style={innerContainerStyles}
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {showSidebarToggle && toggleSidebar && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden relative inline-flex items-center justify-center p-2 rounded-xl text-white hover:bg-white/20 focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/20"
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
              <span className="hidden sm:block text-white font-bold text-base lg:text-lg">
                Koluvu
              </span>
            </Link>
          </div>

          <div className="hidden md:block flex-1 max-w-md lg:max-w-2xl mx-4">
            <JobSearchComponent />
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <QuickActions />
            <NotificationBell />
            <ProfileMenu />
          </div>
        </div>
      </nav>

      <div
        className={`lg:hidden fixed inset-x-0 top-[64px] bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-hidden transition-all duration-500 ease-in-out backdrop-blur-sm shadow-xl z-40 ${
          isMobileMenuOpen
            ? "max-h-[calc(100vh-64px)] opacity-100 border-t border-white/20"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-4 space-y-4 overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={jobSearchQuery}
                onChange={(e) => setJobSearchQuery(e.target.value)}
                placeholder="🔍 Search jobs, companies..."
                className="w-full pl-4 pr-24 py-3.5 rounded-2xl bg-white/30 border border-white/40 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md text-base"
              />
              <button
                onClick={() => {
                  if (jobSearchQuery.trim()) {
                    window.location.href = `/jobs?search=${encodeURIComponent(
                      jobSearchQuery
                    )}`;
                  }
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-orange-600 px-4 py-2 rounded-xl text-sm font-medium border border-orange-200 hover:bg-orange-50 transition-all duration-200 active:scale-95 shadow-md"
              >
                Search
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div
              onClick={() =>
                (window.location.href = `/dashboard/employee/${username}?tab=applications`)
              }
              className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center border border-white/30 cursor-pointer hover:bg-white/30 transition-all duration-200 active:scale-95"
            >
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {appliedJobsCount}
                </div>
                <div className="text-xs text-white/90 font-medium flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Applications
                </div>
              </div>
            </div>
            <div
              onClick={() =>
                (window.location.href = `/dashboard/employee/${username}?tab=saved`)
              }
              className="bg-white/20 backdrop-blur-md rounded-xl p-4 text-center border border-white/30 cursor-pointer hover:bg-white/30 transition-all duration-200 active:scale-95"
            >
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {savedJobsCount}
                </div>
                <div className="text-xs text-white/90 font-medium flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Saved Jobs
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar for Mobile */}
          <div className="relative mb-6">
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && jobSearchQuery.trim()) {
                  window.location.href = `/jobs?search=${encodeURIComponent(
                    jobSearchQuery
                  )}`;
                  setIsMobileMenuOpen(false);
                }
              }}
              placeholder="Search jobs, companies..."
              className="w-full pl-12 pr-24 py-3.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-md text-base"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <button
                onClick={async () => {
                  if (jobSearchQuery.trim()) {
                    try {
                      setSearchInProgress(true);
                      setIsMobileMenuOpen(false);
                      await new Promise((resolve) => setTimeout(resolve, 300)); // Smooth transition
                      window.location.href = `/jobs?search=${encodeURIComponent(
                        jobSearchQuery
                      )}`;
                    } catch (error) {
                      console.error("Search error:", error);
                    } finally {
                      setSearchInProgress(false);
                    }
                  }
                }}
                disabled={searchInProgress || !jobSearchQuery.trim()}
                className={`bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 flex items-center ${
                  !jobSearchQuery.trim() || searchInProgress
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-orange-50"
                }`}
              >
                {searchInProgress ? (
                  <svg
                    className="animate-spin h-4 w-4 text-orange-600"
                    xmlns="http://www.w3.org/2000/svg"
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
                ) : (
                  <>
                    <span>Search</span>
                    <svg
                      className="w-4 h-4 ml-1 transition-transform duration-200 transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {profileProgress < 100 && (
            <button
              onClick={() => {
                const username =
                  user?.username || user?.email?.split("@")[0] || "profile";
                window.location.href = `/dashboard/employee/${username}?tab=profile&highlight=missing`;
              }}
              className="mb-6 p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 hover:bg-white/30 transition-colors cursor-pointer w-full text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  Profile Status
                </span>
                <span className="text-sm font-bold text-white">
                  {profileProgress}%
                </span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profileProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-white/90 mt-2">
                Complete your profile to get better job matches! Click to fix
                missing details.
              </p>
            </button>
          )}

          {profileProgress < 100 && (
            <button
              onClick={() => {
                const username =
                  user?.username || user?.email?.split("@")[0] || "profile";
                window.location.href = `/dashboard/employee/${username}?tab=profile&highlight=missing`;
              }}
              className="mt-6 p-4 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 hover:bg-white/30 transition-colors cursor-pointer w-full text-left"
            >
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
                Get 3x more job matches! Click to complete.
              </p>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
