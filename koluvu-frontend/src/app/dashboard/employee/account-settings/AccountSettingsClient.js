// src/app/main/dashboard/employee/account-settings/page.js

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
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
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = (newTheme) => {
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

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
      router.push("/");
    }
  };

  const tabs = [
    { key: "profile", label: "Profile", icon: <FiUser className="mr-2" /> },
    { key: "password", label: "Password", icon: <FiLock className="mr-2" /> },
    {
      key: "notifications",
      label: "Notifications",
      icon: <FiBell className="mr-2" />,
    },
    { key: "security", label: "Security", icon: <FiShield className="mr-2" /> },
    {
      key: "danger",
      label: "Danger Zone",
      icon: <FiTrash2 className="mr-2" />,
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Header />

      <div className="flex flex-1">
        <Sidebar
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-8 lg:ml-6">
          <div
            className={`rounded-xl shadow-sm ${
              isDarkMode
                ? "bg-gray-800 text-gray-100"
                : "bg-white text-gray-800"
            }`}
          >
            <div className="p-4 md:p-6">
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

              {/* Tab Navigation */}
              <div className="mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-3 py-3 rounded-lg flex items-center justify-center text-sm md:text-base transition-colors ${
                        activeTab === tab.key
                          ? tab.key === "danger"
                            ? "bg-red-600 text-white font-medium"
                            : isDarkMode
                            ? "bg-blue-600 text-white font-medium"
                            : "bg-blue-50 text-blue-600 font-medium"
                          : isDarkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
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
                    <div
                      className={`p-4 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-blue-50"
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <FiUser className="mr-2" /> Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-1.5 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              isDarkMode
                                ? "bg-gray-700 text-white border-gray-600"
                                : "border-gray-300"
                            }`}
                            required
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <FiMail className="mr-2" /> Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-1.5 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              isDarkMode
                                ? "bg-gray-700 text-white border-gray-600"
                                : "border-gray-300"
                            }`}
                            required
                          />
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <FiPhone className="mr-2" /> Phone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-1.5 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              isDarkMode
                                ? "bg-gray-700 text-white border-gray-600"
                                : "border-gray-300"
                            }`}
                          />
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <FiMapPin className="mr-2" /> Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-1.5 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              isDarkMode
                                ? "bg-gray-700 text-white border-gray-600"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* other tabs (password, notifications, security, danger zone) — keep as is with same corrections */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
