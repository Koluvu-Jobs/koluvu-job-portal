// src/app/training/account-settings/page.js
"use client";

import { useState } from "react";

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState("security");
  const [showPassword, setShowPassword] = useState(false);
  
  // Security settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);
  
  // Preferences
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("en");
  
  // Notifications
  const [emailNotifications, setEmailNotifications] = useState({
    enrollments: true,
    messages: true,
    updates: false,
    marketing: false,
  });
  
  const [dashboardNotifications, setDashboardNotifications] = useState({
    enrollments: true,
    messages: true,
    statusUpdates: true,
    subscriptionAlerts: true,
  });

  const tabs = [
    { id: "security", label: "Security", icon: "🔒" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ];

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // API call to change password
    console.log("Changing password...");
    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleVerifyEmail = () => {
    // API call to send verification email
    console.log("Sending verification email...");
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    // API call to enable/disable 2FA
    console.log("Toggling 2FA:", !twoFactorEnabled);
  };

  const handleSavePreferences = () => {
    // API call to save preferences
    console.log("Saving preferences:", { theme, language });
  };

  const handleSaveNotifications = () => {
    // API call to save notification settings
    console.log("Saving notifications:", { emailNotifications, dashboardNotifications });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your security, preferences, and notification settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors flex-1 justify-center ${
                    activeTab === tab.id
                      ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            
            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-8">
                
                {/* Change Password */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum 8 characters, include uppercase, lowercase, and numbers
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="showPassword"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <label htmlFor="showPassword" className="text-sm text-gray-700">
                        Show passwords
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Email Verification */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Verification</h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {emailVerified ? (
                        <>
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email Verified</p>
                            <p className="text-sm text-gray-600">Your email address has been verified</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Email Not Verified</p>
                            <p className="text-sm text-gray-600">Please verify your email address</p>
                          </div>
                        </>
                      )}
                    </div>
                    {!emailVerified && (
                      <button
                        onClick={handleVerifyEmail}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                      >
                        Verify Email
                      </button>
                    )}
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Two-Factor Authentication</h2>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Enable Two-Factor Authentication
                      </p>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account (Coming Soon)
                      </p>
                    </div>
                    <button
                      onClick={handleToggle2FA}
                      disabled
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                        twoFactorEnabled ? "bg-orange-600" : "bg-gray-300"
                      } opacity-50 cursor-not-allowed`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          twoFactorEnabled ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-blue-800">
                        Two-factor authentication will be available in the next update. 
                        You'll be able to secure your account using authenticator apps or SMS codes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-8">
                
                {/* Theme Settings */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Theme</h2>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Choose your preferred theme for the dashboard</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setTheme("light")}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          theme === "light"
                            ? "border-orange-600 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-lg border border-gray-300 flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">Light Mode</p>
                            <p className="text-sm text-gray-600">Easy on the eyes during daytime</p>
                          </div>
                          {theme === "light" && (
                            <svg className="w-5 h-5 text-orange-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                      </button>

                      <button
                        onClick={() => setTheme("dark")}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          theme === "dark"
                            ? "border-orange-600 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">Dark Mode</p>
                            <p className="text-sm text-gray-600">Reduces eye strain at night</p>
                          </div>
                          {theme === "dark" && (
                            <svg className="w-5 h-5 text-orange-600 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                      </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-blue-800">
                          Dark mode is coming soon! Currently, only light mode is available.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Language Settings */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Language</h2>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Select your preferred language</p>
                    
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="hi" disabled>Hindi (Coming Soon)</option>
                      <option value="te" disabled>Telugu (Coming Soon)</option>
                      <option value="ta" disabled>Tamil (Coming Soon)</option>
                      <option value="kn" disabled>Kannada (Coming Soon)</option>
                    </select>

                    <p className="text-xs text-gray-500">
                      Multi-language support will be available in future updates
                    </p>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-8">
                
                {/* Email Notifications */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Notifications</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Choose what notifications you want to receive via email
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">New Enrollments</p>
                        <p className="text-xs text-gray-600">Get notified when students enroll in your courses</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifications({...emailNotifications, enrollments: !emailNotifications.enrollments})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                          emailNotifications.enrollments ? "bg-orange-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailNotifications.enrollments ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Student Messages</p>
                        <p className="text-xs text-gray-600">Get notified when students send you messages</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifications({...emailNotifications, messages: !emailNotifications.messages})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                          emailNotifications.messages ? "bg-orange-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailNotifications.messages ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Platform Updates</p>
                        <p className="text-xs text-gray-600">Receive updates about new features and improvements</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifications({...emailNotifications, updates: !emailNotifications.updates})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                          emailNotifications.updates ? "bg-orange-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailNotifications.updates ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Marketing & Promotions</p>
                        <p className="text-xs text-gray-600">Receive promotional offers and marketing emails</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifications({...emailNotifications, marketing: !emailNotifications.marketing})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                          emailNotifications.marketing ? "bg-orange-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailNotifications.marketing ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dashboard Notifications */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Notifications</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Manage in-app notifications that appear in your dashboard
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Enrollment Requests</p>
                        <p className="text-xs text-gray-600">Show notifications for new enrollment requests</p>
                      </div>
                      <button
                        onClick={() => setDashboardNotifications({...dashboardNotifications, enrollments: !dashboardNotifications.enrollments})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                          dashboardNotifications.enrollments ? "bg-orange-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            dashboardNotifications.enrollments ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Messages</p>
                        <p className="text-xs text-gray-600">Show notifications for new messages</p>
                      </div>
                      <button
                        onClick={() => setDashboardNotifications({...dashboardNotifications, messages: !dashboardNotifications.messages})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                          dashboardNotifications.messages ? "bg-orange-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            dashboardNotifications.messages ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Training Status Updates</p>
                        <p className="text-xs text-gray-600">Show notifications when training status changes</p>
                      </div>
                      <button
                        onClick={() => setDashboardNotifications({...dashboardNotifications, statusUpdates: !dashboardNotifications.statusUpdates})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                          dashboardNotifications.statusUpdates ? "bg-orange-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            dashboardNotifications.statusUpdates ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Subscription Alerts</p>
                        <p className="text-xs text-gray-600">Show notifications about subscription and billing</p>
                      </div>
                      <button
                        onClick={() => setDashboardNotifications({...dashboardNotifications, subscriptionAlerts: !dashboardNotifications.subscriptionAlerts})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                          dashboardNotifications.subscriptionAlerts ? "bg-orange-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            dashboardNotifications.subscriptionAlerts ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotifications}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Save Notification Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
