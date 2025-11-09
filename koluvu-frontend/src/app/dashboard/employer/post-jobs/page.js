// src/app/main/dashboard/employer/post-jobs/page.js

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiCheck,
  FiPlus,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
} from "react-icons/fi";
console.log("PostJobPage rendered");
// Predefined options
const jobTitleOptions = [
  "Software Engineer",
  "Senior Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "Medical Biller",
  "Medical Coder",
  "Nurse",
  "Physician",
  "Accountant",
  "HR Manager",
  "Marketing Manager",
  "Sales Representative",
  "Product Manager",
  "Project Manager",
  "UI/UX Designer",
  "Graphic Designer",
  "Business Analyst",
  "Data Analyst",
];

const departmentOptions = [
  "Engineering",
  "Technology",
  "Administration",
  "Healthcare",
  "Finance",
  "Human Resources",
  "Marketing",
  "Sales",
  "Operations",
  "Customer Support",
  "Research & Development",
  "Quality Assurance",
  "Legal",
];

const locationOptions = [
  "Remote",
  "New York, NY",
  "San Francisco, CA",
  "Los Angeles, CA",
  "Chicago, IL",
  "Austin, TX",
  "Seattle, WA",
  "Boston, MA",
  "Denver, CO",
  "Atlanta, GA",
  "Miami, FL",
  "Dallas, TX",
  "Mumbai, India",
  "Bangalore, India",
  "Delhi, India",
  "Hyderabad, India",
  "London, UK",
  "Toronto, Canada",
];

const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Banking",
  "Education",
  "Manufacturing",
  "Retail",
  "E-commerce",
  "Hospitality",
  "Real Estate",
  "Telecommunications",
  "Media & Entertainment",
  "Consulting",
  "Legal Services",
  "Pharmaceuticals",
];

const skillsOptions = [
  "JavaScript",
  "Python",
  "Java",
  "React",
  "Node.js",
  "SQL",
  "AWS",
  "Docker",
  "Communication",
  "Leadership",
  "Problem Solving",
  "Medical Billing",
  "Healthcare Management",
  "Project Management",
  "Data Analysis",
];

const initialFormData = {
  atsKeywords: "",
  // Basic Information
  jobTitle: "",
  jobType: "full_time",
  department: "",
  location: "",
  employmentType: "On-site",
  experienceMin: "",
  experienceMax: "",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "INR",
  applicationDeadline: "",

  // Job Description
  jobBrief: "",
  responsibilities: "",
  requirements: "",
  faqs: [{ question: "", answer: "" }],

  // About Company
  companyDescription: "",
  companyWebsite: "",
  companySize: "",
  companyIndustry: "",
  companyBenefits: "",

  // Applicable Questions (Screening)
  screeningQuestions: [{ question: "", required: true, type: "text" }],

  // Hiring Process
  hiringProcessStages: [
    { stage: "Application Review", duration: "1-2 days", description: "" },
    { stage: "Initial Screening", duration: "3-5 days", description: "" },
    { stage: "Final Interview", duration: "1 week", description: "" },
  ],

  // Additional fields
  skills: "",
  education: "",
  benefits: "",
  contactEmail: "",
  urgency: "normal",
  interviewMethod: "virtual",
  virtualPlatform: "Zoom",
};

