// src/components/Sidebar/EnhancedSidebar.js

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const EnhancedSidebar = ({ isOpen, onToggle }) => {
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [hoveredItem, setHoveredItem] = useState(null);

  const { userType, user, logout } = useAuth();
  const pathname = usePathname();

  // Role-based navigation items
  const getNavigationItems = () => {
    const commonItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
        href: "/dashboard",
        category: "main",
      },
      {
        id: "profile",
        label: "My Profile",
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
        href: "/profile",
        category: "account",
      },
    ];

    if (userType === "employer") {
      return [
        ...commonItems,
        {
          id: "jobs",
          label: "Job Management",
          icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6",
          category: "management",
          hasSubmenu: true,
          submenu: [
            {
              label: "All Jobs",
              href: "/employer/jobs",
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            },
            {
              label: "Post New Job",
              href: "/employer/jobs/create",
              icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
            },
            {
              label: "Active Jobs",
              href: "/employer/jobs/active",
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              label: "Job Analytics",
              href: "/employer/jobs/analytics",
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            },
          ],
        },
        {
          id: "applications",
          label: "Applications",
          icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
          href: "/employer/applications",
          category: "management",
          badge: "new",
        },
        {
          id: "interviews",
          label: "Interview Scheduler",
          icon: "M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0v12a2 2 0 002 2h4a2 2 0 002-2V7",
          category: "management",
          hasSubmenu: true,
          submenu: [
            {
              label: "Schedule Interview",
              href: "/employer/interviews/schedule",
              icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
            },
            {
              label: "Upcoming Interviews",
              href: "/employer/interviews/upcoming",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              label: "Interview History",
              href: "/employer/interviews/history",
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2",
            },
          ],
        },
        {
          id: "candidates",
          label: "Candidate Search",
          icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
          href: "/employer/candidates/search",
          category: "management",
        },
        {
          id: "company",
          label: "Company Settings",
          icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
          category: "settings",
          hasSubmenu: true,
          submenu: [
            {
              label: "Company Profile",
              href: "/employer/company/profile",
              icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16",
            },
            {
              label: "Branding & Logo",
              href: "/employer/company/branding",
              icon: "M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2",
            },
            {
              label: "Activation Controls",
              href: "/employer/company/activation",
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            },
          ],
        },
      ];
    } else if (userType === "employee") {
      return [
        ...commonItems,
        {
          id: "job-search",
          label: "Find Jobs",
          icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
          href: "/employee/jobs/search",
          category: "main",
        },
        {
          id: "my-applications",
          label: "My Applications",
          icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
          href: "/employee/applications",
          category: "main",
        },
        {
          id: "resume",
          label: "Resume Builder",
          icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
          href: "/employee/resume",
          category: "tools",
        },
        {
          id: "skill-assessment",
          label: "Skill Assessment",
          icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
          href: "/employee/skills",
          category: "tools",
        },
        {
          id: "career-opportunities",
          label: "Career Opportunities",
          icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
          href: "/employee/career",
          category: "tools",
        },
      ];
    } else {
      return commonItems;
    }
  };

  const navigationItems = getNavigationItems();

  // Toggle expanded sections
  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Check if path is active
  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  // Check if submenu item is active
  const hasActiveSubmenu = (submenu) => {
    return submenu?.some((item) => isActive(item.href));
  };

  // Auto-expand section if it contains active item
  useEffect(() => {
    navigationItems.forEach((item) => {
      if (item.hasSubmenu && hasActiveSubmenu(item.submenu)) {
        setExpandedSections((prev) => new Set([...prev, item.id]));
      }
    });
  }, [pathname]);

  // Group items by category
  const groupedItems = navigationItems.reduce((groups, item) => {
    const category = item.category || "other";
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});

  const categoryLabels = {
    main: "Main",
    management: "Management",
    tools: "Tools & Resources",
    settings: "Settings",
    account: "Account",
    other: "Other",
  };

  const categoryOrder = [
    "main",
    "management",
    "tools",
    "settings",
    "account",
    "other",
  ];

  return (
    <>
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-xl z-50 lg:relative lg:translate-x-0 lg:shadow-none ${
          isOpen ? "w-80" : "w-0 lg:w-80"
        } overflow-hidden lg:block`}
        // Ensure the sidebar sits below the fixed header and doesn't get hidden
        style={{ top: "var(--header-height)", height: "calc(100% - var(--header-height))" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Koluvu</h2>
                <p className="text-xs text-gray-500 capitalize">
                  {userType || "User"} Portal
                </p>
              </div>
            </div>

            {/* Close button for mobile */}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.first_name?.charAt(0) ||
                      user.username?.charAt(0) ||
                      "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.first_name
                      ? `${user.first_name} ${user.last_name || ""}`
                      : user.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
            {categoryOrder.map((categoryKey) => {
              const items = groupedItems[categoryKey];
              if (!items?.length) return null;

              return (
                <div key={categoryKey}>
                  {/* Category Label */}
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    {categoryLabels[categoryKey]}
                  </h3>

                  {/* Category Items */}
                  <div className="space-y-1">
                    {items.map((item) => (
                      <div key={item.id}>
                        {/* Main Navigation Item */}
                        {item.hasSubmenu ? (
                          <button
                            onClick={() => toggleSection(item.id)}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                              hasActiveSubmenu(item.submenu) ||
                              expandedSections.has(item.id)
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : hoveredItem === item.id
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <svg
                                className="w-5 h-5 flex-shrink-0"
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
                              <span className="font-medium">{item.label}</span>
                              {item.badge && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <motion.svg
                              animate={{
                                rotate: expandedSections.has(item.id) ? 90 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                              className="w-4 h-4 flex-shrink-0"
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
                            </motion.svg>
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                              isActive(item.href)
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : hoveredItem === item.id
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                          >
                            <svg
                              className="w-5 h-5 flex-shrink-0"
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
                            <span className="font-medium">{item.label}</span>
                            {item.badge && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        )}

                        {/* Submenu */}
                        <AnimatePresence>
                          {item.hasSubmenu && expandedSections.has(item.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2 ml-8 space-y-1">
                                {item.submenu.map((subItem) => (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                      isActive(subItem.href)
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                  >
                                    <svg
                                      className="w-4 h-4 flex-shrink-0"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d={subItem.icon}
                                      />
                                    </svg>
                                    <span>{subItem.label}</span>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-2">
              <Link
                href="/help"
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
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
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Help & Support</span>
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
