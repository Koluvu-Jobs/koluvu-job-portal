// src/app/dashboard/employee/components/profile.js

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Edit3,
  Save,
  X,
  User,
  Award,
  BookOpen,
  Github,
  Linkedin,
  Globe,
  Twitter,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  FileText,
  PlusCircle,
  Bell,
  Inbox,
  MessageSquare,
  BriefcaseBusiness,
  GraduationCap,
  Code,
  Lightbulb,
  Flag,
  Smile,
  Share2,
  LayoutGrid,
  Search,
  Camera,
} from "lucide-react";

// Chat Component
const ChatBox = ({
  isDarkMode,
  show,
  onClose,
  title,
  icon: Icon,
  messages,
  onSendMessage,
  placeholder,
  className = "",
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 w-80 max-w-[90vw] rounded-lg shadow-xl z-50 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      } ${className}`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-bold flex items-center">
          <Icon className="w-5 h-5 mr-2" /> {title}
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="max-h-60 h-60 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 p-3 rounded-lg ${
              msg.sender === "user"
                ? isDarkMode
                  ? "bg-blue-700 text-white ml-8"
                  : "bg-blue-100 text-blue-900 ml-8"
                : isDarkMode
                ? "bg-gray-700 text-white mr-8"
                : "bg-gray-100 text-gray-900 mr-8"
            }`}
          >
            <p>{msg.text}</p>
            <p className="text-xs opacity-70 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className={`flex-grow p-2 rounded-l-md border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-white border-gray-300"
          }`}
        />
        <button
          onClick={handleSend}
          className={`px-3 rounded-r-md ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Main Profile Component
const Profile = ({ isDarkMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("profileActiveTab") || "careerObjective";
    }
    return "careerObjective";
  });

  // Profile data state
  const [profileData, setProfileData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      profileImage: null,
    },
    careerObjective: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: "",
      twitter: "",
    },
  });

  // Chat states
  const [showNotificationChat, setShowNotificationChat] = useState(false);
  const [showInboxChat, setShowInboxChat] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [inboxCount, setInboxCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [inboxMessages, setInboxMessages] = useState([]);

  // Backend API URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

  // Fetch profile data from backend
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No auth token found");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/employee/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        console.error("Failed to fetch profile data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Save profile data to backend
  const saveProfileData = async (updatedData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.log("No auth token found");
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/api/employee/profile/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        setProfileData(updatedData);
        return true;
      } else {
        console.error("Failed to save profile data:", response.status);
        return false;
      }
    } catch (error) {
      console.error("Error saving profile data:", error);
      return false;
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/notifications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setNotificationCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch inbox messages
  const fetchInboxMessages = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/inbox/messages/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInboxMessages(data.messages || []);
        setInboxCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error("Error fetching inbox messages:", error);
    }
  };

  // Send message
  const sendMessage = async (messageText, messageType = "inbox") => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const endpoint =
        messageType === "inbox"
          ? "/api/inbox/send/"
          : "/api/notifications/send/";

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        if (messageType === "inbox") {
          fetchInboxMessages();
        } else {
          fetchNotifications();
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchProfileData();
    fetchNotifications();
    fetchInboxMessages();

    // Set up periodic refresh for real-time updates
    const interval = setInterval(() => {
      fetchNotifications();
      fetchInboxMessages();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle tab changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("profileActiveTab", activeTab);
    }
  }, [activeTab]);

  // Handle profile save
  const handleSave = async () => {
    const success = await saveProfileData(profileData);
    if (success) {
      setIsEditing(false);
      // Show success message
    } else {
      // Show error message
    }
  };

  // Tab configuration
  const tabs = [
    { id: "careerObjective", label: "Career Objective", icon: Flag },
    { id: "skills", label: "Key Skills", icon: Code },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "projects", label: "Projects", icon: Lightbulb },
    { id: "certifications", label: "Certifications", icon: Award },
  ];

  return (
    <div
      className={`min-h-screen p-4 md:p-8 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1
              className={`text-3xl md:text-4xl font-extrabold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              My Profile
            </h1>
            <p
              className={`text-md ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Manage your professional profile information
            </p>
          </div>

          {/* Notification and Inbox buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotificationChat(true)}
              className={`relative p-3 rounded-full ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-900"
              } shadow-lg transition-all duration-200`}
            >
              <Bell className="w-6 h-6" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowInboxChat(true)}
              className={`relative p-3 rounded-full ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-white hover:bg-gray-100 text-gray-900"
              } shadow-lg transition-all duration-200`}
            >
              <Inbox className="w-6 h-6" />
              {inboxCount > 0 && (
                <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {inboxCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isEditing
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6`}
            >
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div
                    className={`w-24 h-24 rounded-full ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    } flex items-center justify-center mb-4 mx-auto`}
                  >
                    {profileData.personalInfo.profileImage ? (
                      <img
                        src={profileData.personalInfo.profileImage}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-semibold">
                  {profileData.personalInfo.firstName}{" "}
                  {profileData.personalInfo.lastName}
                </h3>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  {profileData.personalInfo.email}
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? isDarkMode
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6`}
            >
              {/* Content will be rendered based on activeTab */}
              <div className="min-h-[400px]">
                {activeTab === "careerObjective" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Career Objective
                    </h2>
                    {isEditing ? (
                      <textarea
                        value={profileData.careerObjective}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            careerObjective: e.target.value,
                          })
                        }
                        className={`w-full h-32 p-4 rounded-lg border ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300"
                        }`}
                        placeholder="Describe your career objectives..."
                      />
                    ) : (
                      <p
                        className={
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        {profileData.careerObjective ||
                          "No career objective set yet."}
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "skills" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Key Skills</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profileData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                        >
                          <span className="font-medium">{skill.name}</span>
                          <div className="mt-2 bg-gray-300 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <button className="mt-4 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Skill
                      </button>
                    )}
                  </div>
                )}

                {/* Add more tab content as needed */}
                {activeTab === "experience" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
                    <p
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Experience section content will be implemented here.
                    </p>
                  </div>
                )}

                {activeTab === "education" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Education</h2>
                    <p
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Education section content will be implemented here.
                    </p>
                  </div>
                )}

                {activeTab === "projects" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Projects</h2>
                    <p
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Projects section content will be implemented here.
                    </p>
                  </div>
                )}

                {activeTab === "certifications" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Certifications</h2>
                    <p
                      className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    >
                      Certifications section content will be implemented here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Popups */}
      <ChatBox
        isDarkMode={isDarkMode}
        show={showNotificationChat}
        onClose={() => setShowNotificationChat(false)}
        title="Notifications"
        icon={Bell}
        messages={notifications}
        onSendMessage={(message) => sendMessage(message, "notification")}
        placeholder="Type a notification..."
      />

      <ChatBox
        isDarkMode={isDarkMode}
        show={showInboxChat}
        onClose={() => setShowInboxChat(false)}
        title="Messages"
        icon={Inbox}
        messages={inboxMessages}
        onSendMessage={(message) => sendMessage(message, "inbox")}
        placeholder="Type your message..."
      />
    </div>
  );
};

export default Profile;
