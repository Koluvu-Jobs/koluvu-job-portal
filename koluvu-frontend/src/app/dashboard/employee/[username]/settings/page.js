//src/app/dashboard/employee/[username]/settings/page.js

"use client";

import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
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
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { NotificationContext } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";

// Import setting components
import ProfileSettings from "../../settings/components/ProfileSettings";
import JobPreferencesSettings from "../../settings/components/JobPreferencesSettings";
import NotificationSettings from "../../settings/components/NotificationSettings";
import PrivacySettings from "../../settings/components/PrivacySettings";
import ApplicationSettings from "../../settings/components/ApplicationSettings";
import ResumeSettings from "../../settings/components/ResumeSettings";

const EmployeeSettingsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { subscribe } = useContext(NotificationContext) || {};
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [showMobileNav, setShowMobileNav] = useState(true);

  const username = params.username;

  // Auth check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login/employee");
      return;
    }
  }, [authLoading, isAuthenticated, router]);

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
    if (isAuthenticated) {
      loadSettings();
    }
  }, [isAuthenticated]);

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
      
      if (!response.ok) {
        // If API fails, use default settings
        console.warn("Settings API failed, using defaults");
        setSettings({
          display_name: "",
          bio: "",
          phone_number: "",
          location: "",
          linkedin_url: "",
          github_url: "",
          portfolio_url: "",
          website_url: "",
          skills: "",
          experience_level: "entry",
          education_level: "bachelor",
          show_profile_publicly: false,
          allow_profile_download: false,
        });
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
      } else {
        showNotification("error", "Failed to load settings");
        // Set default settings even on error
        setSettings({
          display_name: "",
          bio: "",
          phone_number: "",
          location: "",
          linkedin_url: "",
          github_url: "",
          portfolio_url: "",
          website_url: "",
          skills: "",
          experience_level: "entry",
          education_level: "bachelor",
          show_profile_publicly: false,
          allow_profile_download: false,
        });
      }
    } catch (error) {
      console.error("Settings load error:", error);
      showNotification("error", "Failed to load settings");
      // Set default settings on exception
      setSettings({
        display_name: "",
        bio: "",
        phone_number: "",
        location: "",
        linkedin_url: "",
        github_url: "",
        portfolio_url: "",
        website_url: "",
        skills: "",
        experience_level: "entry",
        education_level: "bachelor",
        show_profile_publicly: false,
        allow_profile_download: false,
      });
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
    if (!settings) {
      return (
        <div className="p-8 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      );
    }

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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 py-3 sm:py-4 md:py-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <Settings className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                  Employee Settings
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  Manage your account preferences
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handleExportSettings}
                className="inline-flex items-center justify-center px-3 py-2 sm:px-4 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors shadow-sm"
                title="Export Settings"
              >
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                onClick={handleResetSettings}
                className="inline-flex items-center justify-center px-3 py-2 sm:px-4 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-50 transition-colors shadow-sm"
                disabled={saving}
                title="Reset Settings"
              >
                <RefreshCw
                  className={`w-4 h-4 sm:mr-2 ${saving ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Reset</span>
              </button>

              {hasChanges && (
                <button
                  onClick={() => handleSaveSettings()}
                  disabled={saving}
                  className="inline-flex items-center justify-center px-3 py-2 sm:px-4 border border-transparent rounded-md text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-sm"
                  title="Save Changes"
                >
                  <Save
                    className={`w-4 h-4 ${saving ? "animate-spin" : ""}  ${hasChanges ? "sm:mr-2" : ""}`}
                  />
                  <span className="hidden sm:inline">{saving ? "Saving..." : "Save Changes"}</span>
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
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-md mx-auto sm:mx-0"
          >
            <div
              className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
                notification.type === "success"
                  ? "bg-green-500 text-white"
                  : notification.type === "error"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : notification.type === "error" ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <Bell className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col lg:flex-row lg:gap-6 xl:gap-8 gap-5">
          {/* Sidebar Navigation - Hidden on mobile when content is shown */}
          <div className={`w-full lg:w-1/4 xl:w-1/5 ${showMobileNav ? 'block' : 'hidden lg:block'}`}>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowMobileNav(false);
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left px-3 py-3 sm:px-4 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 ${
                          isActive ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{tab.label}</div>
                        <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {tab.description}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Main Content - Hidden on mobile when nav is shown */}
          <div className={`flex-1 w-full lg:w-3/4 xl:w-4/5 min-w-0 ${showMobileNav ? 'hidden lg:block' : 'block'}`}>
            {/* Back button for mobile */}
            <button
              onClick={() => setShowMobileNav(true)}
              className="lg:hidden mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to menu
            </button>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full"
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
