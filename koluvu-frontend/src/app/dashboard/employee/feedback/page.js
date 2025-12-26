// src/app/dashboard/employee/feedback/page.js

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Building,
  User,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

// Create query client
const queryClient = new QueryClient();

// Main app content component
const InterviewFeedbackContent = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [hasAttendedInterview, setHasAttendedInterview] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch user profile with React Query
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await fetch("/api/user-profile");
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    },
    initialData: {
      name: "John Doe",
      role: "Senior Frontend Developer",
      avatar: null,
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleRouteChange = (tabId) => {
    const routes = {
      dashboard: "/dashboard/employee",
      profile: "/dashboard/employee?tab=profile",
      applications: "/dashboard/employee/application",
      resume: "/dashboard/employee/resume-builder",
      ats: "/dashboard/employee/ats",
      "ats-gap-analysis": "/dashboard/employee/ats-gap-analysis",
      verification: "/dashboard/employee/verification",
      subscription: "/dashboard/employee/subscription",
      settings: "/dashboard/employee/account-settings",
      interview: "/dashboard/employee/mock-interview",
      feedback: "/dashboard/employee/feedback",
    };

    if (routes[tabId]) {
      router.push(routes[tabId]);
      if (isSidebarOpen) {
        toggleSidebar();
      }
    }
  };

  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    department: "",
    interviewDate: "",
    interviewMode: "",
    hrName: "",
    contactNumber: "",
    emailId: "",
    companyPrimaryEmail: "",
    companySecondaryEmail: "",
    interviewQuestions: ["", "", "", "", ""],
    companyReview: "",
  });
  const [submissions, setSubmissions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    companyDetails: true,
    hrDetails: true,
    interviewQuestions: true,
    companyReview: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...formData.interviewQuestions];
    newQuestions[index] = value;
    setFormData((prev) => ({
      ...prev,
      interviewQuestions: newQuestions,
    }));
  };

  const addQuestion = () => {
    if (formData.interviewQuestions.length < 10) {
      setFormData((prev) => ({
        ...prev,
        interviewQuestions: [...prev.interviewQuestions, ""],
      }));
    }
  };

  const removeQuestion = (index) => {
    if (formData.interviewQuestions.length > 5) {
      const newQuestions = formData.interviewQuestions.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({
        ...prev,
        interviewQuestions: newQuestions,
      }));
    }
  };

  const handleSubmit = () => {
    const newSubmission = {
      ...formData,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    setSubmissions((prev) => [...prev, newSubmission]);
    setShowSuccess(true);

    // Reset form
    setFormData({
      companyName: "",
      position: "",
      department: "",
      interviewDate: "",
      interviewMode: "",
      hrName: "",
      contactNumber: "",
      emailId: "",
      companyPrimaryEmail: "",
      companySecondaryEmail: "",
      interviewQuestions: ["", "", "", "", ""],
      companyReview: "",
    });

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isFormValid = () => {
    const requiredFields = [
      "companyName",
      "position",
      "department",
      "interviewDate",
      "interviewMode",
      "hrName",
      "contactNumber",
      "emailId",
    ];
    const validQuestions =
      formData.interviewQuestions.filter((q) => q.trim() !== "").length >= 5;
    return (
      requiredFields.every((field) => formData[field].trim() !== "") &&
      validQuestions
    );
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Building,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-100",
      activeBgColor: "bg-blue-100",
      activeTextColor: "text-blue-800",
      activeBorderColor: "border-blue-200",
    },
    {
      id: "feedback",
      label: "Interview Feedback",
      icon: MessageSquare,
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
      borderColor: "border-teal-100",
      activeBgColor: "bg-teal-100",
      activeTextColor: "text-teal-800",
      activeBorderColor: "border-teal-200",
    },
    {
      id: "history",
      label: "Submission History",
      icon: Calendar,
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-100",
      activeBgColor: "bg-amber-100",
      activeTextColor: "text-amber-800",
      activeBorderColor: "border-amber-200",
    },
  ];

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50">
      <div className="p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="mb-4 xs:mb-5 sm:mb-6 text-center md:text-left">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900">
            Interview Feedback
          </h1>
          <p className="text-xs xs:text-sm text-gray-500 font-medium">
            Manage your interview feedback submissions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 xs:gap-3 mb-6 xs:mb-7 sm:mb-8">
          {navItems.map((item) => (
            <button
              key={`nav-box-${item.id}`}
              onClick={() => setActiveSection(item.id)}
              className={`
                    p-3 xs:p-4 rounded-lg border flex flex-col items-center text-center transition-all duration-200 ease-in-out
                    ${item.bgColor} ${item.textColor} ${item.borderColor}
                    ${
                      activeSection === item.id
                        ? `border-2 font-bold shadow-sm ${item.activeBgColor} ${item.activeTextColor} ${item.activeBorderColor}`
                        : "hover:shadow-md font-medium"
                    }
                  `}
            >
              <item.icon className="w-4 h-4 xs:w-5 xs:h-5 mb-1.5 xs:mb-2" />
              <span className="text-xs xs:text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </div>

        {activeSection === "dashboard" && (
          <div className="space-y-4 xs:space-y-5 sm:space-y-6">
            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800">
              Interview Status Dashboard
            </h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 xs:p-4 sm:p-5 md:p-6">
              <h3 className="text-base xs:text-lg font-bold text-gray-800 mb-3 xs:mb-4">
                Have you attended an interview?
              </h3>
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4">
                <button
                  onClick={() => setHasAttendedInterview(true)}
                  className={`px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg font-bold transition-colors text-sm xs:text-base ${
                    hasAttendedInterview
                      ? "bg-green-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                  }`}
                >
                  Yes, I have
                </button>
                <button
                  onClick={() => setHasAttendedInterview(false)}
                  className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                    !hasAttendedInterview
                      ? "bg-red-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                  }`}
                >
                  No, not yet
                </button>
              </div>
            </div>

            {hasAttendedInterview && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-bold text-blue-800">
                    Interview Feedback Required
                  </h3>
                </div>
                <p className="text-blue-700 mb-4 font-medium">
                  Please provide your interview details so our dedicated Koluvu
                  team can work on collecting feedback from the employer and
                  follow up accordingly.
                </p>
                <button
                  onClick={() => setActiveSection("feedback")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md font-bold"
                >
                  Submit Interview Details
                </button>
              </div>
            )}

            {!hasAttendedInterview && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-amber-600 mr-2" />
                  <h3 className="text-lg font-bold text-amber-800">
                    No Interview Yet
                  </h3>
                </div>
                <p className="text-amber-700 font-medium">
                  Once you attend an interview, please return here to submit
                  your feedback details.
                </p>
              </div>
            )}
          </div>
        )}

        {activeSection === "feedback" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Interview Feedback Form
            </h2>

            {showSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-bold">
                    Interview feedback submitted successfully!
                  </span>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("companyDetails")}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-indigo-600 mr-3" />
                    <h3 className="text-lg font-bold text-gray-800">
                      Company Details
                    </h3>
                  </div>
                  {expandedSections.companyDetails ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.companyDetails && (
                  <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter company name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Position Attended *
                      </label>
                      <input
                        type="text"
                        value={formData.position}
                        onChange={(e) =>
                          handleInputChange("position", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter position/role"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Department Attended *
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) =>
                          handleInputChange("department", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter department"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Date of Interview *
                      </label>
                      <input
                        type="date"
                        value={formData.interviewDate}
                        onChange={(e) =>
                          handleInputChange("interviewDate", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Mode of Interview *
                      </label>
                      <select
                        value={formData.interviewMode}
                        onChange={(e) =>
                          handleInputChange("interviewMode", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select mode</option>
                        <option value="In-person">In-person</option>
                        <option value="Video Call">Video Call</option>
                        <option value="Phone Call">Phone Call</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Company Primary Email *
                      </label>
                      <input
                        type="email"
                        value={formData.companyPrimaryEmail}
                        onChange={(e) =>
                          handleInputChange(
                            "companyPrimaryEmail",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter company's primary email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Company Secondary Email *
                      </label>
                      <input
                        type="email"
                        value={formData.companySecondaryEmail}
                        onChange={(e) =>
                          handleInputChange(
                            "companySecondaryEmail",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter company's secondary email"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("hrDetails")}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-teal-600 mr-3" />
                    <h3 className="text-lg font-bold text-gray-800">
                      HR Details
                    </h3>
                  </div>
                  {expandedSections.hrDetails ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.hrDetails && (
                  <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        HR Name *
                      </label>
                      <input
                        type="text"
                        value={formData.hrName}
                        onChange={(e) =>
                          handleInputChange("hrName", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter HR name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.contactNumber}
                        onChange={(e) =>
                          handleInputChange("contactNumber", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter contact number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Email ID *
                      </label>
                      <input
                        type="email"
                        value={formData.emailId}
                        onChange={(e) =>
                          handleInputChange("emailId", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection("interviewQuestions")}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <MessageSquare className="w-5 h-5 text-amber-600 mr-3" />
                    <h3 className="text-lg font-bold text-gray-800">
                      Interview Questions *
                      <span className="ml-2 text-sm font-normal text-gray-500">
                        (Minimum 5 required, Maximum 10 allowed)
                      </span>
                    </h3>
                  </div>
                  {expandedSections.interviewQuestions ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.interviewQuestions && (
                  <div className="px-6 pb-6">
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={addQuestion}
                        disabled={formData.interviewQuestions.length >= 10}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm font-bold"
                      >
                        Add Question
                      </button>
                    </div>

                    {formData.interviewQuestions.map((question, index) => (
                      <div key={index} className="mb-4 flex gap-3">
                        <div className="flex-1">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Question {index + 1}
                          </label>
                          <textarea
                            value={question}
                            onChange={(e) =>
                              handleQuestionChange(index, e.target.value)
                            }
                            placeholder="Write genuinely what was asked"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows="2"
                          />
                        </div>
                        {formData.interviewQuestions.length > 5 && (
                          <button
                            type="button"
                            onClick={() => removeQuestion(index)}
                            className="mt-6 px-3 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm font-bold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}

                    <div className="mt-2 text-sm text-gray-500 font-medium">
                      Note: At least 5 questions must be filled out.
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleSection("companyReview")}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-purple-600 mr-3" />
                    <h3 className="text-lg font-bold text-gray-800">
                      Company Review
                    </h3>
                  </div>
                  {expandedSections.companyReview ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedSections.companyReview && (
                  <div className="px-6 pb-6">
                    <textarea
                      value={formData.companyReview}
                      onChange={(e) =>
                        handleInputChange("companyReview", e.target.value)
                      }
                      placeholder="Share your overall experience about the company, interview process, work environment, culture, or any other observations..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows="4"
                    />
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      Optional: Your honest review will help other candidates
                      and improve the interview process.
                    </p>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid()}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md font-bold"
                >
                  Submit Interview Feedback
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "history" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Submission History
            </h2>

            {submissions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  No interview feedback submissions yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {submission.companyName}
                        </h3>
                        <p className="text-gray-600 font-medium">
                          {submission.position} - {submission.department}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full font-bold">
                        Pending Review
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <strong className="font-bold">Interview Date:</strong>
                        <br />
                        {new Date(
                          submission.interviewDate
                        ).toLocaleDateString()}
                      </div>
                      <div>
                        <strong className="font-bold">Mode:</strong>
                        <br />
                        {submission.interviewMode}
                      </div>
                      <div>
                        <strong className="font-bold">HR Contact:</strong>
                        <br />
                        {submission.hrName}
                      </div>
                      <div>
                        <strong className="font-bold">Submitted:</strong>
                        <br />
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Wrapper component that provides the QueryClient
const InterviewFeedbackApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <InterviewFeedbackContent />
    </QueryClientProvider>
  );
};

export default InterviewFeedbackApp;
