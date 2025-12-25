"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLinkedin,
  FiGithub,
  FiGlobe,
  FiDownload,
  FiCalendar,
  FiBriefcase,
  FiAward,
  FiBook,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
} from "react-icons/fi";

export default function ApplicantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { userType } = useAuth();

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (userType && userType !== "employer") {
      router.push("/");
      return;
    }

    const fetchApplicantDetail = async () => {
      try {
        setLoading(true);
        const { id } = params;

        const response = await fetch(`/api/employer/applicants/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch applicant details");
        }

        const data = await response.json();
        setApplicant(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchApplicantDetail();
    }
  }, [params, userType, router]);

  const updateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await fetch(`/api/employer/applicants/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const data = await response.json();
      setApplicant(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p>Error: {error || "Applicant not found"}</p>
        </div>
      </div>
    );
  }

  const profile = applicant.employee_profile;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
          >
            ← Back to Applicants
          </button>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Applicant Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              {/* Profile Picture */}
              <div className="text-center mb-4">
                {profile?.profile_picture_url ? (
                  <img
                    src={profile.profile_picture_url}
                    alt={profile.user_name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto bg-blue-100 flex items-center justify-center">
                    <FiUser className="text-blue-600 text-4xl" />
                  </div>
                )}
                <h2 className="text-xl font-bold text-gray-900 mt-4">
                  {profile?.user_name || applicant.employee_name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {profile?.current_designation || profile?.current_position}
                </p>
              </div>

              {/* ATS Score */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 text-center mb-2">
                  ATS Match Score
                </p>
                <div
                  className={`text-4xl font-bold text-center ${getScoreColor(
                    applicant.ats_score
                  )}`}
                >
                  {applicant.ats_score}%
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        applicant.ats_score >= 80
                          ? "bg-green-600"
                          : applicant.ats_score >= 60
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${applicant.ats_score}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <FiMail className="text-gray-400" />
                  <a
                    href={`mailto:${
                      profile?.user_email || applicant.employee_email
                    }`}
                    className="text-blue-600 hover:underline"
                  >
                    {profile?.user_email || applicant.employee_email}
                  </a>
                </div>
                {(profile?.phone_number || applicant.employee_phone) && (
                  <div className="flex items-center gap-2 text-sm">
                    <FiPhone className="text-gray-400" />
                    <span className="text-gray-700">
                      {profile?.phone_number || applicant.employee_phone}
                    </span>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <FiMapPin className="text-gray-400" />
                    <span className="text-gray-700">{profile.location}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(profile?.linkedin_url ||
                profile?.github_url ||
                profile?.portfolio_url) && (
                <div className="flex gap-3 mb-6">
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FiLinkedin className="text-blue-600" />
                    </a>
                  )}
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiGithub className="text-gray-700" />
                    </a>
                  )}
                  {profile.portfolio_url && (
                    <a
                      href={profile.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <FiGlobe className="text-purple-600" />
                    </a>
                  )}
                </div>
              )}

              {/* Status Update */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Application Status
                </label>
                <select
                  value={applicant.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  disabled={updating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Resume Download */}
              {applicant.resume && (
                <a
                  href={applicant.resume}
                  download
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FiDownload /> Download Resume
                </a>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* ATS Analysis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiTrendingUp className="text-blue-600" />
                ATS Analysis
              </h3>

              {/* Matched Keywords */}
              {applicant.matching_keywords &&
                applicant.matching_keywords.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FiCheckCircle className="text-green-600" />
                      Matched Keywords ({applicant.matching_keywords.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {applicant.matching_keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Missing Keywords */}
              {applicant.missing_keywords &&
                applicant.missing_keywords.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FiXCircle className="text-red-600" />
                      Missing Keywords ({applicant.missing_keywords.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {applicant.missing_keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm border border-red-200"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Bio */}
            {profile?.bio && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-3">
                  About
                </h3>
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Cover Letter */}
            {applicant.cover_letter && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-3">
                  Cover Letter
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {applicant.cover_letter}
                </p>
              </div>
            )}

            {/* Screening Answers */}
            {applicant.screening_answers &&
              applicant.screening_answers.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">
                    Screening Questions
                  </h3>
                  <div className="space-y-4">
                    {applicant.screening_answers.map((item, index) => (
                      <div key={index}>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Q: {item.question}
                        </p>
                        <p className="text-sm text-gray-700 pl-4 border-l-2 border-blue-200">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Experience */}
            {profile?.experience && profile.experience.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiBriefcase className="text-blue-600" />
                  Work Experience
                </h3>
                <div className="space-y-4">
                  {profile.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-blue-200 pl-4"
                    >
                      <h4 className="font-medium text-gray-900">
                        {exp.position}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {exp.company_name}
                      </p>
                      {exp.location && (
                        <p className="text-xs text-gray-500">{exp.location}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <FiCalendar />
                        {new Date(exp.start_date).toLocaleDateString()} -{" "}
                        {exp.is_current
                          ? "Present"
                          : new Date(exp.end_date).toLocaleDateString()}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-700 mt-2">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {profile?.education && profile.education.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiBook className="text-blue-600" />
                  Education
                </h3>
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-blue-200 pl-4"
                    >
                      <h4 className="font-medium text-gray-900">
                        {edu.degree}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {edu.field_of_study}
                      </p>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <FiCalendar />
                        {new Date(edu.start_date).toLocaleDateString()} -{" "}
                        {edu.is_current
                          ? "Present"
                          : new Date(edu.end_date).toLocaleDateString()}
                      </p>
                      {edu.grade && (
                        <p className="text-xs text-gray-500">
                          Grade: {edu.grade}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiAward className="text-blue-600" />
                  Skills
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {profile.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700">
                        {skill.name}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {skill.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
