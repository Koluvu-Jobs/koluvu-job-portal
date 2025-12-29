// src/app/dashboard/employee/components/sidebar.js

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  User,
  FileUser,
  Mic,
  MessageSquare,
  ShieldCheck,
  Clipboard,
  Bell,
  Settings,
  X,
  Camera,
  Edit3,
  LogOut,
} from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import { useAuth } from "@/contexts/AuthContext";

// Easily change sidebar background here or by passing the backgroundGradient prop.
const DEFAULT_SIDEBAR_BACKGROUND = "linear-gradient(135deg, #130D2E)";

const Sidebar = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  toggleSidebar,
  backgroundGradient = DEFAULT_SIDEBAR_BACKGROUND,
  onProfilePictureUpdate,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showProfilePictureUpload, setShowProfilePictureUpload] =
    useState(false);
  const { userData, loading, error } = useUserData();
  const { logout } = useAuth();

  // Extract username from URL path
  const extractUsername = () => {
    const pathSegments = pathname.split("/");
    const employeeIndex = pathSegments.indexOf("employee");
    if (employeeIndex !== -1 && pathSegments[employeeIndex + 1]) {
      return pathSegments[employeeIndex + 1];
    }
    return userData?.user?.username || "default";
  };

  const username = extractUsername();

  // Extract user profile data with fallbacks
  const userProfile = userData
    ? {
        name:
          `${userData.user?.first_name || ""} ${
            userData.user?.last_name || ""
          }`.trim() || "User",
        role: userData.user?.current_designation || "Software Professional",
        avatar: userData.user?.effective_profile_picture
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"}${
              userData.user.effective_profile_picture
            }`
          : null,
        email: userData.user?.email || "",
        location: userData.user?.location || "Not specified",
        profileCompletion: userData.profile_completion || 0,
      }
    : {
        name: "Loading...",
        role: "...",
        avatar: null,
        email: "",
        location: "",
        profileCompletion: 0,
      };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: `/dashboard/employee/${username}`,
      tabName: "Dashboard",
    },
    {
      id: "applications",
      label: "My Applications",
      icon: FileText,
      path: `/dashboard/employee/${username}?tab=applications`,
      tabName: "My Applications",
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      path: `/dashboard/employee/${username}?tab=profile`,
      tabName: "My Profile",
    },
    {
      id: "resume",
      label: "Resume Builder",
      icon: FileUser,
      path: `/dashboard/employee/${username}?tab=resume`,
      tabName: "Resume Builder",
    },
    {
      id: "ats",
      label: "ATS",
      icon: Clipboard,
      path: `/dashboard/employee/${username}?tab=ats`,
      tabName: "ATS",
    },
    {
      id: "skill-enhancement",
      label: "Skill Enhancement",
      icon: Mic,
      path: `/dashboard/employee/${username}?tab=skill-enhancement`,
      tabName: "Skill Enhancement",
    },
    {
      id: "interview",
      label: "AI Mock Interview",
      icon: Edit3,
      path: "/mock-interview",
      tabName: "AI Mock Interview", // This stays external
    },
    {
      id: "feedback",
      label: "Interview Feedback",
      icon: MessageSquare,
      path: `/dashboard/employee/${username}?tab=feedback`,
      tabName: "Interview Feedback",
    },
    {
      id: "verification",
      label: "Verification",
      icon: ShieldCheck,
      path: `/dashboard/employee/${username}?tab=verification`,
      tabName: "Verification",
    },
    {
      id: "subscription",
      label: "Subscription",
      icon: Bell,
      path: `/dashboard/employee/${username}?tab=subscription`,
      tabName: "Subscription",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: `/dashboard/employee/${username}/settings`,
      tabName: "Settings",
    },
  ];

  const sidebarVariants = {
    open: { x: 0, rotateY: 0, opacity: 1, transition: { duration: 0.5 } },
    closed: {
      x: "-100%",
      rotateY: -30,
      opacity: 0,
      transition: { duration: 0.5 },
    },
  };

  useEffect(() => {
    // Set active tab based on current path and query parameters
    const currentTab = searchParams.get("tab");

    if (currentTab) {
      // Normalize some legacy or alternate tab names so sidebar highlights correctly
      const tabMap = {
        "resume-builder": "applications",
        resume: "resume",
        applications: "applications",
        profile: "profile",
        dashboard: "dashboard",
      };

      const normalized = tabMap[currentTab] || currentTab;
      setActiveTab(normalized);
      return;
    }

    // Normalize base employee dashboard path with username
    const baseEmployeePath = `/dashboard/employee/${username}`;

    // If we're on the generic dashboard root (no username), set to dashboard
    if (pathname === "/dashboard/employee") {
      setActiveTab("dashboard");
      return;
    }

    // Handle nested pages that should map to a sidebar section even without a tab param
    if (
      pathname.startsWith(`${baseEmployeePath}/resume-builder`) ||
      pathname.includes("/resume-builder")
    ) {
      // resume-builder pages belong to the Applications / Resume section
      setActiveTab("applications");
      return;
    }

    if (
      pathname.startsWith(`${baseEmployeePath}/mock-interview`) ||
      pathname.includes("/mock-interview")
    ) {
      setActiveTab("interview");
      return;
    }

    // If the exact username base path, set dashboard
    if (pathname === baseEmployeePath) {
      setActiveTab("dashboard");
      return;
    }

    // Fallback: match menuItems by comparing pathname against their paths (ignoring query)
    const matchingItem = menuItems.find((item) => {
      const itemPath = item.path.split("?")[0];
      return itemPath === pathname || pathname.startsWith(itemPath);
    });

    if (matchingItem) {
      setActiveTab(matchingItem.id);
    }
  }, [pathname, searchParams, setActiveTab, username]);

  const handleItemClick = (itemId) => {
    const item = menuItems.find((i) => i.id === itemId);
    if (item) {
      setActiveTab(itemId);
      localStorage.setItem("sidebarActiveTab", itemId);

      // Handle navigation based on item type
      const path =
        item.external || item.id === "interview"
          ? item.path // Use provided path for external routes
          : `${item.path}`; // Use path as is for internal routes

      router.push(path);

      if (isSidebarOpen) {
        toggleSidebar();
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout("/");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Force redirect even if logout fails
      localStorage.clear();
      sessionStorage.clear();
      router.push("/");
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Only image files (JPEG, PNG, GIF, WEBP) are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should not exceed 5MB.");
      return;
    }

    try {
      // Get access token
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("Please log in again to upload profile picture");
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("profile_picture", file);

      // Upload directly to Django backend (note trailing slash required by Django)
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const response = await fetch(
        `${backendUrl}/api/employee/${username}/profile/upload-picture/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to upload profile picture");
      }

      const data = await response.json();
      console.log("Profile picture uploaded successfully:", data);

      // Fetch updated dashboard data to get the new effective_profile_picture
      const dashboardResponse = await fetch(
        `${backendUrl}/api/employee/dashboard/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        console.log("Updated dashboard data after upload:", dashboardData);

        // Update localStorage auth data with new user info including effective_profile_picture
        const storedAuth = JSON.parse(localStorage.getItem("auth") || "{}");
        if (storedAuth.user && dashboardData.user) {
          // Completely replace user object to ensure all fields are updated
          storedAuth.user = dashboardData.user;
          localStorage.setItem("auth", JSON.stringify(storedAuth));
          console.log(
            "✅ Updated localStorage auth with effective_profile_picture:",
            dashboardData.user.effective_profile_picture
          );
        }
      }

      // Show success message
      alert("Profile picture updated successfully!");

      // Hard reload to clear all React state and force fresh data load
      window.location.href = window.location.href;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert(
        error.message || "Failed to upload profile picture. Please try again."
      );
    }
  };

  return (
    <>
      {/* Desktop Hover-Expandable Sidebar */}
      <HoverExpandableSidebar
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={handleItemClick}
        userProfile={userProfile}
        backgroundGradient={backgroundGradient}
        showProfilePictureUpload={showProfilePictureUpload}
        onProfilePictureUpload={handleProfilePictureUpload}
        setShowProfilePictureUpload={setShowProfilePictureUpload}
        handleLogout={handleLogout}
      />

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={toggleSidebar}
              style={{
                top: "var(--header-height)",
                height: "calc(100dvh - var(--header-height))",
              }}
            />
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed left-0 z-50 lg:hidden border-r border-gray-300 w-[85vw] xs:w-[80vw] sm:w-[70vw] md:w-96 max-w-[320px]"
              style={{
                "--sidebar-bg": backgroundGradient,
                background: "var(--sidebar-bg)",
                color: "#fff",
                boxShadow: "10px 0 25px rgba(235, 220, 220, 0.4)",
                transformStyle: "preserve-3d",
                perspective: 1000,
                top: "var(--header-height)",
                height: "calc(100dvh - var(--header-height))",
                overflowY: "auto",
              }}
            >
              <SidebarContent
                menuItems={menuItems}
                activeTab={activeTab}
                setActiveTab={handleItemClick}
                isMobile={true}
                toggleSidebar={toggleSidebar}
                userProfile={userProfile}
                isExpanded={true}
                handleLogout={handleLogout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Hover expandable desktop sidebar component
const HoverExpandableSidebar = ({
  menuItems,
  activeTab,
  setActiveTab,
  userProfile,
  backgroundGradient = DEFAULT_SIDEBAR_BACKGROUND,
  showProfilePictureUpload,
  onProfilePictureUpload,
  setShowProfilePictureUpload,
  handleLogout,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedWidth = 300; // px
  const collapsedWidth = 72; // px

  return (
    <motion.aside
      className="hidden lg:flex flex-col sticky z-40 group border-r border-white/10"
      style={{
        "--sidebar-bg": backgroundGradient,
        background: "var(--sidebar-bg)",
        color: "#fff",
        boxShadow: "8px 0 18px rgba(0,0,0,0.25)",
        transformStyle: "preserve-3d",
        backdropFilter: "blur(6px)",
        // Offset desktop sidebar below fixed header and constrain height
        top: "var(--header-height)",
        height: "calc(100dvh - var(--header-height))",
      }}
      initial={false}
      animate={{ width: isExpanded ? expandedWidth : collapsedWidth }}
      transition={{ type: "spring", stiffness: 240, damping: 28 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <SidebarContent
          menuItems={menuItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobile={false}
          userProfile={userProfile}
          isExpanded={isExpanded}
          showProfilePictureUpload={showProfilePictureUpload}
          onProfilePictureUpload={onProfilePictureUpload}
          setShowProfilePictureUpload={setShowProfilePictureUpload}
          handleLogout={handleLogout}
        />
      </div>
      {/* Mini footer (optional) */}
      <div className="px-2 pb-3 mt-auto text-[10px] text-white/50 select-none transition-opacity duration-300 hidden lg:block">
        <div
          className={`${
            isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-60"
          } transition-opacity duration-300`}
        >
          © {new Date().getFullYear()} Koluvu
        </div>
      </div>
    </motion.aside>
  );
};

const SidebarContent = ({
  menuItems,
  activeTab,
  setActiveTab,
  isMobile,
  toggleSidebar,
  userProfile,
  isExpanded = true,
  showProfilePictureUpload,
  onProfilePictureUpload,
  setShowProfilePictureUpload,
  handleLogout,
}) => {
  return (
    <div
      className={`flex flex-col h-full ${
        isMobile ? "p-2 xs:p-3 m-1 xs:m-2" : "px-2 py-4"
      } overflow-y-auto scrollbar-thin scrollbar-thumb-[#e5e7eb] scrollbar-track-transparent`}
    >
      {/* Mobile Header */}
      {isMobile && (
        <motion.button
          whileHover={{ scale: 0.9 }}
          whileTap={{ scale: 0.85 }}
          onClick={toggleSidebar}
          className="p-1.5 xs:p-2 rounded-lg text-white hover:bg-[#1a2036] self-end mb-2"
        >
          <X className="w-4 h-4 xs:w-5 xs:h-5" />
        </motion.button>
      )}

      {/* User Profile */}
      <motion.div
        whileHover={{
          scale: isMobile ? 1.02 : 1.02,
          rotateY: isMobile ? 2 : 0,
        }}
        transition={{ duration: 0.3 }}
        onClick={() => setActiveTab("profile")}
        className={`w-full rounded-lg mb-4 xs:mb-6 cursor-pointer text-center transition-all duration-300 ${
          isExpanded ? "p-3 xs:p-4 sm:p-5" : "p-2"
        } ${!isMobile && !isExpanded ? "mt-2" : ""}`}
        style={{
          backdropFilter: "blur(8px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className={`flex flex-col items-center ${isExpanded ? "" : ""}`}>
          <div
            className={`rounded-full flex items-center justify-center bg-[#1a2036] relative shadow-lg transition-all duration-300 group ${
              isExpanded
                ? "w-16 xs:w-18 sm:w-20 h-16 xs:h-18 sm:h-20 m-2 xs:m-3"
                : "w-12 h-12 m-1"
            }`}
          >
            {userProfile.avatar ? (
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="object-cover rounded-full w-full h-full"
              />
            ) : (
              <User
                className={
                  isExpanded
                    ? "w-8 xs:w-9 sm:w-10 h-8 xs:h-9 sm:h-10 text-gray-200"
                    : "w-6 h-6 text-gray-200"
                }
              />
            )}

            {/* Camera overlay with hidden file input */}
            <label
              className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Camera
                className={`text-white ${isExpanded ? "w-6 h-6" : "w-4 h-4"}`}
              />
              <input
                type="file"
                accept="image/*"
                onChange={onProfilePictureUpload}
                className="hidden"
                onClick={(e) => e.stopPropagation()}
              />
            </label>

            <span
              className={`absolute ${
                isExpanded ? "bottom-2 right-2" : "bottom-1 right-1"
              } w-3 h-3 bg-green-500 border-2 border-[#232946] rounded-full`}
            ></span>
          </div>
          {isExpanded && (
            <>
              <p className="font-semibold text-base xs:text-lg leading-snug break-words px-1">
                {userProfile.name}
              </p>
              <p className="text-xs xs:text-sm opacity-80 mt-0.5 break-words px-1">
                {userProfile.role}
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2 xs:space-y-2.5 sm:space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{
                scale: 1.03,
                x: isExpanded ? 4 : 0,
                rotateY: isExpanded ? 3 : 0,
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(item.id)}
              title={!isExpanded ? item.label : undefined}
              aria-label={item.label}
              className={`relative group w-full flex items-center rounded-lg xs:rounded-xl transition-all duration-300 ease-in-out overflow-hidden
                ${
                  isExpanded
                    ? "justify-start px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 gap-2 xs:gap-2.5 sm:gap-3"
                    : "justify-center p-2"
                }
                ${
                  isActive
                    ? "bg-[#e55b13] text-white border border-[#e55b13] shadow-lg ring-1 ring-[#e55b13]/40 "
                    : "bg-white/10 text-white hover:bg-white/20 border border-transparent"
                }
              `}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Icon
                className={`flex-shrink-0 ${
                  isExpanded
                    ? "w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6"
                    : "w-6 h-6 xs:w-7 xs:h-7"
                } transition-transform duration-300`}
              />
              <span
                className={`font-medium text-xs xs:text-sm sm:text-base tracking-tight break-words whitespace-nowrap overflow-hidden transform-gpu origin-left transition-all duration-300
                                ${
                                  isExpanded
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-95 w-0"
                                }
                                group-hover:opacity-100 group-hover:scale-100`}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <motion.button
        whileHover={{
          scale: 1.03,
          x: isExpanded ? 4 : 0,
          rotateY: isExpanded ? 3 : 0,
        }}
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        title={!isExpanded ? "Sign Out" : undefined}
        aria-label="Sign Out"
        className={`relative group w-full flex items-center rounded-lg xs:rounded-xl transition-all duration-300 ease-in-out overflow-hidden mt-3 xs:mt-4 border-t border-white/20 pt-3 xs:pt-4
          ${
            isExpanded
              ? "justify-start px-2.5 xs:px-3 sm:px-4 py-2 xs:py-2.5 gap-2 xs:gap-2.5 sm:gap-3"
              : "justify-center p-2"
          }
          bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40
        `}
        style={{ transformStyle: "preserve-3d" }}
      >
        <LogOut
          className={`flex-shrink-0 ${
            isExpanded
              ? "w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6"
              : "w-6 h-6 xs:w-7 xs:h-7"
          } transition-transform duration-300`}
        />
        <span
          className={`font-medium text-xs xs:text-sm sm:text-base tracking-tight break-words whitespace-nowrap overflow-hidden transform-gpu origin-left transition-all duration-300
                            ${
                              isExpanded
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-95 w-0"
                            }
                            group-hover:opacity-100 group-hover:scale-100`}
        >
          Sign Out
        </span>
      </motion.button>
    </div>
  );
};

export default Sidebar;
