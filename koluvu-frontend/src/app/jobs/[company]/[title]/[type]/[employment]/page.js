"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  Share2,
  Globe,
  Linkedin,
  Facebook,
  Instagram,
  ChevronLeft,
  Calendar,
  Award,
  GraduationCap,
  Building,
  Mail,
  Phone,
  Twitter,
  Github,
  AlertCircle,
  CheckCircle,
  Star,
  TrendingUp,
} from "lucide-react";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
    screeningAnswers: {},
  });
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const slugify = (str) =>
    String(str || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/jobs?public=true");
        const data = await res.json();
        let jobs = data.results || data.data || data;
        if (!Array.isArray(jobs)) jobs = [];

        const found = jobs.find((j) => {
          return (
            slugify(j.company_name || j.company || "") === params.company &&
            slugify(j.title || "") === params.title &&
            slugify(j.job_type || j.type || "") === params.type &&
            slugify(j.employment_type || j.employment || "") ===
              params.employment
          );
        });

        if (found) {
          setJob(found);

          // Debug logging to see what data we actually have
          console.log("=== JOB DATA DEBUG ===");
          console.log("Full job object:", found);
          console.log("Job fields check:");
          console.log("- job_brief:", found.job_brief);
          console.log("- description:", found.description);
          console.log("- responsibilities:", found.responsibilities);
          console.log("- requirements:", found.requirements);
          console.log("- skills:", found.skills);
          console.log("- skills_required:", found.skills_required);
          console.log("- benefits:", found.benefits);
          console.log("- perks:", found.perks);
          console.log("- faqs:", found.faqs);
          console.log("- screening_questions:", found.screening_questions);
          console.log("- hiring_process_stages:", found.hiring_process_stages);
          console.log("- language_proficiency:", found.language_proficiency);
          console.log("- candidate_profile:", found.candidate_profile);
          console.log("- additional_notes:", found.additional_notes);
          console.log("- employer_bio:", found.employer_bio);
          console.log("- company_benefits:", found.company_benefits);
          console.log("- company_size:", found.company_size);
          console.log("- industry:", found.industry);
          console.log("=== END DEBUG ===");

          // Initialize screening answers
          if (found.screening_questions?.length > 0) {
            const initialAnswers = {};
            found.screening_questions.forEach((q, idx) => {
              initialAnswers[idx] = "";
            });
            setApplicationData((prev) => ({
              ...prev,
              screeningAnswers: initialAnswers,
            }));
          }
        } else {
          setError("Job not found");
        }
      } catch (err) {
        setError("Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [params.company, params.title, params.type, params.employment]);

  /**
   * Improved parseList function that handles:
   * - null/undefined → []
   * - Empty strings → []
   * - Arrays → filter empty items
   * - JSON strings → parse and filter
   * - Text with separators → split and filter
   */
  const parseList = (val) => {
    // Handle null, undefined, or empty values
    if (val === null || val === undefined) return [];
    
    // If already an array, filter empty items
    if (Array.isArray(val)) {
      return val
        .filter(item => item !== null && item !== undefined)
        .map(item => String(item).trim())
        .filter(item => item !== "");
    }

    // If it's a string, process it
    if (typeof val === "string") {
      // Handle empty string
      if (val.trim() === "") return [];
      
      // First try to parse as JSON
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          return parsed
            .filter(item => item !== null && item !== undefined)
            .map(item => String(item).trim())
            .filter(item => item !== "");
        }
      } catch (e) {
        // Not valid JSON, continue with string parsing
      }

      // Split by common separators
      // Priority: newlines > commas > semicolons > pipes
      let items;
      if (val.includes('\n')) {
        items = val.split(/\n+/);
      } else if (val.includes(',')) {
        items = val.split(',');
      } else if (val.includes(';')) {
        items = val.split(';');
      } else if (val.includes('|')) {
        items = val.split('|');
      } else {
        // Single item
        items = [val];
      }
      
      // Clean up items
      return items
        .map(s => s.trim())
        .filter(item => item !== "");
    }

    // For any other type, return empty array
    return [];
  };

  const formatSalary = (job) => {
    if (job.salary_min && job.salary_max) {
      return `${
        job.salary_currency || "INR"
      } ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`;
    } else if (job.salary_min) {
      return `${
        job.salary_currency || "INR"
      } ${job.salary_min.toLocaleString()}+`;
    } else if (job.payment) {
      return job.payment;
    }
    return "Not specified";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getJobTypeLabel = (type) => {
    const types = {
      full_time: "Full-time",
      part_time: "Part-time",
      contract: "Contract",
      internship: "Internship",
      temporary: "Temporary",
      freelance: "Freelance",
    };
    return types[type] || type;
  };

  const getExperienceLabel = (level) => {
    const levels = {
      entry: "Entry Level (0-1 years)",
      junior: "Junior (1-3 years)",
      mid: "Mid Level (3-5 years)",
      senior: "Senior (5-8 years)",
      lead: "Lead (8+ years)",
      executive: "Executive",
    };
    return levels[level] || level;
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append("job_id", job.id);
      formData.append("candidate_name", applicationData.name);
      formData.append("candidate_email", applicationData.email);
      formData.append("candidate_phone", applicationData.phone);
      formData.append("cover_letter", applicationData.coverLetter);
      if (applicationData.resume) {
        formData.append("resume", applicationData.resume);
      }
      formData.append(
        "screening_answers",
        JSON.stringify(applicationData.screeningAnswers)
      );

      const response = await fetch("/api/job-applications", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        setShowApplyModal(false);
        setApplicationData({
          name: "",
          email: "",
          phone: "",
          coverLetter: "",
          resume: null,
          screeningAnswers: {},
        });
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company_name}`,
        text: `Check out this job opportunity: ${job.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Job link copied to clipboard!");
    }
  };

  // Memoize parsed arrays to avoid re-parsing on every render
  const requirements = useMemo(
    () => parseList(job?.requirements),
    [job?.requirements]
  );
  
  const responsibilities = useMemo(
    () => parseList(job?.responsibilities),
    [job?.responsibilities]
  );
  
  const skills = useMemo(
    () => parseList(job?.skills || job?.skills_required),
    [job?.skills, job?.skills_required]
  );
  
  const benefits = useMemo(
    () => parseList(job?.benefits),
    [job?.benefits]
  );
  
  const perks = useMemo(
    () => parseList(job?.perks),
    [job?.perks]
  );
  
  const faqs = useMemo(
    () => Array.isArray(job?.faqs) ? job.faqs : [],
    [job?.faqs]
  );
  
  const screeningQuestions = useMemo(
    () => Array.isArray(job?.screening_questions) ? job.screening_questions : [],
    [job?.screening_questions]
  );
  
  const hiringProcess = useMemo(
    () => Array.isArray(job?.hiring_process_stages) ? job.hiring_process_stages : [],
    [job?.hiring_process_stages]
  );
  
  const languages = useMemo(
    () => Array.isArray(job?.language_proficiency) ? job.language_proficiency : [],
    [job?.language_proficiency]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-700">Loading job details...</div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <div className="text-lg text-red-600">{error || "Job not found"}</div>
          <button
            onClick={() => router.push("/jobs")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          className="flex items-center text-gray-700 hover:text-gray-900 font-medium mb-6 transition"
          onClick={() => router.push("/jobs")}
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Job Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {job.urgency === "urgent" && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                        URGENT
                      </span>
                    )}
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      {getJobTypeLabel(job.job_type)}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-gray-600">
                    at{" "}
                    <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                      {job.company_name}
                    </span>
                  </p>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Applications</div>
                  <div className="text-lg font-bold text-gray-900">
                    {job.applications_count || 0}
                  </div>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Views</div>
                  <div className="text-lg font-bold text-gray-900">
                    {job.views_count || 0}
                  </div>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Posted</div>
                  <div className="text-sm font-bold text-gray-900">
                    {job.created_at
                      ? new Date(job.created_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                  <div className="text-xs text-gray-600">Deadline</div>
                  <div className="text-sm font-bold text-gray-900">
                    {job.application_deadline
                      ? new Date(job.application_deadline).toLocaleDateString()
                      : "Open"}
                  </div>
                </div>
              </div>

              {/* Job Info Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="grid grid-cols-5">
                  <div className="col-span-2 bg-gray-50 p-3 flex items-center gap-2 border-b border-r border-gray-200">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Location</span>
                  </div>
                  <div className="col-span-3 p-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-900">
                      {job.location}
                    </span>
                  </div>
                </div>

                {job.department && (
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 bg-gray-50 p-3 flex items-center gap-2 border-b border-r border-gray-200">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Department</span>
                    </div>
                    <div className="col-span-3 p-3 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-900">
                        {job.department}
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-5">
                  <div className="col-span-2 bg-gray-50 p-3 flex items-center gap-2 border-b border-r border-gray-200">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Employment Type
                    </span>
                  </div>
                  <div className="col-span-3 p-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-900">
                      {job.employment_type || "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-5">
                  <div className="col-span-2 bg-gray-50 p-3 flex items-center gap-2 border-b border-r border-gray-200">
                    <Award className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Experience Level
                    </span>
                  </div>
                  <div className="col-span-3 p-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-900">
                      {getExperienceLabel(job.experience_level)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-5">
                  <div className="col-span-2 bg-gray-50 p-3 flex items-center gap-2 border-b border-r border-gray-200">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Salary</span>
                  </div>
                  <div className="col-span-3 p-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-900">
                      {formatSalary(job)}
                    </span>
                  </div>
                </div>

                {job.education_level && (
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 bg-gray-50 p-3 flex items-center gap-2 border-b border-r border-gray-200">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Education</span>
                    </div>
                    <div className="col-span-3 p-3 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-900">
                        {job.education_level.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                {job.interview_method && (
                  <div className="grid grid-cols-5">
                    <div className="col-span-2 bg-gray-50 p-3 flex items-center gap-2 border-r border-gray-200">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Interview Method
                      </span>
                    </div>
                    <div className="col-span-3 p-3">
                      <span className="text-sm font-medium text-gray-900">
                        {job.interview_method === "virtual"
                          ? "Virtual Interview"
                          : job.interview_method === "walkin"
                          ? "Walk-in Interview"
                          : "Hybrid"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Job Brief */}
              {job.job_brief && job.job_brief.trim() && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Job Overview
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {job.job_brief}
                  </p>
                </div>
              )}

              {/* Job Description */}
              {job.description && job.description.trim() && (
                <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                    Job Description
                  </h2>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Fallback message only if NO content exists */}
              {!job.description?.trim() && 
               !job.job_brief?.trim() && 
               responsibilities.length === 0 && 
               requirements.length === 0 && (
                <div className="mb-6 bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-lg border-2 border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-gray-600" />
                    Job Details
                  </h2>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-600 leading-relaxed italic">
                      Detailed job information is being updated. Please contact the employer
                      for more details about this position.
                    </p>
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {responsibilities.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Key Responsibilities
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <ul className="space-y-3">
                      {responsibilities.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                            {idx + 1}
                          </div>
                          <span className="text-gray-700 flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {requirements.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-600" />
                    Job Requirements
                  </h2>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <ul className="space-y-3">
                      {requirements.map((req, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition"
                        >
                          <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 flex-1">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 ? (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-indigo-600" />
                    Required Skills & Technologies
                  </h2>
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
                    <div className="flex flex-wrap gap-3">
                      {skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition transform"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                (job.skills || job.skills_required) && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-6 h-6 text-indigo-600" />
                      Required Skills & Technologies
                    </h2>
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
                      <p className="text-gray-700 leading-relaxed">
                        {job.skills || job.skills_required}
                      </p>
                    </div>
                  </div>
                )
              )}

              {/* Language Proficiency */}
              {languages.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-teal-600" />
                    Language Requirements
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map((lang, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-2 border-teal-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900 text-lg">
                            {lang.language || lang}
                          </span>
                          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                            {lang.proficiency || "Required"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits & Perks */}
              {(benefits.length > 0 || perks.length > 0) && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                    Benefits & Perks
                  </h2>
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...benefits, ...perks].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition"
                        >
                          <div className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="text-gray-700 flex-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Hiring Process */}
              {hiringProcess.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                    Hiring Process
                  </h2>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                    <div className="space-y-6">
                      {hiringProcess.map((stage, idx) => (
                        <div key={idx} className="relative">
                          {idx < hiringProcess.length - 1 && (
                            <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-blue-300"></div>
                          )}
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg z-10">
                              {idx + 1}
                            </div>
                            <div className="flex-1 bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition">
                              <h3 className="font-bold text-gray-900 text-lg mb-2">
                                {stage.stage || stage}
                              </h3>
                              {stage.description && (
                                <p className="text-sm text-gray-600 mb-2">
                                  {stage.description}
                                </p>
                              )}
                              {stage.duration && (
                                <div className="flex items-center gap-2 text-xs text-blue-600">
                                  <Clock className="w-4 h-4" />
                                  <span className="font-medium">
                                    Duration: {stage.duration}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FAQs */}
              {faqs.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-purple-600" />
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-2 border-purple-200 rounded-lg p-5 hover:shadow-lg transition"
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            Q{idx + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-3 text-lg">
                              {faq.question}
                            </h3>
                            <div className="flex gap-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                                A
                              </div>
                              <p className="text-gray-700 leading-relaxed flex-1">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Candidate Profile */}
              {job.candidate_profile && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6 text-orange-600" />
                    Ideal Candidate Profile
                  </h2>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border-2 border-orange-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {job.candidate_profile}
                    </p>
                  </div>
                </div>
              )}

              {/* Education Requirements */}
              {(job.education || job.education_level) && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                    Education Requirements
                  </h2>
                  <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                    {job.education_level && (
                      <div className="mb-4 flex items-center gap-3">
                        <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                          Minimum:{" "}
                          {job.education_level.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                    )}
                    {job.education && (
                      <p className="text-gray-700 leading-relaxed">
                        {job.education}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Screening Questions */}
              {screeningQuestions.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    Screening Questions
                  </h2>
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      You will be asked to answer these questions during the
                      application process.
                    </p>
                    <div className="space-y-4">
                      {screeningQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-600"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {idx + 1}
                            </span>
                            <div className="flex-1">
                              <p className="text-gray-900 font-medium">
                                {q.question || q}
                              </p>
                              {q.required && (
                                <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                                  Required
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Preferences */}
              {job.contact_preferences &&
                job.contact_preferences.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Mail className="w-6 h-6 text-green-600" />
                      Contact Preferences
                    </h2>
                    <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                      <div className="flex flex-wrap gap-2">
                        {job.contact_preferences.map((pref, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold"
                          >
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              {/* Additional Notes */}
              {job.additional_notes && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-gray-600" />
                    Additional Information
                  </h2>
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-6 border-2 border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {job.additional_notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Company Info */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center gap-4 mb-4">
                  {job.employer_logo_url || job.company_logo_url ? (
                    <img
                      src={job.employer_logo_url || job.company_logo_url}
                      alt={job.company_name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {job.company_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.company_name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      {job.industry && (
                        <p className="text-sm text-gray-600">{job.industry}</p>
                      )}
                      {job.industry && job.company_size && (
                        <span className="text-gray-400">•</span>
                      )}
                      {job.company_size && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {job.company_size} employees
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {job.employer_bio && job.employer_bio.trim() ? (
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-2">
                      About the Company
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {job.employer_bio}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-2">
                      About the Company
                    </h4>
                    <p className="text-gray-600 italic">
                      Company information not available. Please visit the
                      company website or contact them directly for more details.
                    </p>
                  </div>
                )}

                {job.company_benefits && job.company_benefits.trim() && (
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-2">
                      Company Benefits & Culture
                    </h4>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {job.company_benefits}
                      </p>
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                {(job.employer_email ||
                  job.employer_phone ||
                  job.employer_website_url) && (
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-3">
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      {job.employer_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <a
                            href={`mailto:${job.employer_email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {job.employer_email}
                          </a>
                        </div>
                      )}
                      {job.employer_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <a
                            href={`tel:${job.employer_phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {job.employer_phone}
                          </a>
                        </div>
                      )}
                      {job.employer_website_url && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-500" />
                          <a
                            href={job.employer_website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {job.employer_website_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Media */}
                <div className="flex gap-3">
                  {job.employer_linkedin_url && (
                    <a
                      href={job.employer_linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Linkedin className="w-5 h-5 text-blue-600" />
                    </a>
                  )}
                  {job.employer_social_media?.twitter && (
                    <a
                      href={job.employer_social_media.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Twitter className="w-5 h-5 text-blue-400" />
                    </a>
                  )}
                  {job.employer_social_media?.facebook && (
                    <a
                      href={job.employer_social_media.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                    </a>
                  )}
                  {job.employer_social_media?.instagram && (
                    <a
                      href={job.employer_social_media.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Instagram className="w-5 h-5 text-pink-600" />
                    </a>
                  )}
                  {job.employer_social_media?.github && (
                    <a
                      href={job.employer_social_media.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Github className="w-5 h-5 text-gray-900" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Apply Button */}
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
              >
                Apply to Job
              </button>

              {/* Quick Info Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Job Summary</h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Location</div>
                      <div className="text-sm font-medium text-gray-900">
                        {job.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Job Type</div>
                      <div className="text-sm font-medium text-gray-900">
                        {getJobTypeLabel(job.job_type)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Experience</div>
                      <div className="text-sm font-medium text-gray-900">
                        {job.experience_min && job.experience_max
                          ? `${job.experience_min}-${job.experience_max} years`
                          : getExperienceLabel(job.experience_level)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Salary</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatSalary(job)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Deadline</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(job.application_deadline)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Card */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  {job.employer_logo_url || job.company_logo_url ? (
                    <img
                      src={job.employer_logo_url || job.company_logo_url}
                      alt={job.company_name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {job.company_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                      {job.company_name}
                    </h3>
                    {job.industry && (
                      <p className="text-xs text-gray-600 truncate">
                        {job.industry}
                      </p>
                    )}
                    {job.company_size && (
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          <Users className="w-3 h-3" />
                          {job.company_size}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {job.employer_website_url && (
                  <a
                    href={job.employer_website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
                  >
                    <Globe className="w-4 h-4" />
                    Visit Website
                  </a>
                )}

                {job.employer_bio && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-bold text-gray-900 mb-2">
                      About
                    </h4>
                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">
                      {job.employer_bio}
                    </p>
                  </div>
                )}

                {/* Social Links */}
                {(job.employer_linkedin_url || job.employer_social_media) && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">
                      Connect
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {job.employer_linkedin_url && (
                        <a
                          href={job.employer_linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          <Linkedin className="w-4 h-4 text-blue-600" />
                        </a>
                      )}
                      {job.employer_social_media?.twitter && (
                        <a
                          href={job.employer_social_media.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          <Twitter className="w-4 h-4 text-blue-400" />
                        </a>
                      )}
                      {job.employer_social_media?.facebook && (
                        <a
                          href={job.employer_social_media.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          <Facebook className="w-4 h-4 text-blue-600" />
                        </a>
                      )}
                      {job.employer_social_media?.instagram && (
                        <a
                          href={job.employer_social_media.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          <Instagram className="w-4 h-4 text-pink-600" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Apply CTA */}
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
              >
                Apply Now
              </button>

              <div className="text-center text-xs text-gray-500">
                Powered by{" "}
                <span className="font-semibold text-blue-600">Teera</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Apply for {job.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    at {job.company_name}
                  </p>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Personal Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={applicationData.name}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={applicationData.email}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={applicationData.phone}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={applicationData.coverLetter}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        coverLetter: e.target.value,
                      })
                    }
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us why you're a great fit for this role..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume/CV <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        resume: e.target.files[0],
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>

                {/* Screening Questions */}
                {screeningQuestions.length > 0 && (
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Screening Questions
                    </h3>
                    {screeningQuestions.map((question, idx) => (
                      <div key={idx} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {idx + 1}. {question.question || question}
                          {question.required && (
                            <span className="text-red-500"> *</span>
                          )}
                        </label>
                        {question.type === "multiple_choice" ? (
                          <select
                            value={applicationData.screeningAnswers[idx] || ""}
                            onChange={(e) =>
                              setApplicationData({
                                ...applicationData,
                                screeningAnswers: {
                                  ...applicationData.screeningAnswers,
                                  [idx]: e.target.value,
                                },
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required={question.required}
                          >
                            <option value="">Select an option</option>
                            {question.options?.map((opt, optIdx) => (
                              <option key={optIdx} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <textarea
                            value={applicationData.screeningAnswers[idx] || ""}
                            onChange={(e) =>
                              setApplicationData({
                                ...applicationData,
                                screeningAnswers: {
                                  ...applicationData.screeningAnswers,
                                  [idx]: e.target.value,
                                },
                              })
                            }
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Your answer..."
                            required={question.required}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={
                      applying ||
                      !applicationData.name ||
                      !applicationData.email ||
                      !applicationData.phone ||
                      !applicationData.coverLetter ||
                      !applicationData.resume
                    }
                    className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition ${
                      applying ||
                      !applicationData.name ||
                      !applicationData.email ||
                      !applicationData.phone ||
                      !applicationData.coverLetter ||
                      !applicationData.resume
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {applying ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
