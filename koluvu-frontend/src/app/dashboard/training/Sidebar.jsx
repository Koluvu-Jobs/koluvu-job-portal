// src/app/dashboard/training/Sidebar.jsx

"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  User,
  FileUser,
  Mic,
  MessageSquare,
  ShieldCheck,
  Settings,
  X,
  Search,
  GraduationCap,
  Briefcase,
  Clock,
  Phone,
  LogOut,
  Users,
  UserCheck,
  Wrench,
} from "lucide-react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faCamera } from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  isMobile,
  userProfile = {
    name: "Training Institute",
    role: "Professional Training Solutions",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  onProfileUpdate,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [expandedServices, setExpandedServices] = React.useState(false);

  const menuItems = [
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard/training",
    },
    {
      id: "Post Training",
      label: "Post Training",
      icon: FileText,
      path: "/dashboard/training/post",
    },
    {
      id: "Active Training post",
      label: "Active Training post",
      icon: Briefcase,
      path: "/dashboard/training/active",
    },
    {
      id: "Expired Training post",
      label: "Expired Training post",
      icon: Clock,
      path: "/dashboard/training/expired",
    },
    {
      id: "Draft Training post",
      label: "Draft Training post",
      icon: FileText,
      path: "/dashboard/training/draft",
    },
    {
      id: "Advanced Search",
      label: "Advanced Search",
      icon: Search,
      path: "/dashboard/training/search",
    },
    {
      id: "Koluvu Business",
      label: "Koluvu Business",
      icon: Briefcase,
      path: "/dashboard/training/koluvu-business",
    },
    {
      id: "Courses offered",
      label: "Courses offered",
      icon: GraduationCap,
      path: "/dashboard/training/courses",
    },
    {
      id: "Profile Setup",
      label: "Profile Setup",
      icon: User,
      path: "/dashboard/training/profile",
    },
    {
      id: "account settings",
      label: "Account Settings",
      icon: Settings,
      path: "/dashboard/training/settings",
    },
    {
      id: "contact us",
      label: "Contact Us",
      icon: Phone,
      path: "/dashboard/training/contact",
    },
    {
      id: "logout",
      label: "Logout",
      icon: LogOut,
      path: "/dashboard/training/logout",
    },
  ];

  const servicesItems = [
    {
      id: "placements",
      label: "Placements",
      icon: Users,
      path: "/dashboard/training/placements",
    },
    {
      id: "internship",
      label: "Internship",
      icon: UserCheck,
      path: "/dashboard/training/internship",
    },
  ];

  const DEFAULT_SIDEBAR_BACKGROUND = "linear-gradient(135deg, #130D2E)";
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
    // Set active tab based on current path
    const currentTab =
      menuItems.find(
        (item) =>
          pathname === item.path ||
          (item.id === "Dashboard" && pathname === "/dashboard/training")
      )?.id || "Dashboard";
    setActiveTab(currentTab);
  }, [pathname]);

  const handleItemClick = (itemId) => {
    const item =
      menuItems.find((i) => i.id === itemId) ||
      servicesItems.find((i) => i.id === itemId);
    if (item) {
      setActiveTab(itemId);
      localStorage.setItem("sidebarActiveTab", itemId);

      if (isMobile) {
        setSidebarOpen(false);
      }
    }
  };

  const toggleServices = () => {
    setExpandedServices(!expandedServices);
  };

  return (
    <>
      {/* Desktop Hover-Expandable Sidebar */}
      <HoverExpandableSidebar
        menuItems={menuItems}
        servicesItems={servicesItems}
        activeTab={activeTab}
        setActiveTab={handleItemClick}
        userProfile={userProfile}
        onProfileUpdate={onProfileUpdate}
        backgroundGradient={DEFAULT_SIDEBAR_BACKGROUND}
        expandedServices={expandedServices}
        toggleServices={toggleServices}
      />

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-0 z-50 lg:hidden border-r border-gray-300"
            style={{
              "--sidebar-bg": DEFAULT_SIDEBAR_BACKGROUND,
              background: "var(--sidebar-bg)",
              color: "#fff",
              boxShadow: "10px 0 25px rgba(235, 220, 220, 0.4)",
              transformStyle: "preserve-3d",
              perspective: 1000,
            }}
          >
            <SidebarContent
              menuItems={menuItems}
              servicesItems={servicesItems}
              activeTab={activeTab}
              setActiveTab={handleItemClick}
              isMobile={true}
              toggleSidebar={() => setSidebarOpen(false)}
              userProfile={userProfile}
              onProfileUpdate={onProfileUpdate}
              expandedServices={expandedServices}
              toggleServices={toggleServices}
              isExpanded={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Hover expandable desktop sidebar component
const HoverExpandableSidebar = ({
  menuItems,
  servicesItems,
  activeTab,
  setActiveTab,
  userProfile,
  onProfileUpdate,
  backgroundGradient = DEFAULT_SIDEBAR_BACKGROUND,
  expandedServices,
  toggleServices,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const expandedWidth = 270;
  const collapsedWidth = 60;

  return (
    <motion.aside
      className="hidden lg:flex flex-col h-[100dvh] sticky top-0 z-40 group border-r border-white/10"
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
          servicesItems={servicesItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobile={false}
          userProfile={userProfile}
          onProfileUpdate={onProfileUpdate}
          expandedServices={expandedServices}
          toggleServices={toggleServices}
          isExpanded={isExpanded}
        />
      </div>
    </motion.aside>
  );
};

const SidebarContent = ({
  menuItems,
  servicesItems,
  activeTab,
  setActiveTab,
  isMobile,
  toggleSidebar,
  userProfile,
  onProfileUpdate,
  expandedServices,
  toggleServices,
  isExpanded = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const backendBase =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const token = localStorage.getItem("access_token");

      const formData = new FormData();
      formData.append("logo", file);

      const response = await fetch(`${backendBase}/api/training/profile/`, {
        method: "PATCH",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Update the userProfile with new logo
        const updatedProfile = {
          ...userProfile,
          avatar: data.logo ? `${backendBase}${data.logo}` : null,
        };
        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
      } else {
        alert("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`flex flex-col h-full $${
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
        className={`w-full rounded-lg mb-6 text-center transition-all duration-300 ${
          isExpanded ? "p-4" : "p-1"
        } ${!isMobile && !isExpanded ? "mt-2" : ""}`}
        style={{
          backdropFilter: "blur(8px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className={`flex flex-col items-center ${isExpanded ? "" : ""}`}>
          <div
            className={`rounded-full flex items-center justify-center bg-[#1a2036] relative shadow-lg transition-all duration-300 group cursor-pointer ${
              isExpanded ? "w-16 h-16 m-2" : "w-10 h-10 m-1"
            }`}
            onClick={handleImageClick}
          >
            {userProfile.avatar ? (
              <Image
                src={userProfile.avatar}
                alt={userProfile.name}
                width={isExpanded ? 64 : 40}
                height={isExpanded ? 64 : 40}
                className="object-cover rounded-full"
              />
            ) : (
              <User
                className={
                  isExpanded ? "w-8 h-8 text-gray-200" : "w-5 h-5 text-gray-200"
                }
              />
            )}
            {/* Upload overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <FontAwesomeIcon
                icon={faCamera}
                className={`${isExpanded ? "w-4 h-4" : "w-3 h-3"} text-white`}
              />
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
            )}
            <span
              className={`absolute ${
                isExpanded ? "bottom-2 right-2" : "bottom-1 right-1"
              } w-2.5 h-2.5 bg-green-500 border-2 border-[#232946] rounded-full`}
            ></span>
          </div>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {isExpanded && (
            <>
              <p className="font-semibold text-base leading-snug">
                {userProfile.name}
              </p>
              <p className="text-xs opacity-80 mt-0.5">{userProfile.role}</p>
              <div className="px-2 py-0.5 bg-[#FF8E2B] rounded-full mt-2">
                <span className="text-white text-[10px] font-medium">
                  Premium
                </span>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-4">
        {menuItems.slice(0, 6).map((item) => {
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
              className={`relative group flex items-center rounded-xl transition-all duration-300 ease-in-out overflow-hidden mx-2
                ${
                  isExpanded
                    ? "justify-start px-3 py-2 gap-2"
                    : "justify-center p-2"
                }
                ${
                  isActive
                    ? "bg-[#e55b13] text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }
              `}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Removed yellow dot indicator */}
              <Icon
                className={`flex-shrink-0 ${
                  isExpanded ? "w-5 h-5" : "w-6 h-6"
                } transition-transform duration-300`}
              />
              <span
                className={`font-medium ${
                  isExpanded ? "text-base" : "text-sm"
                } tracking-tight break-words whitespace-nowrap overflow-hidden transform-gpu origin-left transition-all duration-300
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

        {/* Services Offered Section */}
        <div className="w-full">
          <motion.button
            whileHover={{
              scale: 1.05,
              x: isExpanded ? 6 : 0,
              rotateY: isExpanded ? 5 : 0,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleServices}
            className={`relative group flex items-center rounded-xl transition-all duration-300 ease-in-out overflow-hidden mx-2 w-[calc(100%-16px)] min-h-[48px]
              ${
                isExpanded
                  ? "justify-start px-3 py-2 gap-2"
                  : "justify-center p-2"
              }
              ${
                expandedServices ||
                activeTab === "placements" ||
                activeTab === "internship"
                  ? "bg-[#e55b13] text-white border border-[#e55b13] shadow-lg ring-1 ring-[#e55b13]/40 "
                  : "bg-white/10 text-white hover:bg-white/20 border border-transparent"
              }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            <Wrench
              className={`flex-shrink-0 ${
                isExpanded ? "w-5 h-5" : "w-6 h-6"
              } transition-transform duration-300`}
            />
            {isExpanded && (
              <span className="font-medium text-base tracking-tight break-words whitespace-nowrap overflow-hidden transform-gpu origin-left transition-all duration-300 opacity-100 scale-100 group-hover:opacity-100 group-hover:scale-100 ml-3">
                Services Offered
              </span>
            )}
            {isExpanded && (
              <span className="text-sm transition-transform duration-300 transform text-gray-400 group-hover:text-white ml-auto">
                {expandedServices ? "▼" : "▶"}
              </span>
            )}
          </motion.button>
          <AnimatePresence>
            {(expandedServices ||
              (!isExpanded &&
                (activeTab === "placements" ||
                  activeTab === "internship" ||
                  activeTab === "Services Offered"))) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="pl-0 mt-1 space-y-1 overflow-hidden"
              >
                {servicesItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const nestedStyle = isExpanded
                    ? "w-[90%] ml-6 mr-2 px-3 py-2 gap-2"
                    : "w-[calc(100%-16px)] mx-2 mr-2 justify-center p-2";
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
                      className={`relative group flex items-center rounded-xl transition-all duration-300 ease-in-out overflow-hidden min-h-[40px] ${nestedStyle}
                        ${
                          isActive
                            ? "bg-[#e55b13] text-white border border-[#e55b13] shadow-lg ring-1 ring-[#e55b13]/40 "
                            : "bg-white/10 text-white hover:bg-white/20 border border-transparent"
                        }`}
                    >
                      <Icon
                        className={`flex-shrink-0 ${
                          isExpanded ? "w-4 h-4" : "w-6 h-6"
                        } transition-transform duration-300`}
                      />
                      <span
                        className={`font-medium ${
                          isExpanded ? "text-base" : "text-sm"
                        } tracking-tight break-words whitespace-nowrap overflow-hidden transform-gpu origin-left transition-all duration-300
                        ${
                          isExpanded
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 w-0"
                        } group-hover:opacity-100 group-hover:scale-100`}
                      >
                        {isExpanded ? item.label : ""}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Restore missing sections: Courses offered to Logout */}
        {menuItems.slice(6).map((item) => {
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
              className={`relative group flex items-center rounded-xl transition-all duration-300 ease-in-out overflow-hidden mx-2
                ${
                  isExpanded
                    ? "justify-start px-3 py-2 gap-2"
                    : "justify-center p-2"
                }
                ${
                  isActive
                    ? "bg-[#e55b13] text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
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
                className={`font-medium text-sm tracking-tight break-words whitespace-nowrap overflow-hidden transform-gpu origin-left transition-all duration-300
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
    </div>
  );
};

export default Sidebar;
