"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiDownload,
  FiEye,
  FiFilter,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

export default function JobApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const { userType } = useAuth();

  const [applicants, setApplicants] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (userType && userType !== "employer") {
      router.push("/");
      return;
    }

    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const { id } = params;

        const response = await fetch(
          `/api/employer/jobs/${id}/applicants`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch applicants");
        }

        const data = await response.json();
        setApplicants(data.results || []);
        setStatistics(data.statistics || {});
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchApplicants();
    }
  }, [params, userType, router]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-gray-100 text-gray-800",
      reviewed: "bg-blue-100 text-blue-800",
      shortlisted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return badges[status] || badges.pending;
  };

  const filteredApplicants = applicants.filter((app) => {
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
            Job Applicants
          </h1>
          <p className="text-gray-600 mt-1">
            Manage applications for this position
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FiUsers className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Applicants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <FiTrendingUp className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg ATS Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.average_ats_score}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <FiFilter className="text-yellow-600 text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.pending}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <FiEye className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Shortlisted</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.shortlisted}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { key: "all", label: "All" },
              { key: "pending", label: "Pending" },
              { key: "reviewed", label: "Reviewed" },
              { key: "shortlisted", label: "Shortlisted" },
              { key: "rejected", label: "Rejected" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
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

        {/* Applicants Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ATS Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <p className="text-gray-500">No applicants found</p>
                    </td>
                  </tr>
                ) : (
                  filteredApplicants.map((applicant) => (
                    <tr
                      key={applicant.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() =>
                        router.push(
                          `/dashboard/employer/${params.username}/applications/${applicant.id}`
                        )
                      }
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <FiUser className="text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {applicant.employee_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <FiMail className="text-gray-400" />
                            <span>{applicant.employee_email}</span>
                          </div>
                          {applicant.employee_phone && (
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                              <FiPhone className="text-gray-400" />
                              <span>{applicant.employee_phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                            applicant.ats_score
                          )}`}
                        >
                          {applicant.ats_score}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            applicant.status
                          )}`}
                        >
                          {applicant.status.charAt(0).toUpperCase() +
                            applicant.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          {new Date(applicant.applied_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/dashboard/employer/${params.username}/applications/${applicant.id}`
                            );
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                        >
                          <FiEye /> View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
