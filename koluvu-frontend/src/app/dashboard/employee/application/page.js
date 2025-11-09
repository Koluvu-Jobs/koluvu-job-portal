// src/app/main/dashboard/employee/applications/page.js

"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiChevronRight,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiExternalLink,
  FiTrendingUp,
  FiBriefcase,
  FiUser,
  FiTarget,
} from "react-icons/fi";

const RelatedJobs = ({ jobs, isDarkMode }) => (
  <div
    className={`rounded-lg shadow-sm p-4 mb-4 md:p-5 lg:p-6 lg:mb-6 ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    <h3
      className={`text-base font-semibold mb-3 border-b pb-2 md:text-lg ${
        isDarkMode
          ? "text-gray-200 border-gray-700"
          : "text-gray-800 border-gray-200"
      }`}
    >
      Related Jobs
    </h3>
    <div className="space-y-3 md:space-y-4">
      {jobs.map((job, index) => (
        <motion.div
          key={index}
          whileHover={{ x: 5 }}
          className={`border-b pb-3 last:border-b-0 md:pb-4 ${
            isDarkMode ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <h4
            className={`text-sm font-medium transition-colors cursor-pointer md:text-base ${
              isDarkMode
                ? "text-gray-200 hover:text-blue-400"
                : "text-gray-800 hover:text-blue-600"
            }`}
          >
            {job.title}
          </h4>
          <p
            className={`text-sm mt-1 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {job.company}
          </p>
          <div className="flex items-center mt-1">
            <svg
              className={`w-3 h-3 mr-1 md:w-4 md:h-4 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span
              className={`text-xs md:text-sm ${
                isDarkMode ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {job.location}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2 md:mt-3">
            <span
              className={`text-xs px-2 py-1 rounded-full md:text-sm ${
                isDarkMode
                  ? "bg-blue-900 text-blue-200"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {job.type}
            </span>
            <button
              onClick={() => {
                console.log(`Applying for ${job.title} at ${job.company}`);
                router.push(`/jobs?search=${encodeURIComponent(job.title)}`);
              }}
              className={`text-xs font-medium md:text-sm transition-all duration-300 hover:scale-105 ${
                isDarkMode
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              Apply Now
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const InterviewPreparation = ({ isDarkMode }) => (
  <div
    className={`rounded-lg shadow-sm p-4 mb-4 md:p-5 lg:p-6 lg:mb-6 ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    <h3
      className={`text-base font-semibold mb-3 border-b pb-2 md:text-lg ${
        isDarkMode
          ? "text-gray-200 border-gray-700"
          : "text-gray-800 border-gray-200"
      }`}
    >
      <FiTarget className="inline w-5 h-5 mr-2" />
      Interview Preparation
    </h3>
    <div className="space-y-3">
      <div
        className={`p-3 rounded-lg border ${
          isDarkMode
            ? "bg-blue-900/20 border-blue-800"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <h4
          className={`font-medium text-sm mb-2 ${
            isDarkMode ? "text-blue-200" : "text-blue-800"
          }`}
        >
          Common Interview Questions
        </h4>
        <p
          className={`text-xs ${
            isDarkMode ? "text-blue-300" : "text-blue-600"
          }`}
        >
          Practice answers to frequently asked questions
        </p>
      </div>
      <div
        className={`p-3 rounded-lg border ${
          isDarkMode
            ? "bg-green-900/20 border-green-800"
            : "bg-green-50 border-green-200"
        }`}
      >
        <h4
          className={`font-medium text-sm mb-2 ${
            isDarkMode ? "text-green-200" : "text-green-800"
          }`}
        >
          Mock Interviews
        </h4>
        <p
          className={`text-xs ${
            isDarkMode ? "text-green-300" : "text-green-600"
          }`}
        >
          AI-powered practice sessions
        </p>
      </div>
    </div>
  </div>
);

const ApplicationTimeline = ({ isDarkMode }) => {
  const timelineEvents = [
    {
      date: "Today",
      event: "Applied to Frontend Developer at TechCorp",
      status: "applied",
    },
    {
      date: "2 days ago",
      event: "Interview scheduled with DesignHub",
      status: "interview",
    },
    {
      date: "1 week ago",
      event: "Application accepted at WebSolutions",
      status: "accepted",
    },
    {
      date: "2 weeks ago",
      event: "Resume reviewed by StartupXYZ",
      status: "reviewed",
    },
  ];

  return (
    <div
      className={`rounded-lg shadow-sm p-4 mb-4 md:p-5 lg:p-6 lg:mb-6 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h3
        className={`text-base font-semibold mb-4 border-b pb-2 md:text-lg ${
          isDarkMode
            ? "text-gray-200 border-gray-700"
            : "text-gray-800 border-gray-200"
        }`}
      >
        <FiClock className="inline w-5 h-5 mr-2" />
        Recent Activity
      </h3>
      <div className="space-y-4">
        {timelineEvents.map((event, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className={`w-3 h-3 rounded-full mt-1 ${
                event.status === "applied"
                  ? "bg-blue-500"
                  : event.status === "interview"
                  ? "bg-yellow-500"
                  : event.status === "accepted"
                  ? "bg-green-500"
                  : "bg-gray-500"
              }`}
            />
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {event.event}
              </p>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {event.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApplicationStats = ({ stats, isDarkMode }) => {
  const statsConfig = [
    { label: "Total", value: stats.total, color: "blue", icon: FiBriefcase },
    {
      label: "Accepted",
      value: stats.accepted,
      color: "green",
      icon: FiTrendingUp,
    },
    {
      label: "In Review",
      value: stats.inReview,
      color: "yellow",
      icon: FiClock,
    },
    { label: "Rejected", value: stats.rejected, color: "red", icon: FiX },
  ];

  return (
    <div
      className={`rounded-lg shadow-sm p-4 mb-4 md:p-5 lg:p-6 ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h3
        className={`text-base font-semibold mb-3 border-b pb-2 md:text-lg ${
          isDarkMode
            ? "text-gray-200 border-gray-700"
            : "text-gray-800 border-gray-200"
        }`}
      >
        Application Stats
      </h3>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {statsConfig.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.label}
              className={`p-3 rounded-lg border md:p-4 ${
                isDarkMode
                  ? `bg-${stat.color}-900 border-${stat.color}-800 text-${stat.color}-200`
                  : `bg-${stat.color}-50 border-${stat.color}-100 text-${stat.color}-600`
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {stat.label}
                </p>
                <IconComponent
                  className={`w-4 h-4 ${
                    isDarkMode
                      ? `text-${stat.color}-300`
                      : `text-${stat.color}-500`
                  }`}
                />
              </div>
              <p
                className={`text-lg font-bold md:text-xl ${
                  isDarkMode
                    ? `text-${stat.color}-200`
                    : `text-${stat.color}-600`
                }`}
              >
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RightSidebar = ({ isOpen, onClose, jobs, isDarkMode }) => (
  <div
    className={`fixed inset-y-0 right-0 z-40 w-64 shadow-lg transform ${
      isOpen ? "translate-x-0" : "translate-x-full"
    } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-auto lg:shadow-none ${
      isDarkMode ? "bg-gray-800" : "bg-white"
    }`}
  >
    <div className="p-4 lg:p-0">
      <button
        onClick={onClose}
        className={`lg:hidden p-2 rounded-md focus:outline-none ${
          isDarkMode
            ? "text-gray-400 hover:text-gray-300"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        <FiX size={24} />
      </button>
      <ApplicationTimeline isDarkMode={isDarkMode} />
      <InterviewPreparation isDarkMode={isDarkMode} />
      <RelatedJobs jobs={jobs} isDarkMode={isDarkMode} />
    </div>
  </div>
);

export default function Applications() {
  const router = useRouter();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("applications");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Mock data for related jobs
  const relatedJobs = [
    {
      title: "Frontend Developer",
      company: "TechCorp",
      location: "Bangalore",
      type: "Full-time",
    },
    {
      title: "UX Designer",
      company: "DesignHub",
      location: "Remote",
      type: "Contract",
    },
    {
      title: "Full Stack Engineer",
      company: "WebSolutions",
      location: "Hyderabad",
      type: "Full-time",
    },
  ];

  // Simulated async fetch for demonstration
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Replace with real API fetch logic
      setApplications([
        {
          id: "1",
          title: "Frontend Developer",
          company: "TechCorp",
          appliedDate: new Date().toISOString(),
          status: "In Review",
        },
        {
          id: "2",
          title: "Backend Engineer",
          company: "InnovateLabs",
          appliedDate: new Date(Date.now() - 86400000 * 3).toISOString(),
          status: "Accepted",
        },
        {
          id: "3",
          title: "UI/UX Designer",
          company: "DesignWorks",
          appliedDate: new Date(Date.now() - 86400000 * 8).toISOString(),
          status: "Rejected",
        },
      ]);
      setLoading(false);
    }, 1300);
  }, []);

  // Calculate application stats
  const applicationStats = {
    total: applications.length,
    accepted: applications.filter((app) => app.status === "Accepted").length,
    inReview: applications.filter((app) => app.status === "In Review").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
  };

  const getStatusColor = (status) => {
    const statusColors = {
      "Interview Scheduled": isDarkMode
        ? "bg-blue-900 text-blue-200"
        : "bg-blue-100 text-blue-800",
      "In Review": isDarkMode
        ? "bg-yellow-900 text-yellow-200"
        : "bg-yellow-100 text-yellow-800",
      Rejected: isDarkMode
        ? "bg-red-900 text-red-200"
        : "bg-red-100 text-red-800",
      Accepted: isDarkMode
        ? "bg-green-900 text-green-200"
        : "bg-green-100 text-green-800",
    };
    return (
      statusColors[status] ||
      (isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800")
    );
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50"
      }`}
      style={{ padding: "32px" }}
    >
      <div className="flex justify-end items-center mb-4 lg:hidden">
        <button
          onClick={() => setRightSidebarOpen(true)}
          className={`p-2 rounded-md focus:outline-none ${
            isDarkMode
              ? "text-gray-400 hover:text-gray-300"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiMenu size={24} />
        </button>
      </div>

      <div className="w-full max-w-full overflow-x-hidden">
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 min-h-0">
          <style jsx>{`
            @media (max-width: 1024px) {
              .content-container {
                padding: 16px !important;
                margin-left: 20px !important;
              }
            }
            @media (min-width: 1025px) {
              .content-container {
                min-width: 0;
                flex: 1;
                width: 100%;
              }
            }
            .responsive-card {
              min-width: 0;
              width: 100%;
              overflow: hidden;
            }
            .responsive-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 1.5rem;
            }
          `}</style>
          <div className="w-full lg:w-2/3 responsive-card">
            <div
              className={`rounded-lg shadow-sm p-4 md:p-5 lg:p-6 responsive-card ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex flex-col mb-4 md:flex-row md:justify-between md:items-center">
                <h2
                  className={`text-xl font-semibold mb-2 md:text-2xl md:mb-0 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  My Applications
                </h2>
                <button
                  onClick={() => router.push("/jobs")}
                  className={`text-sm font-medium flex items-center self-end md:self-auto md:text-base ${
                    isDarkMode
                      ? "text-blue-400 hover:text-blue-300"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  Browse Jobs
                  <FiChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="mb-6">
                <div className="responsive-grid">
                  <ApplicationStats
                    stats={applicationStats}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-start mb-6">
                <button
                  onClick={() => {
                    console.log("Navigating to jobs...");
                    router.push("/jobs");
                  }}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-base md:px-5 md:py-2.5 font-medium transform hover:scale-105 hover:shadow-lg ${
                    isDarkMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <FiBriefcase className="w-4 h-4 mr-2 inline" />
                  Browse Jobs
                </button>
                <button
                  onClick={() => {
                    console.log("Navigating to mock interview...");
                    router.push("/dashboard/employee/mock-interview");
                  }}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-base md:px-5 md:py-2.5 font-medium border transform hover:scale-105 hover:shadow-lg ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <FiTarget className="w-4 h-4 mr-2 inline" />
                  Practice Interview
                </button>
                <button
                  onClick={() => {
                    console.log("Navigating to resume builder...");
                    router.push("/dashboard/employee/resume-builder");
                  }}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 text-base md:px-5 md:py-2.5 font-medium border transform hover:scale-105 hover:shadow-lg ${
                    isDarkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <FiUser className="w-4 h-4 mr-2 inline" />
                  Update Resume
                </button>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-8 md:py-10">
                  <FiUser
                    className={`w-16 h-16 mx-auto mb-4 ${
                      isDarkMode ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-base mb-4 md:text-lg ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No applications yet
                  </p>
                  <p
                    className={`text-sm mb-6 ${
                      isDarkMode ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    Start your job search journey by browsing available
                    positions
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border rounded-lg p-4 ${
                        isDarkMode
                          ? "border-gray-700 bg-gray-800"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <div className="flex-1">
                          <h4
                            className={`text-lg font-semibold mb-1 ${
                              isDarkMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {application.title}
                          </h4>
                          <p
                            className={`text-sm mb-2 ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {application.company}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${getStatusColor(
                              application.status
                            )}`}
                          >
                            {application.status}
                          </span>
                          <button
                            onClick={() => {
                              console.log(
                                `Viewing details for ${application.title} at ${application.company}`
                              );
                              // Could open a modal or navigate to detailed view
                              alert(
                                `Application Details:\n\nPosition: ${
                                  application.title
                                }\nCompany: ${application.company}\nStatus: ${
                                  application.status
                                }\nApplied: ${new Date(
                                  application.appliedDate
                                ).toLocaleDateString()}`
                              );
                            }}
                            className={`text-sm hover:underline transition-all duration-300 hover:scale-105 ${
                              isDarkMode
                                ? "text-blue-400 hover:text-blue-300"
                                : "text-blue-600 hover:text-blue-800"
                            }`}
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div
                          className={`flex items-center ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <FiCalendar className="w-4 h-4 mr-1" />
                          Applied:{" "}
                          {new Date(
                            application.appliedDate
                          ).toLocaleDateString()}
                        </div>
                        <div
                          className={`flex items-center ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <FiExternalLink className="w-4 h-4 mr-1" />
                          <button
                            onClick={() => {
                              console.log(
                                `Viewing company profile for ${application.company}`
                              );
                              // Navigate to company profile or open in new tab
                              window.open(
                                `https://www.${application.company
                                  .toLowerCase()
                                  .replace(/\s+/g, "")}.com`,
                                "_blank"
                              );
                            }}
                            className="hover:underline transition-all duration-300 hover:text-blue-500"
                          >
                            Company Profile
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {rightSidebarOpen && (
        <div
          className="fixed z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setRightSidebarOpen(false)}
        />
      )}
    </div>
  );
}
