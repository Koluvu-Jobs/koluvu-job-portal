// src/app/main/dashboard/employee/components/applications.js

"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { FiMenu, FiX, FiChevronRight } from "react-icons/fi";

const RelatedJobs = ({ jobs, isDarkMode }) => {
  return (
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
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
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
                className={`text-xs font-medium md:text-sm ${
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
};

const ApplicationStats = ({ stats, isDarkMode }) => {
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
        {[
          { label: "Total", value: stats.total, color: "blue" },
          { label: "Accepted", value: stats.accepted, color: "green" },
          { label: "In Review", value: stats.inReview, color: "yellow" },
          { label: "Rejected", value: stats.rejected, color: "red" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`p-3 rounded-lg border md:p-4 ${
              isDarkMode
                ? `bg-${stat.color}-900 border-${stat.color}-800 text-${stat.color}-200`
                : `bg-${stat.color}-50 border-${stat.color}-100 text-${stat.color}-600`
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {stat.label}
            </p>
            <p
              className={`text-lg font-bold mt-1 md:text-xl ${
                isDarkMode ? `text-${stat.color}-200` : `text-${stat.color}-600`
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const RightSidebar = ({ isOpen, onClose, jobs, isDarkMode }) => {
  return (
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
        <RelatedJobs jobs={jobs} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default function Applications({ applications, isDarkMode }) {
  const router = useRouter();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

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
      className={`px-4 py-4 min-h-screen sm:px-6 sm:py-6 lg:px-8 lg:py-8 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50"
      }`}
    >
      {/* Mobile header with toggle button for right sidebar only */}
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

      <div className="w-full">
        {/* Fluid responsive layout using grid on large screens */}
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Main Content Area */}
          <div className="w-full lg:col-span-8 xl:col-span-9">
            <div
              className={`rounded-lg shadow-sm p-4 md:p-5 lg:p-6 ${
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
                  onClick={() => router.push("/main/jobs")}
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

              {/* Application Stats integrated inside My Applications */}
              <div className="mb-6">
                <ApplicationStats
                  stats={applicationStats}
                  isDarkMode={isDarkMode}
                />
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-8 md:py-10">
                  <p
                    className={`text-base mb-4 md:text-lg ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No applications yet
                  </p>
                  <button
                    onClick={() => router.push("/main/jobs")}
                    className={`px-4 py-2 rounded-lg transition-colors text-base md:px-5 md:py-2.5 ${
                      isDarkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table
                    className={`min-w-full divide-y ${
                      isDarkMode ? "divide-gray-700" : "divide-gray-200"
                    }`}
                  >
                    <thead
                      className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}
                    >
                      <tr>
                        <th
                          scope="col"
                          className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider sm:text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Position
                        </th>
                        <th
                          scope="col"
                          className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider sm:text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Company
                        </th>
                        <th
                          scope="col"
                          className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell sm:text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Applied
                        </th>
                        <th
                          scope="col"
                          className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider sm:text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider sm:text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={
                        isDarkMode
                          ? "bg-gray-800 divide-gray-700"
                          : "bg-white divide-gray-200"
                      }
                    >
                      {applications.map((app) => (
                        <tr
                          key={app.id}
                          className={
                            isDarkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div
                              className={`text-sm font-medium md:text-base ${
                                isDarkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {app.title}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {app.company}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                            <div
                              className={`text-sm ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {new Date(app.appliedDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full sm:text-sm ${getStatusColor(
                                app.status
                              )}`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              <button
                                onClick={() =>
                                  router.push(`/main/jobs/${app.id}`)
                                }
                                className={
                                  isDarkMode
                                    ? "text-blue-400 hover:text-blue-300"
                                    : "text-blue-600 hover:text-blue-900"
                                }
                              >
                                View
                              </button>
                              <button
                                className={
                                  isDarkMode
                                    ? "text-gray-400 hover:text-gray-300"
                                    : "text-gray-600 hover:text-gray-900"
                                }
                              >
                                Withdraw
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {rightSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setRightSidebarOpen(false)}
        />
      )}
    </div>
  );
}
