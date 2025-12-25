"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEye,
} from "react-icons/fi";

export default function MyApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const { userType } = useAuth();

  const [applications, setApplications] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (userType && userType !== "employee") {
      router.push("/");
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/employee/my-applications", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        setApplications(data.results || []);
        setStatistics(data.statistics || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userType, router]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: FiClock,
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Pending",
      },
      reviewed: {
        icon: FiEye,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Reviewed",
      },
      shortlisted: {
        icon: FiCheckCircle,
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Shortlisted",
      },
      rejected: {
        icon: FiXCircle,
        color: "bg-red-100 text-red-800 border-red-200",
        label: "Rejected",
      },
    };
    return configs[status] || configs.pending;
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            My Applications
          </h1>
          <p className="text-gray-600 mt-1">
            Track all your job applications in one place
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statistics.total}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Pending</p>
                <p className="text-2xl font-bold text-gray-600">
                  {statistics.pending}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Reviewed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {statistics.reviewed}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Shortlisted</p>
                <p className="text-2xl font-bold text-green-600">
                  {statistics.shortlisted}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {statistics.rejected}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { key: "all", label: "All Applications" },
              { key: "pending", label: "Pending" },
              { key: "reviewed", label: "Reviewed" },
              { key: "shortlisted", label: "Shortlisted" },
              { key: "rejected", label: "Rejected" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  filter === tab.key
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FiBriefcase className="mx-auto text-gray-400 text-5xl mb-4" />
            <p className="text-gray-600 text-lg mb-2">No applications found</p>
            <p className="text-gray-500 text-sm">
              Start applying to jobs to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={application.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left: Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-serif font-bold text-gray-900 mb-1">
                            {application.job_title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                            <FiBriefcase className="text-gray-400" />
                            {application.company_name}
                          </p>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FiCalendar className="text-gray-400" />
                              Applied{" "}
                              {new Date(
                                application.applied_at
                              ).toLocaleDateString()}
                            </span>
                            {application.viewed_by_employer && (
                              <span className="flex items-center gap-1 text-blue-600">
                                <FiEye />
                                Viewed
                              </span>
                            )}
                          </div>

                          {/* Matched Keywords Preview */}
                          {application.matching_keywords &&
                            application.matching_keywords.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-1">
                                  Matched Skills:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {application.matching_keywords
                                    .slice(0, 5)
                                    .map((keyword, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs border border-green-200"
                                      >
                                        {keyword}
                                      </span>
                                    ))}
                                  {application.matching_keywords.length > 5 && (
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                      +
                                      {application.matching_keywords.length - 5}{" "}
                                      more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Status & ATS Score */}
                    <div className="flex md:flex-col items-center md:items-end gap-4">
                      {/* ATS Score */}
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">ATS Score</p>
                        <div
                          className={`px-4 py-2 rounded-lg border font-bold text-xl ${getScoreColor(
                            application.ats_score
                          )}`}
                        >
                          {application.ats_score}%
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig.color}`}
                      >
                        <StatusIcon />
                        {statusConfig.label}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
