"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  FiBriefcase,
  FiMapPin,
  FiDollarSign,
  FiUpload,
  FiCheckCircle,
  FiAlertCircle,
  FiFile,
  FiX,
} from "react-icons/fi";

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { user, userType } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [screeningAnswers, setScreeningAnswers] = useState([]);

  // ATS result
  const [atsResult, setAtsResult] = useState(null);

  useEffect(() => {
    // Redirect if not an employee
    if (userType && userType !== "employee") {
      router.push("/");
      return;
    }

    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const { id } = params;

        const response = await fetch(`/api/employer/jobs/single?id=${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }

        const data = await response.json();
        setJob(data);

        // Initialize screening answers
        if (data.screening_questions && data.screening_questions.length > 0) {
          setScreeningAnswers(
            data.screening_questions.map((q) => ({
              question: q.question || q,
              answer: "",
            }))
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJobDetails();
    }
  }, [params, userType, router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF, DOC, or DOCX file");
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }

    setResume(file);
    setError(null);
  };

  const handleScreeningAnswerChange = (index, value) => {
    const updated = [...screeningAnswers];
    updated[index].answer = value;
    setScreeningAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Validation
      if (!resume) {
        throw new Error("Please upload your resume");
      }

      if (screeningAnswers.length > 0) {
        const allAnswered = screeningAnswers.every(
          (a) => a.answer.trim() !== ""
        );
        if (!allAnswered) {
          throw new Error("Please answer all screening questions");
        }
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("cover_letter", coverLetter);
      formData.append("screening_answers", JSON.stringify(screeningAnswers));

      // Submit application
      const response = await fetch(`/api/jobs/${params.id}/apply`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      // Show success with ATS results
      setSuccess(true);
      setAtsResult(data.ats_analysis);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push(`/dashboard/employee/${user?.username}/applications`);
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiAlertCircle className="mx-auto text-red-500 text-5xl mb-4" />
          <p className="text-gray-600">Job not found</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheckCircle className="text-green-600 text-3xl" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Your application has been successfully submitted to{" "}
            {job.employer?.company_name || "the employer"}.
          </p>

          {atsResult && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">ATS Match Score</p>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {atsResult.score}%
              </div>
              <div className="text-xs text-gray-500">
                {atsResult.matched_keywords_count} keywords matched
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Redirecting to your applications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Job Info Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Apply for {job.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FiBriefcase className="text-gray-400" />
              <span>{job.employer?.company_name}</span>
            </div>
            {job.location && (
              <div className="flex items-center gap-2">
                <FiMapPin className="text-gray-400" />
                <span>{job.location}</span>
              </div>
            )}
            {job.salary_range && (
              <div className="flex items-center gap-2">
                <FiDollarSign className="text-gray-400" />
                <span>{job.salary_range}</span>
              </div>
            )}
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Resume Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume / CV <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Upload your resume in PDF, DOC, or DOCX format (max 10MB)
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="hidden"
                disabled={submitting}
              />
              <label
                htmlFor="resume"
                className="cursor-pointer flex flex-col items-center"
              >
                {resume ? (
                  <div className="flex items-center gap-3 text-blue-600">
                    <FiFile className="text-2xl" />
                    <div className="text-left">
                      <p className="font-medium">{resume.name}</p>
                      <p className="text-xs text-gray-500">
                        {(resume.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setResume(null);
                      }}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUpload className="text-4xl text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label
              htmlFor="coverLetter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cover Letter <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us why you're interested in this position..."
              disabled={submitting}
            />
          </div>

          {/* Screening Questions */}
          {screeningAnswers.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Screening Questions
              </h3>
              <div className="space-y-4">
                {screeningAnswers.map((item, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {index + 1}. {item.question}
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      value={item.answer}
                      onChange={(e) =>
                        handleScreeningAnswerChange(index, e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your answer..."
                      disabled={submitting}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <FiAlertCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !resume}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FiCheckCircle />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
