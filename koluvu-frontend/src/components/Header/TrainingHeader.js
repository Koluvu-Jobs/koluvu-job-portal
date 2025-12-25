// src/components/Header/TrainingHeader.js
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export const TrainingHeader = ({
  pageTitle = "Training Institute Dashboard",
  toggleSidebar,
  showSidebarToggle = true,
  isSidebarOpen = false,
  profileData = null,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { user, logout, accessToken } = useAuth();
  const router = useRouter();
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // Get institute data - use profileData prop if available, fallback to user context
  const instituteData = {
    name: profileData?.organization_name || user?.institute_name || user?.company_name || "Training Institute",
    email: profileData?.email || user?.email || "institute@koluvu.com",
    avatar: profileData?.logo || user?.profile_picture || user?.logo || null,
    phone: profileData?.phone || user?.phone || null,
    website: profileData?.website || null,
  };

  // Sample notifications - Replace with actual API call
  useEffect(() => {
    const sampleNotifications = [
      {
        id: 1,
        type: "enrollment",
        title: "New Enrollment Request",
        message: "John Doe requested to enroll in Web Development Course",
        time: "5 minutes ago",
        read: false,
      },
      {
        id: 2,
        type: "message",
        title: "Student Message",
        message: "Sarah Williams sent you a message",
        time: "1 hour ago",
        read: false,
      },
      {
        id: 3,
        type: "subscription",
        title: "Subscription Expiry Alert",
        message: "Your premium plan will expire in 7 days",
        time: "2 hours ago",
        read: false,
      },
      {
        id: 4,
        type: "training",
        title: "Training Status Update",
        message: "Advanced Python course status changed to 'Published'",
        time: "1 day ago",
        read: true,
      },
    ];
    
    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter(n => !n.read).length);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "enrollment":
        return "👥";
      case "message":
        return "💬";
      case "subscription":
        return "⚠️";
      case "training":
        return "📚";
      default:
        return "🔔";
    }
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg w-full h-16">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        
        {/* Left Section - Page Title */}
        <div className="flex items-center gap-4">
          {showSidebarToggle && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-orange-700 transition-colors"
              aria-label="Toggle sidebar"
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
                  d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          )}
          
          <h1 className="text-lg md:text-xl font-semibold truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 rounded-lg hover:bg-orange-700 transition-colors"
              aria-label="Notifications"
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                {/* Header */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notifications ({unreadCount} unread)
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <svg
                        className="w-12 h-12 mx-auto mb-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.read ? "bg-orange-50" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center">
                  <Link
                    href="/training/notifications"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    onClick={() => setIsNotificationOpen(false)}
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-orange-700 transition-colors"
              aria-label="Profile menu"
            >
              {instituteData.avatar ? (
                <Image
                  src={instituteData.avatar}
                  alt={instituteData.name}
                  width={36}
                  height={36}
                  className="rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-orange-700 border-2 border-white flex items-center justify-center">
                  <span className="text-sm font-semibold">
                    {instituteData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <svg
                className={`w-4 h-4 transition-transform hidden md:block ${
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

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                
                {/* Section 1 - Institute Identity */}
                <div className="px-4 py-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    {instituteData.avatar ? (
                      <Image
                        src={instituteData.avatar}
                        alt={instituteData.name}
                        width={48}
                        height={48}
                        className="rounded-full border-2 border-orange-300"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center">
                        <span className="text-lg font-semibold">
                          {instituteData.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {instituteData.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {instituteData.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 2 - Navigation */}
                <div className="py-2 border-b border-gray-200">
                  <Link
                    href="/training/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Dashboard</span>
                  </Link>
                  
                  <Link
                    href="/training/institute-profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>Institute Profile</span>
                  </Link>
                  
                  <Link
                    href="/training/account-settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Account Settings</span>
                  </Link>
                  
                  <Link
                    href="/training/subscription"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Subscription / Billing</span>
                  </Link>
                </div>

                {/* Section 3 - Support */}
                <div className="py-2 border-b border-gray-200">
                  <Link
                    href="/help-center"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Help Center</span>
                  </Link>
                  
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Contact Support</span>
                  </Link>
                  
                  <Link
                    href="/legal/terms"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Terms & Privacy</span>
                  </Link>
                </div>

                {/* Section 4 - Exit */}
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TrainingHeader;
