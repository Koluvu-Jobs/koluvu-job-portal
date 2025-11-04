// src/pages/Dashboard/Employer/Settings/page.js

"use client";

import React, { useState, useEffect } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import ProfileSettings from "./components/ProfileSettings";
import NotificationSettings from "./components/NotificationSettings";
import SecuritySettings from "./components/SecuritySettings";
import PrivacySettings from "./components/PrivacySettings";
import DashboardSettings from "./components/DashboardSettings";
import IntegrationSettings from "./components/IntegrationSettings";
import BillingSettings from "./components/BillingSettings";
import {
  Settings,
  User,
  Bell,
  Shield,
  Eye,
  Layout,
  Link,
  CreditCard,
  Download,
  RotateCcw,
  ChevronRight,
} from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { connectionStatus, subscribe, unsubscribe } = useNotifications();

  // Settings tabs configuration
  const settingsTabs = [
    {
      id: "profile",
      name: "Profile",
      icon: User,
      description: "Personal and company information",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: Bell,
      description: "Email, push, and in-app notifications",
    },
    {
      id: "security",
      name: "Security",
      icon: Shield,
      description: "Password, 2FA, and login settings",
    },
    {
      id: "privacy",
      name: "Privacy",
      icon: Eye,
      description: "Data sharing and visibility",
    },
    {
      id: "dashboard",
      name: "Dashboard",
      icon: Layout,
      description: "Theme, layout, and preferences",
    },
    {
      id: "integrations",
      name: "Integrations",
      icon: Link,
      description: "Third-party apps and services",
    },
    {
      id: "billing",
      name: "Billing",
      icon: CreditCard,
      description: "Subscription and payment settings",
    },
  ];

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Set up real-time settings sync
  useEffect(() => {
    if (subscribe) {
      const unsubscribeCallback = subscribe('employer-settings-update', handleRealTimeUpdate);
      return () => {
        if (unsubscribeCallback) unsubscribeCallback();
      };
    }
  }, [subscribe]);

  const handleRealTimeUpdate = (data) => {
    if (data.type === 'settings-update') {
      console.log('Real-time settings update received:', data);
      
      // Update settings with new data
      if (data.data) {
        setSettings(prev => ({
          ...prev,
          ...data.data
        }));
        
        // Show notification that settings were updated in real-time
        if (data.section) {
          console.log(`${data.section} settings updated in real-time`);
        } else {
          console.log('Settings updated in real-time');
        }
      }
    }
  };

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/employer/settings");
      if (!response.ok) throw new Error("Failed to load settings");

      const data = await response.json();
      setSettings(data);
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (sectionData, section = null) => {
    try {
      setIsSaving(true);

      const url = section
        ? `/api/employer/settings/${section}`
        : "/api/employer/settings";
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) throw new Error("Failed to update settings");

      const updatedData = await response.json();

      if (section) {
        // Update specific section
        setSettings((prev) => ({
          ...prev,
          ...updatedData.data,
        }));
      } else {
        // Full settings update
        setSettings(updatedData.settings || updatedData);
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);

      // Show success message
      setTimeout(() => {
        // Could add toast notification here
      }, 100);
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = async () => {
    if (
      !confirm(
        "Are you sure you want to reset all settings to default values? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch("/api/employer/settings/reset", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to reset settings");

      const data = await response.json();
      setSettings(data.settings);
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error resetting settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `employer-settings-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleTabChange = (tabId) => {
    if (
      hasUnsavedChanges &&
      !confirm(
        "You have unsaved changes. Are you sure you want to switch tabs?"
      )
    ) {
      return;
    }
    setActiveTab(tabId);
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasUnsavedChanges(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <Settings className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500">
                  Manage your account and application preferences
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Connection Status */}
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
                  connectionStatus === "connected"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === "connected"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span>
                  {connectionStatus === "connected"
                    ? "Real-time sync active"
                    : "Offline"}
                </span>
              </div>

              {/* Last Saved */}
              {lastSaved && (
                <div className="text-xs text-gray-500">
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}

              {/* Action Buttons */}
              <button
                onClick={exportSettings}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>

              <button
                onClick={resetSettings}
                className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
                        isActive
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    <div className="text-left">
                      <div className="font-medium">{tab.name}</div>
                      <div className="text-xs text-gray-500">
                        {tab.description}
                      </div>
                    </div>
                    <ChevronRight
                      className={`ml-auto h-4 w-4 ${
                        isActive ? "text-blue-500" : "text-gray-400"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <div className="bg-white shadow rounded-lg">
              {/* Tab Content */}
              {activeTab === "profile" && (
                <ProfileSettings
                  settings={settings}
                  onChange={handleSettingChange}
                  onSave={(data) => updateSettings(data, "profile")}
                  isSaving={isSaving}
                />
              )}

              {activeTab === "notifications" && (
                <NotificationSettings
                  settings={settings}
                  onChange={handleSettingChange}
                  onSave={(data) => updateSettings(data, "notifications")}
                  isSaving={isSaving}
                />
              )}

              {activeTab === "security" && (
                <SecuritySettings
                  settings={settings}
                  onChange={handleSettingChange}
                  onSave={(data) => updateSettings(data, "security")}
                  isSaving={isSaving}
                />
              )}

              {activeTab === "privacy" && (
                <PrivacySettings
                  settings={settings}
                  onChange={handleSettingChange}
                  onSave={(data) => updateSettings(data, "privacy")}
                  isSaving={isSaving}
                />
              )}

              {activeTab === "dashboard" && (
                <DashboardSettings
                  settings={settings}
                  onChange={handleSettingChange}
                  onSave={(data) => updateSettings(data, "dashboard")}
                  isSaving={isSaving}
                />
              )}

              {activeTab === "integrations" && (
                <IntegrationSettings
                  settings={settings}
                  onChange={handleSettingChange}
                  onSave={(data) => updateSettings(data, "integrations")}
                  isSaving={isSaving}
                />
              )}

              {activeTab === "billing" && (
                <BillingSettings
                  settings={settings}
                  onChange={handleSettingChange}
                  onSave={(data) => updateSettings(data, "billing")}
                  isSaving={isSaving}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
