//src/app/main/dashboard/training/page.js

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "./components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faEnvelope,
  faBars,
  faEnvelopeOpen,
} from "@fortawesome/free-solid-svg-icons";
import PostTrainingPage from "./PostTrainingPage";
import CoursesOfferedPage from "./CoursesOfferedPage";
import ActiveTrainingPostPage from "./ActiveTrainingPostPage";
import ExpiredTrainingPostPage from "./ExpiredTrainingPostPage";
import DraftTrainingPostPage from "./DraftTrainingPostPage";
import PlacementsPage from "./PlacementsPage";
import InternshipPage from "./InternshipPage";
import NotificationsPage from "./NotificationsPage";
import Sidebar from "./Sidebar";
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";
import InboxPage from "./InboxPage";
import AccountSettingsPage from "./AccountSettingsPage";
import ContactUsPage from "./ContactUsPage";
import LogoutPage from "./LogoutPage";
import BillingsPage from "./BillingsPage";
import AdvancedSearch from "./advancedsearch";
import KoluvuBusiness from "./koluvu-business.jsx";

// ---------------- Tab mapping ----------------
const tabToSlug = {
  Dashboard: "",
  "Post Training": "post",
  "Active Training post": "active",
  "Expired Training post": "expired",
  "Draft Training post": "draft",
  "Courses offered": "courses",
  "Advanced Search": "search",
  placements: "placements",
  internship: "internship",
  notifications: "notifications",
  inbox: "inbox",
  billings: "billings",
  "account settings": "account-settings",
  "contact us": "contact-us",
  logout: "logout",
};
const slugToTab = Object.fromEntries(
  Object.entries(tabToSlug).map(([k, v]) => [v, k])
);

const data = [
  { name: "Week 1", enrollments: 30 },
  { name: "Week 2", enrollments: 45 },
  { name: "Week 3", enrollments: 70 },
  { name: "Week 4", enrollments: 50 },
  { name: "Week 5", enrollments: 55 },
  { name: "Week 6", enrollments: 65 },
];

const DashboardContent = () => (
  <>
    {/* Stats Cards - Responsive Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">📄</span>
            <div>
              <p className="text-sm text-gray-500">Total Programs</p>
              <h3 className="text-xl font-bold">8</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-sm text-gray-500">Active Programs</p>
              <h3 className="text-xl font-bold">5</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">📊</span>
            <div>
              <p className="text-sm text-gray-500">Monthly Views</p>
              <h3 className="text-xl font-bold">3,200</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Chart and Notifications - Responsive Layout */}
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="lg:flex-1">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-3">Enrollments Trend</h2>
            <div className="h-60 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="enrollments"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications - Responsive Width */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-3">Recent Notifications</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-xl">📩</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    New Enrollment
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    You have a new enrollment request
                  </p>
                  <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">⚡</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    Subscription Alert
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Your subscription expires in 3 days
                  </p>
                  <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">💬</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    Student Message
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    New message from student
                  </p>
                  <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Recent Activities - Responsive Card */}
    <div className="mt-6">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Activities</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="text-xl">📩</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">
                  New Enrollment
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  You have a new enrollment request
                </p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">
                  Subscription Alert
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Your subscription expires in 3 days
                </p>
                <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </>
);

// Sample messages data for the dropdown
const recentMessages = [
  {
    id: 1,
    sender: "John Smith",
    subject: "Regarding Course Enrollment",
    preview:
      "I came across it on your website and it seems like exactly what I'm looking for...",
    time: "10:30 AM",
    unread: true,
  },
  {
    id: 2,
    sender: "Sarah Johnson",
    subject: "Payment Confirmation",
    preview: "Thank you for your prompt processing of my payment...",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    sender: "Training Department",
    subject: "New Course Announcement",
    preview:
      'We\'re excited to announce our new "React Native Mobile Development" course...',
    time: "Jul 25",
    unread: false,
  },
];

