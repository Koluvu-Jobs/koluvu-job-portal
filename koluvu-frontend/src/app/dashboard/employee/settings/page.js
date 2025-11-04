"use client";

import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  User,
  Briefcase,
  Bell,
  Shield,
  FileText,
  CreditCard,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { NotificationContext } from "@/contexts/NotificationContext";

// Import setting components
import ProfileSettings from "./components/ProfileSettings";
import JobPreferencesSettings from "./components/JobPreferencesSettings";
import NotificationSettings from "./components/NotificationSettings";
import PrivacySettings from "./components/PrivacySettings";
import ApplicationSettings from "./components/ApplicationSettings";
import ResumeSettings from "./components/ResumeSettings";

const EmployeeSettingsPage = () => {
  const { subscribe, unsubscribe } = useContext(NotificationContext) || {};
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });

  const tabs = [
    {
      id: "profile",
      label: "Profile Settings",
      icon: User,
      description: "Personal information and profile visibility",
    },
    {
      id: "job-preferences",
      label: "Job Preferences",
      icon: Briefcase,
      description: "Job alerts and search preferences",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Email, push, and SMS preferences",
    },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: Shield,
      description: "Account security and privacy settings",
    },
    {
      id: "applications",
      label: "Applications",
      icon: FileText,
      description: "Application tracking and management",
    },
    {
      id: "resume",
      label: "Resume",
      icon: CreditCard,
      description: "Resume templates and settings",
    },
  ];

  // Load initial settings
  useEffect(() => {
    loadSettings();
  }, []);

  // Set up real-time settings sync
  useEffect(() => {
    if (subscribe) {
      const unsubscribeCallback = subscribe(
        "employee-settings-update",
        handleRealTimeUpdate
      );
      return () => {
        if (unsubscribeCallback) unsubscribeCallback();
      };
    }
  }, [subscribe]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/employee/settings");
      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
      } else {
        showNotification("error", "Failed to load settings");
      }
    } catch (error) {
      console.error("Settings load error:", error);
      showNotification("error", "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleRealTimeUpdate = (data) => {
    if (data.type === "settings-update" && data.section) {
      setSettings((prev) => ({
        ...prev,
        ...data.data,
      }));
      showNotification("info", `${data.section} settings updated in real-time`);
    }
  };

  const handleSettingsChange = (section, newData) => {
    setSettings((prev) => ({
      ...prev,
      ...newData,
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = async (sectionData = null, section = null) => {
    try {
      setSaving(true);

      const endpoint = section
        ? `/api/employee/settings/${section}`
        : "/api/employee/settings";
      const dataToSave = sectionData || settings;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });

      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
        setHasChanges(false);
        showNotification(
          "success",
          section
            ? `${section} settings saved successfully`
            : "Settings saved successfully"
        );
      } else {
        showNotification("error", "Failed to save settings");
      }
    } catch (error) {
      console.error("Settings save error:", error);
      showNotification("error", "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = async () => {
    if (
      !confirm("Are you sure you want to reset all settings to default values?")
    ) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/employee/settings/reset", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
        setHasChanges(false);
        showNotification("success", "Settings reset to default values");
      } else {
        showNotification("error", "Failed to reset settings");
      }
    } catch (error) {
      console.error("Settings reset error:", error);
      showNotification("error", "Failed to reset settings");
    } finally {
      setSaving(false);
    }
  };

  const handleExportSettings = async () => {
    try {
      const response = await fetch("/api/employee/settings/export");
      const data = await response.json();

      if (data.success) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `employee-settings-${
          new Date().toISOString().split("T")[0]
        }.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification("success", "Settings exported successfully");
      } else {
        showNotification("error", "Failed to export settings");
      }
    } catch (error) {
      console.error("Settings export error:", error);
      showNotification("error", "Failed to export settings");
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: "", message: "" }), 5000);
  };

  const renderTabContent = () => {
    if (!settings) return null;

    const commonProps = {
      settings,
      onChange: handleSettingsChange,
      onSave: handleSaveSettings,
      isSaving: saving,
    };

    switch (activeTab) {
      case "profile":
        return <ProfileSettings {...commonProps} />;
      case "job-preferences":
        return <JobPreferencesSettings {...commonProps} />;
      case "notifications":
        return <NotificationSettings {...commonProps} />;
      case "privacy":
        return <PrivacySettings {...commonProps} />;
      case "applications":
        return <ApplicationSettings {...commonProps} />;
      case "resume":
        return <ResumeSettings {...commonProps} />;
      default:
        return <ProfileSettings {...commonProps} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Employee Settings
                </h1>
                <p className="text-gray-600">
                  Manage your account preferences and job search settings
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleExportSettings}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>

              <button
                onClick={handleResetSettings}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={saving}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${saving ? "animate-spin" : ""}`}
                />
                Reset
              </button>

              {hasChanges && (
                <button
                  onClick={() => handleSaveSettings()}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <Save
                    className={`w-4 h-4 mr-2 ${saving ? "animate-spin" : ""}`}
                  />
                  {saving ? "Saving..." : "Save All Changes"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification.message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 right-4 z-50"
          >
            <div
              className={`px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 ${
                notification.type === "success"
                  ? "bg-green-500 text-white"
                  : notification.type === "error"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : notification.type === "error" ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
              <span>{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4 mb-8 lg:mb-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-sm text-gray-500">
                          {tab.description}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSettingsPage;
