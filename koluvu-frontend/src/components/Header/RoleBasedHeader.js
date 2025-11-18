// src/components/Header/RoleBasedHeader.js

"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { HeaderStatic } from "./HeaderStatic";
import { NotificationDropdown } from "@/components/Notifications/NotificationDropdown";
import NotificationBell from "@/components/Notifications/NotificationBell";
import {
  DropdownLink,
  MobileNavLink,
  MobileAuthButton,
  MobileDropdownLink,
} from "./HeaderComponents";
import styles from "../../styles/components/header/header.module.css";

export const RoleBasedHeader = ({
  isDarkMode,
  toggleTheme,
  toggleSidebar,
  showSidebarToggle = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isKoluvuLabsOpen, setIsKoluvuLabsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const { user, userType, logout, accessToken } = useAuth();
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const inboxRef = useRef(null);

  // Get username for URL routing
  const getUsername = () => {
    // For employees, use public_identifier (KJS-) if available, else fallback to username
    if (userType === "employee" && user?.public_identifier) {
      return user.public_identifier;
    }
    if (user?.username) return user.username;
    if (user?.email) return user.email.split("@")[0];
    return "user";
  };

  // Handle window resize and close mobile menu when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);

      // Close mobile menu when switching to desktop view (lg breakpoint is 1024px)
      if (newWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    // Set initial width
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsKoluvuLabsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (inboxRef.current && !inboxRef.current.contains(event.target)) {
        setIsInboxOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsKoluvuLabsOpen(false);
        setIsProfileMenuOpen(false);
        setIsInboxOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // Get role-specific navigation items
  const getRoleSpecificNavItems = () => {
    // If user is not logged in, return common items only
    if (!user) {
      return [
        {
          href: "/",
          label: "Home",
          icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        },
        {
          href: "/jobs",
          label: "Jobs",
          icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
        },
        {
          href: "/companies",
          label: "Companies",
          icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
        },
      ];
    }

    if (userType === "employer") {
      return [
        {
          href: "/",
          label: "Home",
          icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        },
        {
          href: "/dashboard/employer",
          label: "Dashboard",
          icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        },
        {
          href: "/dashboard/employer/jobs",
          label: "My Jobs",
          icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
        },
        {
          href: "/dashboard/employer/applications",
          label: "Applicants",
          icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        },
        {
          href: `/dashboard/employer/${getUsername()}/profile`,
          label: "Profile",
          icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
        },
      ];
    } else if (userType === "employee") {
      return [
        {
          href: "/",
          label: "Home",
          icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        },
        {
          href: `/dashboard/employee/${getUsername()}`,
          label: "Dashboard",
          icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        },
        {
          href: `/dashboard/employee/${getUsername()}?tab=applications`,
          label: "My Application",
          icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        },
        {
          href: "/companies",
          label: "Companies",
          icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
        },
        {
          href: `/dashboard/employee/${getUsername()}?tab=profile`,
          label: "Profile",
          icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
        },
      ];
    }

    return [];
  };

  // Search Component
  const SearchComponent = () => (
    <div
      className={`hidden md:flex flex-1 ${
        userType === "employer" ? "max-w-2xl" : "max-w-md"
      } mx-4`}
    >
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-white/60"
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
          placeholder={
            userType === "employer"
              ? "Search employee profiles..."
              : "Search jobs..."
          }
          className="w-full pl-10 pr-4 py-2 rounded-full bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-300"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button className="text-white/60 hover:text-white transition-colors duration-200">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  // Inbox Component with dynamic data
  const InboxComponent = () => {
    const [inboxData, setInboxData] = useState({ unread: 0, messages: [] });
    const [isInboxOpen, setIsInboxOpen] = useState(false);
    const inboxRef = useRef(null);

    // Fetch inbox data
    useEffect(() => {
      const fetchInboxData = async () => {
        try {
          if (!accessToken) return;

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/inbox/`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setInboxData({
              unread: data.unread_count || 0,
              messages: data.messages || [],
            });
          }
        } catch (error) {
          console.error("Error fetching inbox data:", error);
          // Fallback to mock data for development
          setInboxData({
            unread: Math.floor(Math.random() * 10),
            messages: [],
          });
        }
      };

      if (user && accessToken) {
        fetchInboxData();
        // Set up polling for real-time updates
        const interval = setInterval(fetchInboxData, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
      }
    }, [user, accessToken]);

    return (
      <div className="relative" ref={inboxRef}>
        <button
          onClick={() => setIsInboxOpen(!isInboxOpen)}
          className="relative p-2 text-white hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
            />
          </svg>
          {inboxData.unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {inboxData.unread > 99 ? "99+" : inboxData.unread}
            </span>
          )}
        </button>

        {/* Inbox Dropdown */}
        <div
          className={`absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 ease-out backdrop-blur-sm ${
            isInboxOpen
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
              <p className="text-sm font-medium text-gray-900 flex items-center justify-between">
                Messages
                <span className="text-xs text-blue-600">
                  {inboxData.unread} new
                </span>
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {inboxData.messages.length > 0 ? (
                inboxData.messages.slice(0, 5).map((message, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {message.sender_name?.charAt(0) || "U"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {message.sender_name || "Unknown User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {message.preview || "New message"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {message.timestamp
                            ? new Date(message.timestamp).toLocaleTimeString()
                            : "Just now"}
                        </p>
                      </div>
                      {!message.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
                    />
                  </svg>
                  <p className="mt-2 text-sm">No messages yet</p>
                </div>
              )}
            </div>

            <div className="px-4 py-3 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => {
                  setIsInboxOpen(false);
                  window.location.href = "/messages";
                }}
                className="w-full text-center text-sm text-orange-600 hover:text-orange-800 font-medium"
              >
                View all messages
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const ProfileMenu = () => (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="flex items-center space-x-2 p-2 text-white hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
      >
        <img
          src={
            user?.profile_picture ||
            user?.google_profile_picture ||
            "/images/default-avatar.png"
          }
          alt="Profile"
          className="w-8 h-8 rounded-full border-2 border-white/20"
        />
        <span className="hidden md:block text-sm font-medium">
          {user?.first_name || user?.email?.split("@")[0] || "User"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
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
            {userType === "employer" && user?.company_name && (
              <p className="text-xs text-blue-600">{user.company_name}</p>
            )}
            <p className="text-xs text-blue-600 capitalize">
              {userType || "User"}
            </p>
          </div>

          <DropdownLink href="/settings">
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

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={async () => {
                setIsProfileMenuOpen(false);
                try {
                  // Determine correct login page based on user type
                  const loginPage =
                    userType === "employee"
                      ? "/auth/login/employee"
                      : "/auth/login/employer";
                  await logout(loginPage);
                } catch (error) {
                  console.error("Logout error:", error);
                  // Fallback: force redirect
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

  // Mobile Menu with Role-Based Items
  const MobileKoluvuLabsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="text-white hover:bg-white/20 w-full text-left px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 rounded-lg font-medium flex justify-between items-center transition-all duration-300 hover:scale-105 group relative overflow-hidden"
        >
          <span className="relative z-10 text-xs sm:text-sm md:text-base">
            Koluvu Labs
          </span>
          <svg
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-all duration-300 relative z-10 ${
              isOpen ? "transform rotate-180" : ""
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
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
        </button>

        <div
          className={`pl-2 sm:pl-3 md:pl-4 space-y-1 sm:space-y-1.5 md:space-y-2 transition-all duration-500 ease-in-out ${
            isOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <MobileDropdownLink
            href="/resume-builder"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsOpen(false);
            }}
          >
            Resume Builder
          </MobileDropdownLink>
          <MobileDropdownLink
            href="/mock-interview"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsOpen(false);
            }}
          >
            AI Mock Interviews
          </MobileDropdownLink>
          <MobileDropdownLink
            href="/ats-system"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsOpen(false);
            }}
          >
            ATS
          </MobileDropdownLink>
        </div>
      </div>
    );
  };

  const roleSpecificItems = getRoleSpecificNavItems();

  return (
    <HeaderStatic
      isScrolled={isScrolled}
      sidebarToggleComponent={
        showSidebarToggle && toggleSidebar ? (
          <button
            onClick={toggleSidebar}
            className="lg:hidden relative inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/20 focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/20 group mr-3"
            style={{
              background:
                "linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
            }}
          >
            <span className="sr-only">Toggle sidebar</span>
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
        ) : null
      }
      // Desktop navigation links - only override when user is authenticated
      navLinksComponent={
        user ? (
          <div className="hidden lg:flex items-center space-x-6">
            {roleSpecificItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-white hover:bg-white/20 px-3 py-2 rounded-full font-medium transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:scale-105"
                style={{ fontSize: "clamp(13px, 1.4vw, 15px)" }}
              >
                {item.label}
              </a>
            ))}
          </div>
        ) : null // Let HeaderStatic use its default navigation
      }
      koluvuLabsComponent={
        // Always show Koluvu Labs dropdown
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsKoluvuLabsOpen(!isKoluvuLabsOpen)}
            className="text-white hover:bg-white/20 px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 rounded-full font-medium flex items-center gap-1 sm:gap-1.5 md:gap-2 transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:scale-105 group relative overflow-hidden"
            style={{ fontSize: "clamp(13px, 1.4vw, 15px)" }}
          >
            <span className="relative z-10">Koluvu Labs</span>
            <svg
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-all duration-300 relative z-10 ${
                isKoluvuLabsOpen ? "transform rotate-180" : ""
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
            <div className="absolute inset-0 bg-white/10 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
          </button>

          <div
            className={`absolute left-0 mt-1.5 sm:mt-2 md:mt-2.5 w-56 sm:w-60 md:w-64 origin-top-left rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 ease-out backdrop-blur-sm ${
              isKoluvuLabsOpen
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
            <div className="py-1 sm:py-1.5 md:py-2 relative">
              <div className="absolute top-0 left-3 sm:left-3.5 md:left-4 right-3 sm:right-3.5 md:right-4 h-0.5 bg-gradient-to-r from-[#fa7f04] to-[#e6720a] rounded-full"></div>

              <DropdownLink href="/resume-builder">
                <span className="flex items-center">
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2 md:mr-3 text-[#fa7f04]"
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
              </DropdownLink>

              <DropdownLink href="/mock-interview">
                <span className="flex items-center">
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2 md:mr-3 text-[#fa7f04]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  AI Mock Interviews
                </span>
              </DropdownLink>

              <DropdownLink href="/ats-system">
                <span className="flex items-center">
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2 md:mr-3 text-[#fa7f04]"
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
                  ATS
                </span>
              </DropdownLink>
            </div>
          </div>
        </div>
      }
      // User section with search, notifications, inbox and profile
      userSectionComponent={
        user ? (
          <div className="flex items-center space-x-2">
            <SearchComponent />
            <NotificationBell />
            <InboxComponent />
            <ProfileMenu />
          </div>
        ) : null // Let HeaderStatic use its default auth buttons
      }
      mobileMenuButtonComponent={
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl text-white hover:bg-white/20 focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/20 group"
            style={{
              background:
                "linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
            }}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <div className="relative w-6 h-6 flex flex-col items-center justify-center">
              <span
                className={`absolute block w-5 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "rotate-45 translate-y-0"
                    : "-translate-y-1.5"
                }`}
                style={{
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
                  transformOrigin: "center",
                  top: "50%",
                  left: "50%",
                  marginLeft: "-10px",
                }}
              />
              <span
                className={`absolute block w-5 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "opacity-0 scale-0"
                    : "opacity-100 scale-100"
                }`}
                style={{
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
                  top: "50%",
                  left: "50%",
                  marginLeft: "-10px",
                  marginTop: "-1px",
                }}
              />
              <span
                className={`absolute block w-5 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "-rotate-45 translate-y-0"
                    : "translate-y-1.5"
                }`}
                style={{
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
                  transformOrigin: "center",
                  top: "50%",
                  left: "50%",
                  marginLeft: "-10px",
                }}
              />
            </div>
          </button>
        </div>
      }
      mobileMenuComponent={
        <div
          id="mobile-menu"
          className={`lg:hidden bg-gradient-to-br from-[#fa7f04] to-[#e6720a] overflow-hidden transition-all duration-500 ease-in-out backdrop-blur-sm ${
            isMobileMenuOpen
              ? "max-h-screen opacity-100 border-t border-white/20"
              : "max-h-0 opacity-0"
          }`}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: isMobileMenuOpen
              ? "inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              : "none",
          }}
        >
          <div className="px-4 py-4 space-y-2">
            {roleSpecificItems.map((item) => (
              <MobileNavLink
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
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
                      d={item.icon}
                    />
                  </svg>
                  {item.label}
                </span>
              </MobileNavLink>
            ))}

            <MobileKoluvuLabsDropdown />

            <MobileNavLink
              href="/kolink"
              onClick={() => setIsMobileMenuOpen(false)}
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Kolink
              </span>
            </MobileNavLink>

            <MobileNavLink
              href="/training"
              onClick={() => setIsMobileMenuOpen(false)}
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Training Institute
              </span>
            </MobileNavLink>
          </div>

          {!user && (
            <div className="px-4 pb-4 space-y-2 border-t border-white/20 pt-4">
              <div className="grid gap-2">
                <MobileAuthButton
                  href="/auth/register/employee"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-4 h-4 mr-2"
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
                    Employee
                  </span>
                </MobileAuthButton>

                <MobileAuthButton
                  href="/auth/register/employer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-4 h-4 mr-2"
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
                    Employer
                  </span>
                </MobileAuthButton>

                <MobileAuthButton
                  href="/auth/register/partner"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Partner
                  </span>
                </MobileAuthButton>
              </div>
            </div>
          )}
        </div>
      }
    />
  );
};