export default function TrainingInstituteDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  // ---- Keep activeTab synced with URL ----
  useEffect(() => {
    const tabSlug = searchParams.get("tab") ?? "";
    const tabName = slugToTab[tabSlug] || "Dashboard";
    setActiveTab(tabName);
  }, [searchParams]);

  // ---- Function to navigate when sidebar calls setActiveTab ----
  const navigateToTab = (tabName) => {
    const slug = tabToSlug[tabName] ?? "";
    const href = slug
      ? `/dashboard/training?tab=${slug}`
      : "/dashboard/training";
    router.push(href);
    setActiveTab(tabName);
  };

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      setSidebarOpen(!isMobileView);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close notifications and messages dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        !event.target.closest(".notifications-dropdown")
      ) {
        setShowNotifications(false);
      }
      if (showMessages && !event.target.closest(".messages-dropdown")) {
        setShowMessages(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications, showMessages]);

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardContent />;
      case "Post Training":
        return <PostTrainingPage />;
      case "Active Training post":
        return <ActiveTrainingPostPage />;
      case "Expired Training post":
        return <ExpiredTrainingPostPage />;
      case "Draft Training post":
        return <DraftTrainingPostPage />;
      case "Courses offered":
        return <CoursesOfferedPage />;
      case "Advanced Search":
        return <AdvancedSearch />;
      case "Koluvu Business":
        return <KoluvuBusiness />;
      case "placements":
        return <PlacementsPage />;
      case "internship":
        return <InternshipPage />;
      case "notifications":
        return <NotificationsPage />;
      case "inbox":
        return <InboxPage />;
      case "billings":
        return <BillingsPage />;
      case "account settings":
        return <AccountSettingsPage />;
      case "contact us":
        return <ContactUsPage />;
      case "logout":
        return <LogoutPage />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Site Header */}
      <Header />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={navigateToTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* Dashboard Header with Hamburger Menu and Profile Section */}
          <div className="sticky top-0 z-30 bg-white shadow-sm">
            {/* Top Header Bar */}
            <div className="p-4 flex items-center justify-between">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="mr-3 text-gray-600 hover:text-gray-900 focus:outline-none"
                  aria-label="Toggle sidebar"
                >
                  <FontAwesomeIcon icon={faBars} size="lg" />
                </button>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold flex-1 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                {isMobile
                  ? "Training Dashboard"
                  : "Training Institute Dashboard"}
              </h1>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative notifications-dropdown">
                  <button
                    className="relative p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 group"
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowMessages(false);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faBell}
                      className="text-lg group-hover:animate-pulse"
                    />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">3</span>
                    </span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></span>
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="fixed sm:absolute right-4 sm:right-0 left-4 sm:left-auto mt-2 w-auto sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={faBell}
                            className="text-white/80"
                          />
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-[60vh] sm:max-h-[50vh] overflow-y-auto">
                        <div className="p-3 sm:p-4 hover:bg-blue-50 border-b border-gray-100 transition-colors duration-200">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm sm:text-lg">
                                📩
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                New Enrollment
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                You have a new enrollment request
                              </p>
                              <p className="text-xs text-blue-500 mt-1 font-medium">
                                1 hour ago
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4 hover:bg-yellow-50 border-b border-gray-100 transition-colors duration-200">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600 text-sm sm:text-lg">
                                ⚡
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                Subscription Alert
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                Your subscription expires in 3 days
                              </p>
                              <p className="text-xs text-yellow-600 mt-1 font-medium">
                                3 hours ago
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4 hover:bg-purple-50 transition-colors duration-200">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 text-sm sm:text-lg">
                                💬
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                Student Message
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                New message from student
                              </p>
                              <p className="text-xs text-purple-600 mt-1 font-medium">
                                4 hours ago
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                        <button
                          className="w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                          onClick={() => {
                            setActiveTab("notifications");
                            setShowNotifications(false);
                          }}
                        >
                          View All Notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages Dropdown */}
                <div className="relative messages-dropdown">
                  <button
                    className="relative p-3 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200 group"
                    onClick={() => {
                      setShowMessages(!showMessages);
                      setShowNotifications(false);
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-lg group-hover:animate-bounce"
                    />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-xs font-bold">2</span>
                    </span>
                  </button>

                  {showMessages && (
                    <div className="fixed sm:absolute right-4 sm:right-0 left-4 sm:left-auto mt-2 w-auto sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 sm:p-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            className="text-white/80"
                          />
                          Messages
                        </h3>
                      </div>
                      <div className="max-h-[60vh] sm:max-h-[50vh] overflow-y-auto">
                        {recentMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-3 sm:p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors duration-200 ${
                              message.unread ? "bg-blue-50" : ""
                            }`}
                            onClick={() => {
                              setActiveTab("inbox");
                              setShowMessages(false);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-purple-600 text-sm sm:text-lg">
                                  <FontAwesomeIcon
                                    icon={
                                      message.unread
                                        ? faEnvelope
                                        : faEnvelopeOpen
                                    }
                                  />
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                  {message.sender}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  {message.subject}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {message.preview}
                                </p>
                                <p className="text-xs text-purple-500 mt-1 font-medium">
                                  {message.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
                        <button
                          className="w-full text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                          onClick={() => {
                            setActiveTab("inbox");
                            setShowMessages(false);
                          }}
                        >
                          View All Messages
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Container with Responsive Padding */}
          <div className="p-3 sm:p-4 md:p-6">{renderContent()}</div>
        </main>
      </div>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
