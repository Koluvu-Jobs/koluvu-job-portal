"use client";

import React, { useState, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Bell,
  BellOff,
  Settings,
  Check,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";

const NotificationSettings = ({ className = "" }) => {
  const {
    getNotificationPermission,
    requestNotificationPermission,
    resetNotificationPreferences,
    connectionStatus,
  } = useNotifications();

  const [permission, setPermission] = useState("default");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, [getNotificationPermission]);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const granted = await requestNotificationPermission(true); // Force ask
      setPermission(granted ? "granted" : "denied");
    } catch (error) {
      console.error("Error enabling notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPreferences = () => {
    resetNotificationPreferences();
    setPermission(getNotificationPermission());
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case "granted":
        return {
          icon: <Check className="w-5 h-5 text-green-500" />,
          text: "Enabled",
          description: "You'll receive real-time notifications",
          color: "text-green-700",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "denied":
        return {
          icon: <X className="w-5 h-5 text-red-500" />,
          text: "Blocked",
          description: "Notifications are blocked in your browser",
          color: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "default":
        return {
          icon: <Bell className="w-5 h-5 text-yellow-500" />,
          text: "Not Set",
          description: "Click to enable real-time notifications",
          color: "text-yellow-700",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "unsupported":
        return {
          icon: <AlertTriangle className="w-5 h-5 text-gray-500" />,
          text: "Unsupported",
          description: "Your browser doesn't support notifications",
          color: "text-gray-700",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-blue-500" />,
          text: "Unknown",
          description: "Unknown notification status",
          color: "text-blue-700",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
    }
  };

  const getConnectionStatus = () => {
    switch (connectionStatus) {
      case "connected":
        return {
          icon: (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          ),
          text: "Connected",
          color: "text-green-600",
        };
      case "connecting":
        return {
          icon: (
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
          ),
          text: "Connecting...",
          color: "text-yellow-600",
        };
      case "error":
        return {
          icon: <div className="w-2 h-2 bg-red-500 rounded-full" />,
          text: "Error",
          color: "text-red-600",
        };
      default:
        return {
          icon: <div className="w-2 h-2 bg-gray-400 rounded-full" />,
          text: "Disconnected",
          color: "text-gray-600",
        };
    }
  };

  const status = getPermissionStatus();
  const connection = getConnectionStatus();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Notification Permission Status */}
      <div
        className={`p-4 rounded-lg border ${status.bgColor} ${status.borderColor}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {status.icon}
            <div>
              <h3 className={`font-medium ${status.color}`}>
                Browser Notifications: {status.text}
              </h3>
              <p className={`text-sm ${status.color} opacity-75`}>
                {status.description}
              </p>
            </div>
          </div>

          {permission === "default" && (
            <button
              onClick={handleEnableNotifications}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enabling...</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Enable</span>
                </>
              )}
            </button>
          )}

          {permission === "denied" && (
            <div className="text-sm text-gray-600">
              <p>To enable notifications:</p>
              <ol className="list-decimal list-inside text-xs mt-1 space-y-1">
                <li>Click the lock icon in your address bar</li>
                <li>Set notifications to "Allow"</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Connection Status */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {connection.icon}
            <div>
              <h3 className="font-medium text-gray-900">
                Real-time Connection:{" "}
                <span className={connection.color}>{connection.text}</span>
              </h3>
              <p className="text-sm text-gray-600">
                {connectionStatus === "connected"
                  ? "Receiving live updates"
                  : "Live updates unavailable"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Tools (only show in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Developer Tools</span>
          </h3>
          <div className="space-y-2">
            <button
              onClick={handleResetPreferences}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Reset Notification Preferences
            </button>
            <div className="text-xs text-gray-500">
              <p>Permission: {permission}</p>
              <p>Connection: {connectionStatus}</p>
              <p>
                Asked before:{" "}
                {localStorage.getItem("koluvu_notification_asked") || "false"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
