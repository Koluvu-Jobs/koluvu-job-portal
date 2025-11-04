// src/components/Dashboard/DynamicDashboard.js

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

// Dashboard Widgets
const DashboardWidget = ({
  title,
  value,
  change,
  icon,
  color = "blue",
  onClick,
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p
            className={`text-sm mt-1 ${
              change.type === "positive" ? "text-green-600" : "text-red-600"
            }`}
          >
            {change.type === "positive" ? "↑" : "↓"} {change.value}
          </p>
        )}
      </div>
      <div
        className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}
      >
        <svg
          className={`w-6 h-6 text-${color}-600`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={icon}
          />
        </svg>
      </div>
    </div>
  </motion.div>
);

const RecentActivityItem = ({ activity }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div
      className={`w-2 h-2 rounded-full mt-2 ${
        activity.type === "application"
          ? "bg-green-500"
          : activity.type === "interview"
          ? "bg-blue-500"
          : activity.type === "message"
          ? "bg-purple-500"
          : "bg-gray-500"
      }`}
    />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">
        {activity.title}
      </p>
      <p className="text-sm text-gray-600 truncate">{activity.description}</p>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(activity.timestamp).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const QuickAction = ({ title, description, icon, onClick, color = "blue" }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`p-4 bg-${color}-50 border border-${color}-200 rounded-lg text-left hover:bg-${color}-100 transition-colors`}
  >
    <div className="flex items-center space-x-3">
      <div
        className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}
      >
        <svg
          className={`w-5 h-5 text-${color}-600`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={icon}
          />
        </svg>
      </div>
      <div>
        <h4 className={`font-medium text-${color}-900`}>{title}</h4>
        <p className={`text-sm text-${color}-700`}>{description}</p>
      </div>
    </div>
  </motion.button>
);

export const DynamicDashboard = ({ userType }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user, accessToken } = useAuth();
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Fetch dashboard data based on user type
  const fetchDashboardData = async (showRefreshToast = false) => {
    if (!user || !accessToken) return;

    try {
      if (showRefreshToast) setRefreshing(true);

      let endpoint = "";
      if (userType === "employer") {
        endpoint = "/api/employer/dashboard/";
      } else if (userType === "employee") {
        endpoint = "/api/employee/dashboard/";
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);

        if (showRefreshToast) {
          toast.success("Dashboard refreshed!");
        }
      } else {
        console.error("Failed to fetch dashboard data");
        // Use fallback data
        setDashboardData(getFallbackData(userType));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardData(getFallbackData(userType));
    } finally {
      setIsLoading(false);
      if (showRefreshToast) setRefreshing(false);
    }
  };

  // Get fallback data for offline/error scenarios
  const getFallbackData = (type) => {
    if (type === "employer") {
      return {
        stats: {
          total_jobs: 12,
          active_jobs: 8,
          total_applications: 45,
          pending_applications: 12,
          interviews_scheduled: 6,
          new_candidates: 23,
        },
        recent_activities: [
          {
            id: 1,
            type: "application",
            title: "New Application Received",
            description: "John Doe applied for Senior Developer position",
            timestamp: new Date().toISOString(),
            job_title: "Senior Developer",
          },
          {
            id: 2,
            type: "interview",
            title: "Interview Scheduled",
            description: "Interview with Jane Smith scheduled for tomorrow",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            candidate_name: "Jane Smith",
          },
        ],
        quick_actions: [
          {
            title: "Post New Job",
            description: "Create a new job posting",
            icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
            action: "/employer/jobs/create",
            color: "green",
          },
          {
            title: "Review Applications",
            description: "Check pending applications",
            icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
            action: "/employer/applications",
            color: "blue",
          },
        ],
      };
    } else {
      return {
        stats: {
          applications_sent: 8,
          interviews_scheduled: 3,
          profile_views: 156,
          saved_jobs: 24,
          skill_assessments: 5,
          resume_downloads: 42,
        },
        recent_activities: [
          {
            id: 1,
            type: "application",
            title: "Application Submitted",
            description: "Applied for Frontend Developer at TechCorp",
            timestamp: new Date().toISOString(),
            company: "TechCorp",
          },
          {
            id: 2,
            type: "interview",
            title: "Interview Invitation",
            description: "Interview invitation from StartupXYZ",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            company: "StartupXYZ",
          },
        ],
        quick_actions: [
          {
            title: "Search Jobs",
            description: "Find your next opportunity",
            icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
            action: "/employee/jobs/search",
            color: "blue",
          },
          {
            title: "Update Resume",
            description: "Keep your profile current",
            icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
            action: "/employee/resume",
            color: "green",
          },
        ],
      };
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, [user, userType, accessToken]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, userType, accessToken]);

  // Handle quick actions
  const handleQuickAction = (action) => {
    if (action.startsWith("/")) {
      window.location.href = action;
    } else if (typeof action === "function") {
      action();
    }
  };

  // Refresh dashboard
  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard data</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Get widgets based on user type
  const getWidgets = () => {
    if (userType === "employer") {
      return [
        {
          title: "Total Jobs",
          value: dashboardData.stats.total_jobs || 0,
          icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6",
          color: "blue",
          onClick: () => handleQuickAction("/employer/jobs"),
        },
        {
          title: "Active Jobs",
          value: dashboardData.stats.active_jobs || 0,
          icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
          color: "green",
          onClick: () => handleQuickAction("/employer/jobs/active"),
        },
        {
          title: "Applications",
          value: dashboardData.stats.total_applications || 0,
          change: { type: "positive", value: "+12 this week" },
          icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
          color: "purple",
          onClick: () => handleQuickAction("/employer/applications"),
        },
        {
          title: "Interviews",
          value: dashboardData.stats.interviews_scheduled || 0,
          icon: "M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0v12a2 2 0 002 2h4a2 2 0 002-2V7",
          color: "orange",
          onClick: () => handleQuickAction("/employer/interviews"),
        },
      ];
    } else {
      return [
        {
          title: "Applications Sent",
          value: dashboardData.stats.applications_sent || 0,
          icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
          color: "blue",
          onClick: () => handleQuickAction("/employee/applications"),
        },
        {
          title: "Interview Invites",
          value: dashboardData.stats.interviews_scheduled || 0,
          icon: "M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0v12a2 2 0 002 2h4a2 2 0 002-2V7",
          color: "green",
          onClick: () => handleQuickAction("/employee/interviews"),
        },
        {
          title: "Profile Views",
          value: dashboardData.stats.profile_views || 0,
          change: { type: "positive", value: "+23 this month" },
          icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
          color: "purple",
          onClick: () => handleQuickAction("/employee/profile"),
        },
        {
          title: "Saved Jobs",
          value: dashboardData.stats.saved_jobs || 0,
          icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
          color: "red",
          onClick: () => handleQuickAction("/employee/saved-jobs"),
        },
      ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {userType === "employer" ? "Employer Dashboard" : "My Dashboard"}
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.first_name || user.username}!
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getWidgets().map((widget, index) => (
          <motion.div
            key={widget.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <DashboardWidget {...widget} />
          </motion.div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {dashboardData.recent_activities?.length > 0 ? (
              dashboardData.recent_activities.map((activity) => (
                <RecentActivityItem key={activity.id} activity={activity} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No recent activity
              </p>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {dashboardData.quick_actions?.map((action, index) => (
              <QuickAction
                key={action.title}
                {...action}
                onClick={() => handleQuickAction(action.action)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
