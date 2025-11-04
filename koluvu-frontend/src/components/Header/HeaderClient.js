// src/components/Header/HeaderClient.js

"use client";

import { useState, useRef, useEffect } from "react";
import { HeaderStatic } from "./HeaderStatic";
import {
  DropdownLink,
  MobileNavLink,
  MobileAuthButton,
  MobileDropdownLink,
} from "./HeaderComponents";
import styles from "../../styles/components/header/header.module.css";

export const HeaderClient = ({
  isDarkMode,
  toggleTheme,
  toggleSidebar,
  showSidebarToggle = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isKoluvuLabsOpen, setIsKoluvuLabsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const dropdownRef = useRef(null);

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

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsKoluvuLabsOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsKoluvuLabsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleAIMockInterviewClick = () => {
    window.location.href = "/mock-interview";
  };

  const MobileKoluvuLabsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    return (
      <div className="px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="text-white hover:bg-white/20 w-full text-left px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 rounded-lg font-medium flex justify-between items-center transition-all duration-300 hover:scale-105 group relative overflow-hidden"
          suppressHydrationWarning
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
            Applicant Tracking System (ATS)
          </MobileDropdownLink>
        </div>
      </div>
    );
  };

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
      koluvuLabsComponent={
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
              {/* Decorative gradient line */}
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
      mobileMenuButtonComponent={
        <div className={styles.mobileMenuBtnContainer}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative inline-flex items-center justify-center p-2 rounded-xl text-white hover:bg-white/20 focus:outline-none transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm border border-white/20 group"
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
            <div className="relative w-6 h-6">
              <span
                className={`absolute block w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "rotate-45 translate-y-0"
                    : "-translate-y-2"
                }`}
                style={{
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
                  transformOrigin: "center",
                }}
              />
              <span
                className={`absolute block w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "opacity-0 scale-0"
                    : "opacity-100 scale-100"
                }`}
                style={{
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
                }}
              />
              <span
                className={`absolute block w-6 h-0.5 bg-white transform transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen
                    ? "-rotate-45 translate-y-0"
                    : "translate-y-2"
                }`}
                style={{
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
                  transformOrigin: "center",
                }}
              />
            </div>
          </button>
        </div>
      }
      mobileMenuComponent={
        <div
          className={`bg-gradient-to-br from-[#fa7f04] to-[#e6720a] overflow-hidden transition-all duration-500 ease-in-out backdrop-blur-sm ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-2.5 sm:pt-3 sm:pb-4 sm:space-y-1.5 md:px-3 md:pt-4 md:pb-5 md:space-y-2 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

            <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="flex items-center">
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2 md:mr-2.5"
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
                Home
              </span>
            </MobileNavLink>

            <MobileNavLink
              href="/jobs"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2 md:mr-2.5"
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
                Jobs
              </span>
            </MobileNavLink>

            <MobileNavLink
              href="/companies"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="flex items-center">
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2 md:mr-2.5"
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
                Companies
              </span>
            </MobileNavLink>

            <MobileKoluvuLabsDropdown />

            <MobileNavLink href="/hrthreads">
              <span className="flex items-center">
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2 md:mr-2.5"
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

            <MobileNavLink href="/trainingregistration">
              <span className="flex items-center">
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2 md:mr-2.5"
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

            <MobileNavLink href="/govtjobs">
              <span className="flex items-center">
                <svg
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2 md:mr-2.5"
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
                Govt Jobs
              </span>
            </MobileNavLink>
          </div>

          <div className="px-2 pb-3 space-y-1.5 sm:px-2.5 sm:pb-4 sm:space-y-2 md:px-3 md:pb-5 md:space-y-2.5 border-t border-white/20 pt-2 sm:pt-3 md:pt-4">
            <div className="grid gap-1.5 sm:gap-2 md:gap-2.5">
              <MobileAuthButton href="/auth/register/employee">
                <span className="flex items-center justify-center">
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5 md:mr-2"
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

              <MobileAuthButton href="/auth/register/employer">
                <span className="flex items-center justify-center">
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5 md:mr-2"
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

              <MobileAuthButton href="/auth/register/partner">
                <span className="flex items-center justify-center">
                  <svg
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1 sm:mr-1.5 md:mr-2"
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

          {/* Decorative bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>
      }
    />
  );
};
