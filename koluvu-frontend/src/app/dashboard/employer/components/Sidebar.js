// src/app/dashboard/employer/components/Sidebar.js

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gauge,
  Briefcase,
  Users,
  Wrench,
  ClipboardList,
  CreditCard as CreditCardIcon,
  HelpCircle,
  Search,
  FileText,
  Bot,
  CalendarDays,
  Shield,
  UserCheck,
  Bolt,
  Hourglass,
  Lock,
  PlusCircle,
  ChartPie,
  Menu,
  X,
  Camera,
  Settings,
  LogOut,
  User,
} from "lucide-react";
// Removed SettingsModal import as we now use a dedicated settings page
import { useAuth } from "@/contexts/AuthContext";

// Use the same gradient background as employee sidebar
const DEFAULT_SIDEBAR_BACKGROUND = "linear-gradient(135deg, #130D2E)";

const Sidebar = ({
  activeTab,
  setActiveTab,
  isSidebarOpen,
  toggleSidebar,
  userProfile = {
    name: "Employer",
    role: "Koluvu HR Solutions",
    avatar: null,
  },
  backgroundGradient = DEFAULT_SIDEBAR_BACKGROUND,
  onProfilePictureUpdate,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfilePictureUpload, setShowProfilePictureUpload] =
    useState(false);
  // Removed showSettingsModal state as we now use a dedicated settings page
  const { logout, user } = useAuth();

  // Get current user's username for navigation
  const getCurrentUsername = () => {
    if (user?.username) return user.username;
    if (user?.email) return user.email.split("@")[0];
    return "profile"; // fallback
  };

  const username = getCurrentUsername();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Gauge,
      path: `/dashboard/employer/${username}`,
      tabName: "Dashboard",
    },
    {
      id: "post-jobs",
      label: "Post Job",
      icon: PlusCircle,
      path: `/dashboard/employer/${username}?tab=post-jobs`,
      tabName: "Post Job",
    },
    {
      id: "active-jobs",
      label: "Active Jobs",
      icon: Bolt,
      path: `/dashboard/employer/${username}?tab=active-jobs`,
      tabName: "Active Jobs",
    },
    {
      id: "expired-jobs",
      label: "Expired Jobs",
      icon: Hourglass,
      path: `/dashboard/employer/${username}?tab=expired-jobs`,
      tabName: "Expired Jobs",
    },
    {
      id: "closed-jobs",
      label: "Closed Jobs",
      icon: Lock,
      path: `/dashboard/employer/${username}?tab=closed-jobs`,
      tabName: "Closed Jobs",
    },
    {
      id: "boolean-search",
      label: "Boolean Search",
      icon: Search,
      path: `/dashboard/employer/${username}?tab=boolean-search`,
      tabName: "Boolean Search",
    },
    {
      id: "ats",
      label: "ATS",
      icon: FileText,
      path: `/dashboard/employer/${username}?tab=ats`,
      tabName: "ATS",
    },
    {
      id: "interview-scheduler",
      label: "Interview Scheduler",
      icon: CalendarDays,
      path: `/dashboard/employer/${username}?tab=interview-scheduler`,
      tabName: "Interview Scheduler",
    },
    {
      id: "proxying-detector",
      label: "Proxying Detector",
      icon: Shield,
      path: `/dashboard/employer/${username}?tab=proxying-detector`,
      tabName: "Proxying Detector",
    },
    {
      id: "feedback-form",
      label: "Feedback Form",
      icon: FileText,
      path: `/dashboard/employer/${username}?tab=feedback-form`,
      tabName: "Feedback Form",
    },
    {
      id: "candidate-status",
      label: "Candidate Status",
      icon: UserCheck,
      path: `/dashboard/employer/${username}?tab=candidate-status`,
      tabName: "Candidate Status",
    },
    {
      id: "subscription-plans",
      label: "Subscription Plans",
      icon: CreditCardIcon,
      path: `/dashboard/employer/${username}?tab=subscription-plans`,
      tabName: "Subscription Plans",
    },
    {
      id: "help-center",
      label: "Help Center",
      icon: HelpCircle,
      path: `/dashboard/employer/${username}?tab=help-center`,
      tabName: "Help Center",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: `/dashboard/employer/${username}?tab=settings`,
      external: true,
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

  const handleItemClick = (itemId) => {
    const item = menuItems.find((i) => i.id === itemId);
    if (item) {
      setActiveTab && setActiveTab(itemId);

      // For external routes (like active-jobs, expired-jobs), navigate normally
      if (item.external) {
        router.push(item.path);
      } else {
        // For internal tabs, use tab-based routing
        router.push(item.path);
      }

      if (isSidebarOpen && toggleSidebar) {
        toggleSidebar();
      }
    }
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("Only image files (JPEG, PNG, GIF, WEBP) are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size should not exceed 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (onProfilePictureUpdate) {
          onProfilePictureUpdate(e.target.result);
        }
        setShowProfilePictureUpload(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = () => {
    if (logout) {
      logout();
    }
    router.push("/");
  };

  const handleSettingsClick = () => {
    router.push(`/dashboard/employer/${username}?tab=settings`);
  };

  // Removed closeSettingsModal function as we now use a dedicated settings page

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
        handleLogout={handleSignOut}
      />

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-0 z-50 lg:hidden border-r border-gray-300"
            style={{
              "--sidebar-bg": backgroundGradient,
              background: "var(--sidebar-bg)",
              color: "#fff",
              boxShadow: "10px 0 25px rgba(235, 220, 220, 0.4)",
              transformStyle: "preserve-3d",
              perspective: 1000,
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
              showProfilePictureUpload={showProfilePictureUpload}
              onProfilePictureUpload={handleProfilePictureUpload}
              setShowProfilePictureUpload={setShowProfilePictureUpload}
              handleLogout={handleSignOut}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Removed SettingsModal as we now use a dedicated settings page */}
    </>
  );
};

// Component definitions are at the end of the file

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
      className="hidden lg:flex flex-col h-[100dvh] sticky top-0 z-40 group border-r border-white/10 flex-shrink-0"
      style={{
        "--sidebar-bg": backgroundGradient,
        background: "var(--sidebar-bg)",
        color: "#fff",
        boxShadow: "8px 0 18px rgba(0,0,0,0.25)",
        transformStyle: "preserve-3d",
        backdropFilter: "blur(6px)",
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
        isMobile ? "p-3 m-2" : "px-2 py-4"
      } overflow-y-auto scrollbar-thin scrollbar-thumb-[#e5e7eb] scrollbar-track-transparent`}
    >
      {/* Mobile Header */}
      {isMobile && (
        <motion.button
          whileHover={{ scale: 0.8 }}
          whileTap={{ scale: 0.7 }}
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-white hover:bg-[#1a2036] self-end"
        >
          <X className="w-5 h-5" />
        </motion.button>
      )}

      {/* User Profile */}
      <motion.div
        whileHover={{
          scale: isMobile ? 1.05 : 1.02,
          rotateY: isMobile ? 5 : 0,
        }}
        transition={{ duration: 0.3 }}
        onClick={() => setActiveTab && setActiveTab("profile")}
        className={`w-full rounded-lg mb-6 cursor-pointer text-center transition-all duration-300 ${
          isExpanded ? "p-5" : "p-2"
        } ${!isMobile && !isExpanded ? "mt-2" : ""}`}
        style={{
          backdropFilter: "blur(8px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className={`flex flex-col items-center ${isExpanded ? "" : ""}`}>
          <div
            className={`rounded-full flex items-center justify-center bg-[#1a2036] relative shadow-lg transition-all duration-300 group ${
              isExpanded ? "w-20 h-20 m-3" : "w-12 h-12 m-1"
            }`}
          >
            {userProfile.avatar ? (
              <div className="relative">
                <Image
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  width={isExpanded ? 80 : 48}
                  height={isExpanded ? 80 : 48}
                  className="object-cover rounded-full border-2 border-white/20 shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
              </div>
            ) : (
              <div className="relative">
                <div
                  className={`
                  bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center
                  ${isExpanded ? "w-20 h-20" : "w-12 h-12"}
                `}
                >
                  <User
                    className={
                      isExpanded ? "w-10 h-10 text-white" : "w-6 h-6 text-white"
                    }
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
              </div>
            )}

            {/* Camera overlay */}
            <div
              className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                setShowProfilePictureUpload &&
                  setShowProfilePictureUpload(true);
              }}
            >
              <Camera
                className={`text-white ${isExpanded ? "w-6 h-6" : "w-4 h-4"}`}
              />
            </div>

            <span
              className={`absolute ${
                isExpanded ? "bottom-2 right-2" : "bottom-1 right-1"
              } w-3 h-3 bg-green-500 border-2 border-[#232946] rounded-full`}
            ></span>
          </div>
          {isExpanded && (
            <>
              <p className="font-semibold text-lg leading-snug">
                {userProfile.name}
              </p>
              <p className="text-sm opacity-80 mt-0.5">{userProfile.role}</p>
            </>
          )}
        </div>
      </motion.div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{
                scale: 1.05,
                x: isExpanded ? 6 : 0,
                rotateY: isExpanded ? 5 : 0,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(item.id)}
              title={!isExpanded ? item.label : undefined}
              aria-label={item.label}
              className={`relative group w-full flex items-center rounded-xl transition-all duration-300 ease-in-out overflow-hidden
                ${
                  isExpanded
                    ? "justify-start px-4 py-2 gap-3"
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
                  isExpanded ? "w-6 h-6" : "w-7 h-7"
                } transition-transform duration-300`}
              />
              <span
                className={`font-medium text-base tracking-tight break-words whitespace-nowrap overflow-hidden transform-gpu origin-left transition-all duration-300
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

      {/* Logout Button - Available on both mobile and desktop */}
      <motion.button
        whileHover={{
          scale: 1.05,
          x: isExpanded ? 6 : 0,
          rotateY: isExpanded ? 5 : 0,
        }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        title={!isExpanded ? "Sign Out" : undefined}
        aria-label="Sign Out"
        className={`relative group w-full flex items-center rounded-xl transition-all duration-300 ease-in-out overflow-hidden mt-4 border-t border-white/20 pt-4
          ${isExpanded ? "justify-start px-4 py-2 gap-3" : "justify-center p-2"}
          bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40
        `}
        style={{ transformStyle: "preserve-3d" }}
      >
        <LogOut
          className={`flex-shrink-0 ${
            isExpanded ? "w-6 h-6" : "w-7 h-7"
          } transition-transform duration-300`}
        />
        <span
          className={`font-medium text-base tracking-tight break-words whitespace-nowrap overflow-hidden transform-gpu origin-left transition-all duration-300
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
