"use client";

import { useState, useRef, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { BellIcon as BellIconSolid } from "@heroicons/react/24/solid";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { buildJobUrl } from "@/utils/jobUrls";

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-500";
      case "connecting":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_job":
        return "💼";
      case "new_application":
        return "📝";
      case "interview":
        return "👥";
      case "system":
        return "🔔";
      default:
        return "📢";
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Handle navigation based on notification type
    switch (notification.type) {
      case "new_job":
        if (notification.job_data) {
          const jobUrl = buildJobUrl(notification.job_data);
          window.location.href = jobUrl;
        }
        break;
      case "new_application":
        if (notification.application_data?.id) {
          window.location.href = `/dashboard/employer/applications`;
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
      >
        {unreadCount > 0 ? (
          <BellIconSolid className="h-6 w-6" />
        ) : (
          <BellIcon className="h-6 w-6" />
        )}

        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        <span
          className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${getConnectionStatusColor()}`}
        />
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className="fixed sm:absolute right-0 sm:right-0 top-[64px] sm:top-auto sm:mt-2 w-full sm:w-96 max-w-md origin-top-right rounded-none sm:rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-300 ease-out backdrop-blur-sm z-50 max-h-[calc(100vh-64px)] sm:max-h-96 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div className="p-4 sm:p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({unreadCount} unread)
                  </span>
                )}
              </h3>
            </div>
            <div className="flex space-x-3 ml-3">
              <button
                onClick={markAllAsRead}
                className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-blue-200 hover:border-blue-300"
                disabled={unreadCount === 0}
              >
                Mark all read
              </button>
              <button
                onClick={clearAll}
                className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 hover:border-red-300"
                disabled={notifications.length === 0}
              >
                Clear all
              </button>
            </div>
          </div>

          {/* Connection Status */}
          <div className="px-3 sm:px-4 py-2 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center text-xs sm:text-sm">
              <span
                className={`h-2 w-2 rounded-full mr-2 ${getConnectionStatusColor()}`}
              />
              <span className="text-gray-600">
                Connection: {connectionStatus}
              </span>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-64">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <BellIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm sm:text-base">No notifications yet</p>
                <p className="text-xs sm:text-sm">
                  You'll see new notifications here
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs sm:text-sm ${
                          !notification.read
                            ? "font-semibold text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {notification.message}
                      </p>
                      {notification.from_user && (
                        <p className="text-xs text-gray-500 mt-1">
                          From:{" "}
                          {notification.from_user.name ||
                            notification.from_user.email}
                        </p>
                      )}
                      {notification.job_data && (
                        <div className="text-xs text-gray-600 mt-1">
                          <p>Company: {notification.job_data.company}</p>
                          <p>Location: {notification.job_data.location}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.timestamp), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 5 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-800">
                View all notifications
              </button>
            </div>
          )}

          {/* Mobile Close Button */}
          <div className="sm:hidden p-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
