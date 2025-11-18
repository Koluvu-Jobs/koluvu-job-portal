// src/app/dashboard/employee/account-settings/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiLock,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShield,
  FiBell,
  FiTrash2,
  FiDownload,
} from "react-icons/fi";

export default function AccountSettings({ user = {} }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: true,
    newsletter: true,
    twoFactor: false,
  });
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Settings saved successfully!");
  };

  const handleDeleteAccount = () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (userConfirmed) {
      console.log("Account deletion confirmed by user.");
      router.push("/");
    } else {
      console.log("Account deletion cancelled by user.");
    }
  };

  const tabs = [
    {
      key: "profile",
      label: "Profile",
      icon: <FiUser className="mr-2" />,
      color: "bg-blue-50 text-blue-700 border-blue-100",
      activeColor: "bg-blue-100 text-blue-800 border-blue-200",
    },
    {
      key: "password",
      label: "Password",
      icon: <FiLock className="mr-2" />,
      color: "bg-green-50 text-green-700 border-green-100",
      activeColor: "bg-green-100 text-green-800 border-green-200",
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: <FiBell className="mr-2" />,
      color: "bg-purple-50 text-purple-700 border-purple-100",
      activeColor: "bg-purple-100 text-purple-800 border-purple-200",
    },
    {
      key: "security",
      label: "Security",
      icon: <FiShield className="mr-2" />,
      color: "bg-amber-50 text-amber-700 border-amber-100",
      activeColor: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      key: "danger",
      label: "Danger Zone",
      icon: <FiTrash2 className="mr-2" />,
      color: "bg-red-50 text-red-700 border-red-100",
      activeColor: "bg-red-100 text-red-800 border-red-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="rounded-xl shadow-sm bg-white text-gray-800">
          <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-3 py-3 rounded-lg transition-all flex items-center justify-center text-sm md:text-base border ${
                      activeTab === tab.key
                        ? `${tab.activeColor} font-medium border-opacity-70 shadow-sm`
                        : `${tab.color} border-gray-200`
                    }`}
                  >
                    {tab.icon}
                    <span className="ml-1 md:ml-2">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="mt-6">
              {activeTab === "profile" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center">
                        <FiUser className="mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center">
                        <FiMail className="mr-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center">
                        <FiPhone className="mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center">
                        <FiMapPin className="mr-2" />
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "password" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center">
                        <FiLock className="mr-2" />
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center">
                        <FiLock className="mr-2" />
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center">
                        <FiLock className="mr-2" />
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "notifications" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 rounded-md bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <FiBell className="mr-2" />
                            Email Notifications
                          </label>
                          <p className="text-xs text-gray-600">
                            Receive important notifications
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="notifications"
                            checked={formData.notifications}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 peer-focus:ring-2 peer-focus:ring-blue-300 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 rounded-md bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <FiMail className="mr-2" />
                            Newsletter
                          </label>
                          <p className="text-xs text-gray-600">
                            Receive monthly updates
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="newsletter"
                            checked={formData.newsletter}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 peer-focus:ring-2 peer-focus:ring-blue-300 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm"
                    >
                      Save Preferences
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "security" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 rounded-md bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <FiShield className="mr-2" />2 FA Authentication
                          </label>
                          <p className="text-xs text-gray-600">
                            Extra security layer
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="twoFactor"
                            checked={formData.twoFactor}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-amber-600 peer-focus:ring-2 peer-focus:ring-blue-300 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                    </div>

                    {formData.twoFactor && (
                      <div className="p-4 rounded-md bg-gray-50">
                        <label className="block text-sm font-medium mb-1">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="6-digit code"
                        />
                      </div>
                    )}
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm"
                    >
                      Update Security
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "danger" && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 rounded-md bg-red-50 border border-red-200">
                    <h3 className="font-medium text-sm mb-1 flex items-center">
                      <FiTrash2 className="mr-2" />
                      Delete Account
                    </h3>
                    <p className="text-xs mb-3 text-red-600">
                      This action cannot be undone
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete Account
                    </button>
                  </div>

                  <div className="p-4 rounded-md bg-gray-50 border border-gray-200">
                    <h3 className="font-medium text-sm mb-1 flex items-center">
                      <FiDownload className="mr-2" />
                      Export Data
                    </h3>
                    <p className="text-xs mb-3 text-gray-600">
                      Download all your data
                    </p>
                    <button className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm">
                      Export Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