// Autocomplete Input Component
function AutocompleteInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  allowCustom = true,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isCustom, setIsCustom] = useState(false);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue && options.length > 0) {
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowOptions(true);
    } else {
      setFilteredOptions(options);
      setShowOptions(true);
    }
  };

  const selectOption = (option) => {
    onChange(option);
    setShowOptions(false);
    setIsCustom(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowOptions(true)}
          onBlur={() => setTimeout(() => setShowOptions(false), 200)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required={required}
        />
        {showOptions && filteredOptions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map((option, idx) => (
              <div
                key={idx}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800"
                onMouseDown={() => selectOption(option)}
              >
                {option}
              </div>
            ))}
            {allowCustom && (
              <div
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-blue-600 font-medium border-t"
                onMouseDown={() => {
                  setIsCustom(true);
                  setShowOptions(false);
                }}
              >
                <FiEdit2 className="inline w-4 h-4 mr-2" />
                Enter custom value
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
console.log("PostJobPage rendered");
export default function PostJobPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const router = useRouter();

  const steps = [
    { num: 1, title: "Basic Information" },
    { num: 2, title: "Job Description" },
    { num: 3, title: "About Company" },
    { num: 4, title: "Applicable Questions" },
    { num: 5, title: "Hiring Process" },
    { num: 6, title: "Confirmation" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (arrayName, defaultItem) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItem],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      if (!formData.jobTitle || !formData.location || !formData.contactEmail) {
        alert(
          "Please fill in all required fields: Job Title, Location, and Contact Email"
        );
        return false;
      }
    } else if (stepNum === 2) {
      if (!formData.jobBrief) {
        alert("Please provide a Job Brief");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 6) setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setApiError("");

    try {
      // Check authentication
      const authCheck = await fetch("/api/auth/verify-token", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!authCheck.ok) {
        setApiError(
          "You must be logged in to post a job. Please log in again."
        );
        setSubmitting(false);
        return;
      }

      // Helper function to convert text to array
      const textToArray = (text) => {
        if (!text || typeof text !== "string") return [];
        return text
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item !== "");
      };

      // Prepare data for backend
      const jobData = {
        ats_keywords: formData.atsKeywords,
        title: formData.jobTitle,
        job_type: formData.jobType,
        department: formData.department,
        location: formData.location,
        employment_type: formData.employmentType,
        experience_min: parseInt(formData.experienceMin) || 0,
        experience_max: parseInt(formData.experienceMax) || 0,
        salary_min: parseFloat(formData.salaryMin) || null,
        salary_max: parseFloat(formData.salaryMax) || null,
        salary_currency: formData.salaryCurrency,
        application_deadline: formData.applicationDeadline,

        // Job Description fields - convert text to arrays
        job_brief: formData.jobBrief,
        responsibilities: textToArray(formData.responsibilities),
        requirements: textToArray(formData.requirements),
        faqs: formData.faqs.filter((faq) => faq.question && faq.answer),

        // Screening questions
        screening_questions: formData.screeningQuestions.filter(
          (q) => q.question
        ),

        // Hiring process
        hiring_process_stages: formData.hiringProcessStages.filter(
          (s) => s.stage
        ),

        // Additional fields - convert to arrays
        skills: textToArray(formData.skills),
        education: formData.education,
        benefits: textToArray(formData.benefits),
        contact_email: formData.contactEmail,
        urgency: formData.urgency,
        interview_method:
          formData.interviewMethod === "virtual" ? "virtual" : "walkin",
        virtual_platform: formData.virtualPlatform,

        // Company information
        employer_bio: formData.companyDescription,
        employer_website_url: formData.companyWebsite,
        industry: formData.companyIndustry,
        company_size: formData.companySize,
        company_benefits: formData.companyBenefits,

        // Required fields
        description: formData.jobBrief || "Job description",
      };

      // Print what is being sent to the backend
      console.log("Posting job data:", jobData);

      const res = await fetch("/api/employer/jobs/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(jobData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Format detailed error message
        let errorMessage =
          data.error || "Failed to post job. Please try again.";

        if (data.details && Object.keys(data.details).length > 0) {
          console.error("Validation errors:", data.details);
          errorMessage += "\n\nValidation errors:\n";
          Object.keys(data.details).forEach((field) => {
            const fieldErrors = Array.isArray(data.details[field])
              ? data.details[field].join(", ")
              : data.details[field];
            errorMessage += `${field}: ${fieldErrors}\n`;
          });
        }

        setApiError(errorMessage);
        setSubmitting(false);
        return;
      }

      alert("Job posted successfully!");
      // Build unique job URL
      const slugify = (str) =>
        String(str || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

      const companySlug = slugify(
        formData.companyIndustry || formData.companyName || "company"
      );
      const jobTitleSlug = slugify(formData.jobTitle);
      const jobTypeSlug = slugify(formData.jobType);
      const employmentTypeSlug = slugify(formData.employmentType);
      const jobUrl = `/dashboard/employer/jobs/${companySlug}/${jobTitleSlug}/${jobTypeSlug}/${employmentTypeSlug}`;
      router.push(jobUrl);
    } catch (err) {
      console.error("Error posting job:", err);
      setApiError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Header */}
        <div className="lg:hidden py-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Job Post</h1>
          <p className="text-sm text-gray-600 mt-1">
            Step {step} of {steps.length}
          </p>
        </div>

        {/* Mobile Progress Bar */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">
              {steps[step - 1].title}
            </span>
            <span className="text-xs text-gray-500">
              {Math.round((step / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 pb-8">
          {/* Left Sidebar - Steps Navigation (Desktop only) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Create Job Post
              </h2>
              <div className="space-y-4">
                {steps.map((s) => (
                  <div
                    key={s.num}
                    className={`flex items-center gap-3 cursor-pointer transition-colors ${
                      step === s.num
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setStep(s.num)}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                        step === s.num
                          ? "bg-blue-600 text-white"
                          : step > s.num
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step > s.num ? <FiCheck className="w-4 h-4" /> : s.num}
                    </div>
                    <span className="text-sm font-medium">{s.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
              {/* Step 1: Basic Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ATS Keywords (for resume matching)
                </label>
                <input
                  type="text"
                  value={formData.atsKeywords}
                  onChange={(e) => handleChange("atsKeywords", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. python, react, healthcare, billing"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma-separated keywords for ATS (not visible to applicants)
                </p>
              </div>
              {step === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Basic Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <AutocompleteInput
                      label="Job Title"
                      value={formData.jobTitle}
                      onChange={(value) => handleChange("jobTitle", value)}
                      options={jobTitleOptions}
                      placeholder="e.g. Medical Biller"
                      required={true}
                      allowCustom={true}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Type *
                      </label>
                      <select
                        value={formData.jobType}
                        onChange={(e) =>
                          handleChange("jobType", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="full_time">Full-time</option>
                        <option value="part_time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                        <option value="freelance">Freelance</option>
                      </select>
                    </div>

                    <AutocompleteInput
                      label="Department"
                      value={formData.department}
                      onChange={(value) => handleChange("department", value)}
                      options={departmentOptions}
                      placeholder="e.g. Administration"
                      required={false}
                      allowCustom={true}
                    />

                    <AutocompleteInput
                      label="Location"
                      value={formData.location}
                      onChange={(value) => handleChange("location", value)}
                      options={locationOptions}
                      placeholder="e.g. New York, NY"
                      required={true}
                      allowCustom={true}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employment Type *
                      </label>
                      <select
                        value={formData.employmentType}
                        onChange={(e) =>
                          handleChange("employmentType", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.applicationDeadline}
                        onChange={(e) =>
                          handleChange("applicationDeadline", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience (Min Years)
                      </label>
                      <input
                        type="number"
                        value={formData.experienceMin}
                        onChange={(e) =>
                          handleChange("experienceMin", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience (Max Years)
                      </label>
                      <input
                        type="number"
                        value={formData.experienceMax}
                        onChange={(e) =>
                          handleChange("experienceMax", e.target.value)
                        }
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary Min
                      </label>
                      <input
                        type="number"
                        value={formData.salaryMin}
                        onChange={(e) =>
                          handleChange("salaryMin", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary Max
                      </label>
                      <input
                        type="number"
                        value={formData.salaryMax}
                        onChange={(e) =>
                          handleChange("salaryMax", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={formData.salaryCurrency}
                        onChange={(e) =>
                          handleChange("salaryCurrency", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">USD</option>
                        <option value="INR">INR</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) =>
                        handleChange("contactEmail", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="recruiting@company.com"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Job Description */}
              {step === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Job Description
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Brief *
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 border-b border-gray-200 px-2 sm:px-3 py-2 flex items-center gap-1 sm:gap-2 overflow-x-auto">
                        <button
                          type="button"
                          className="p-1 hover:bg-gray-200 rounded text-xs sm:text-sm flex-shrink-0"
                          title="Bold"
                        >
                          <span className="font-bold">B</span>
                        </button>
                        <button
                          type="button"
                          className="p-1 hover:bg-gray-200 rounded text-xs sm:text-sm flex-shrink-0"
                          title="Italic"
                        >
                          <span className="italic">I</span>
                        </button>
                        <button
                          type="button"
                          className="p-1 hover:bg-gray-200 rounded text-xs sm:text-sm flex-shrink-0"
                          title="Underline"
                        >
                          <span className="underline">U</span>
                        </button>
                        <div className="w-px h-4 sm:h-5 bg-gray-300 mx-1"></div>
                        <button
                          type="button"
                          className="p-1 hover:bg-gray-200 rounded text-xs sm:text-sm flex-shrink-0"
                          title="Bullet List"
                        >
                          ⋮
                        </button>
                        <button
                          type="button"
                          className="p-1 hover:bg-gray-200 rounded text-xs sm:text-sm flex-shrink-0"
                          title="Numbered List"
                        >
                          ≡
                        </button>
                      </div>
                      <textarea
                        value={formData.jobBrief}
                        onChange={(e) =>
                          handleChange("jobBrief", e.target.value)
                        }
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm sm:text-base"
                        placeholder="We are looking for a Medical Biller to join our medical facility's administrative team..."
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Responsibilities
                    </label>
                    <textarea
                      value={formData.responsibilities}
                      onChange={(e) =>
                        handleChange("responsibilities", e.target.value)
                      }
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Write responsibilities (one per line or paragraph)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements and Skills
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) =>
                        handleChange("requirements", e.target.value)
                      }
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Write requirements and skills needed"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Frequently Asked Questions
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          addArrayItem("faqs", { question: "", answer: "" })
                        }
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                      >
                        <FiPlus className="w-4 h-4 mr-1" /> Add Question
                      </button>
                    </div>
                    {formData.faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="mb-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Question {index + 1}
                          </span>
                          {formData.faqs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeArrayItem("faqs", index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) =>
                            handleArrayChange(
                              "faqs",
                              index,
                              "question",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500"
                          placeholder="What does a Medical Biller do?"
                        />
                        <label className="block text-xs text-gray-600 mb-1">
                          Answer
                        </label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) =>
                            handleArrayChange(
                              "faqs",
                              index,
                              "answer",
                              e.target.value
                            )
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="A Medical Biller takes the claims dictated by a Medical Coder..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: About Company */}
              {step === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                    About Company
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Tell candidates about your company
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Description
                    </label>
                    <textarea
                      value={formData.companyDescription}
                      onChange={(e) =>
                        handleChange("companyDescription", e.target.value)
                      }
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Describe your company, its mission, culture, and what makes it a great place to work..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Website
                      </label>
                      <input
                        type="url"
                        value={formData.companyWebsite}
                        onChange={(e) =>
                          handleChange("companyWebsite", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="https://www.company.com"
                      />
                    </div>

                    <AutocompleteInput
                      label="Industry"
                      value={formData.companyIndustry}
                      onChange={(value) =>
                        handleChange("companyIndustry", value)
                      }
                      options={industryOptions}
                      placeholder="e.g. Healthcare, Technology, Finance"
                      required={false}
                      allowCustom={true}
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Size
                      </label>
                      <select
                        value={formData.companySize}
                        onChange={(e) =>
                          handleChange("companySize", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Benefits & Perks
                    </label>
                    <textarea
                      value={formData.companyBenefits}
                      onChange={(e) =>
                        handleChange("companyBenefits", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="List benefits: Health insurance, Remote work, Professional development, etc."
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Applicable Questions (Screening) */}
              {step === 4 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Applicable Questions
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Add screening questions to filter candidates
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Screening Questions
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("screeningQuestions", {
                          question: "",
                          required: true,
                          type: "text",
                        })
                      }
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <FiPlus className="w-4 h-4 mr-1" /> Add Question
                    </button>
                  </div>

                  {formData.screeningQuestions.map((q, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Question {index + 1}
                        </span>
                        {formData.screeningQuestions.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem("screeningQuestions", index)
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) =>
                          handleArrayChange(
                            "screeningQuestions",
                            index,
                            "question",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Do you have experience with medical billing software?"
                      />
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={q.required}
                            onChange={(e) =>
                              handleArrayChange(
                                "screeningQuestions",
                                index,
                                "required",
                                e.target.checked
                              )
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            Required
                          </span>
                        </label>
                        <select
                          value={q.type}
                          onChange={(e) =>
                            handleArrayChange(
                              "screeningQuestions",
                              index,
                              "type",
                              e.target.value
                            )
                          }
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="text">Text</option>
                          <option value="yes_no">Yes/No</option>
                          <option value="multiple_choice">
                            Multiple Choice
                          </option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 5: Hiring Process */}
              {step === 5 && (
                <div className="space-y-4 sm:space-y-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                    Hiring Process
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    Define the stages of your hiring process
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Process Stages
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        addArrayItem("hiringProcessStages", {
                          stage: "",
                          duration: "",
                          description: "",
                        })
                      }
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <FiPlus className="w-4 h-4 mr-1" /> Add Stage
                    </button>
                  </div>

                  {formData.hiringProcessStages.map((stage, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          Stage {index + 1}
                        </span>
                        {formData.hiringProcessStages.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem("hiringProcessStages", index)
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                        <input
                          type="text"
                          value={stage.stage}
                          onChange={(e) =>
                            handleArrayChange(
                              "hiringProcessStages",
                              index,
                              "stage",
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                          placeholder="Stage name"
                        />
                        <input
                          type="text"
                          value={stage.duration}
                          onChange={(e) =>
                            handleArrayChange(
                              "hiringProcessStages",
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                          placeholder="Duration (e.g. 1-2 days)"
                        />
                      </div>
                      <textarea
                        value={stage.description}
                        onChange={(e) =>
                          handleArrayChange(
                            "hiringProcessStages",
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Stage description (optional)"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Step 6: Preview */}
              {step === 6 && (
                <>
                  {/* Preview ATS Keywords, but do not show in posted job */}
                  {formData.atsKeywords && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        ATS Keywords
                      </h3>
                      <div className="space-y-1 text-sm">
                        {formData.atsKeywords.split(",").map((kw, i) => (
                          <span
                            key={i}
                            className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mb-1"
                          >
                            {kw.trim()}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        These keywords are used for resume matching and will not
                        be visible in the public job post.
                      </p>
                    </div>
                  )}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Confirmation
                    </h2>
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4">
                          Job Information
                        </h3>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium">Job Title:</span>{" "}
                            {formData.jobTitle}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span>{" "}
                            {formData.jobType}
                          </div>
                          <div>
                            <span className="font-medium">Location:</span>{" "}
                            {formData.location}
                          </div>
                          <div>
                            <span className="font-medium">Department:</span>{" "}
                            {formData.department || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">
                              Employment Type:
                            </span>{" "}
                            {formData.employmentType}
                          </div>
                          {formData.salaryMin && formData.salaryMax && (
                            <div>
                              <span className="font-medium">Salary Range:</span>{" "}
                              {formData.salaryCurrency} {formData.salaryMin} -{" "}
                              {formData.salaryMax}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Deadline:</span>{" "}
                            {formData.applicationDeadline || "N/A"}
                          </div>
                        </div>
                      </div>

                      {formData.companyDescription && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Company Information
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="font-medium">Industry:</span>{" "}
                              {formData.companyIndustry || "N/A"}
                            </div>
                            <div>
                              <span className="font-medium">Company Size:</span>{" "}
                              {formData.companySize || "N/A"}
                            </div>
                            <div>
                              <span className="font-medium">Website:</span>{" "}
                              {formData.companyWebsite || "N/A"}
                            </div>
                            {formData.companyDescription && (
                              <div className="mt-2">
                                <span className="font-medium">
                                  Description:
                                </span>
                                <p className="text-gray-600 mt-1">
                                  {formData.companyDescription.substring(
                                    0,
                                    150
                                  )}
                                  ...
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-green-900 mb-2">
                          Summary
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            ✓{" "}
                            {
                              formData.faqs.filter(
                                (f) => f.question && f.answer
                              ).length
                            }{" "}
                            FAQs added
                          </div>
                          <div>
                            ✓{" "}
                            {
                              formData.screeningQuestions.filter(
                                (q) => q.question
                              ).length
                            }{" "}
                            Screening questions
                          </div>
                          <div>
                            ✓{" "}
                            {
                              formData.hiringProcessStages.filter(
                                (s) => s.stage
                              ).length
                            }{" "}
                            Hiring process stages
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {apiError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="text-red-900 font-semibold mb-2">Error</h4>
                      <pre className="text-red-800 text-sm whitespace-pre-wrap font-mono">
                        {apiError}
                      </pre>
                    </div>
                  )}

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      Please review all information carefully before submitting.
                      Once published, your job posting will be visible to job
                      seekers.
                    </p>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    step === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Previous
                </button>

                {step < 6 ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`px-6 py-2 rounded-lg font-medium ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white flex items-center`}
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FiCheck className="w-5 h-5 mr-2" />
                        Submit & Post Job
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
