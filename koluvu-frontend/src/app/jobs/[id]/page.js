"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiMapPin,
  FiClock,
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiHome,
  FiLayers,
  FiAward,
  FiUsers,
  FiGlobe,
  FiMail,
  FiVideo,
  FiBookmark,
  FiSend,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiMonitor,
} from "react-icons/fi";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const { id } = params;
        if (!id) return;

        const apiUrl = `/api/employer/jobs/single?id=${encodeURIComponent(id)}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          if (response.status === 404) {
            setError("Job not found or no longer available");
          } else {
            setError(errData.error || "Failed to load job details");
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        setJob(data);
        setLoading(false);
      } catch (err) {
        setError(`Network error: ${err.message}`);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [params]);

  const handleApply = () => {
    if (job?.id) {
      router.push(`/apply/${job.id}`); // This is a page navigation, not an API call. No change needed unless you POST from here.
    }
  };

  const formatSalary = () => {
    if (!job) return "Not specified";
    if (job.salary_min && job.salary_max) {
      return `${
        job.salary_currency || "₹"
      }${job.salary_min.toLocaleString()} - ${
        job.salary_currency || "₹"
      }${job.salary_max.toLocaleString()}`;
    } else if (job.salary_min) {
      return `${job.salary_currency || "₹"}${job.salary_min.toLocaleString()}+`;
    }
    return "Not specified";
  };

  // Small, calm list renderer (Requirements / Responsibilities / Benefits)
  const renderList = (items, title) => {
    if (!items || (Array.isArray(items) && items.length === 0)) return null;
    const arr = Array.isArray(items) ? items : [];
    if (arr.length === 0) return null;

    // subtle accent colour per type (very soft)
    const borderColor =
      title === "Requirements"
        ? "border-l-amber-600"
        : title === "Responsibilities"
        ? "border-l-violet-600"
        : "border-l-emerald-600";

    const iconColor =
      title === "Requirements"
        ? "text-amber-600"
        : title === "Responsibilities"
        ? "text-violet-600"
        : "text-emerald-600";

    return (
      <section className={`bg-white border-l-4 ${borderColor} p-6 shadow-sm`}>
        <div className="flex items-center gap-3 mb-5">
          <FiCheckCircle className={`text-2xl ${iconColor}`} />
          <h3 className="text-xl font-serif font-bold text-gray-900">
            {title}
          </h3>
        </div>
        <ul className="space-y-3 text-base text-gray-700 columns-1 lg:columns-2 gap-6">
          {arr.map((it, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 break-inside-avoid mb-3"
            >
              <span
                className={`mt-0.5 font-bold ${
                  title === "Requirements"
                    ? "text-amber-600"
                    : title === "Responsibilities"
                    ? "text-violet-600"
                    : "text-emerald-600"
                }`}
              >
                •
              </span>
              <span className="leading-relaxed">{it}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  };

  const renderFaqs = () => {
    if (!job?.faqs || !Array.isArray(job.faqs) || job.faqs.length === 0)
      return null;
    return (
      <section className="bg-white border-l-4 border-cyan-600 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">❓</span>
          <h3 className="text-xl font-serif font-bold text-gray-900">
            Frequently Asked Questions
          </h3>
        </div>
        <div className="space-y-4">
          {job.faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border-b border-gray-200 pb-4 last:border-0"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full text-left py-2 flex items-center justify-between text-base"
              >
                <span className="font-semibold text-gray-900">
                  <span className="text-cyan-600 mr-2">Q{idx + 1}.</span>
                  {faq.question}
                </span>
                {expandedFaq === idx ? (
                  <FiChevronUp className="text-cyan-600 text-lg" />
                ) : (
                  <FiChevronDown className="text-gray-400 text-lg" />
                )}
              </button>
              {expandedFaq === idx && (
                <div className="pt-3 text-base text-gray-700 leading-relaxed pl-8">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderScreening = () => {
    if (
      !job?.screening_questions ||
      !Array.isArray(job.screening_questions) ||
      job.screening_questions.length === 0
    )
      return null;
    return (
      <section className="bg-white border-l-4 border-purple-600 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">📝</span>
          <h3 className="text-xl font-serif font-bold text-gray-900">
            Screening Questions
          </h3>
        </div>
        <ol className="list-decimal list-inside text-base text-gray-700 space-y-3 pl-2">
          {job.screening_questions.map((q, i) => (
            <li key={i} className="leading-relaxed">
              <span className="ml-2">{q.question}</span>
            </li>
          ))}
        </ol>
      </section>
    );
  };

  const renderHiringProcess = () => {
    if (
      !job?.hiring_process_stages ||
      !Array.isArray(job.hiring_process_stages) ||
      job.hiring_process_stages.length === 0
    )
      return null;
    return (
      <section className="bg-white border-l-4 border-orange-600 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-2xl">🎯</span>
          <h3 className="text-xl font-serif font-bold text-gray-900">
            Hiring Process
          </h3>
        </div>
        <div className="space-y-4 text-base text-gray-700">
          {job.hiring_process_stages.map((s, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-sm bg-orange-600 text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg">{s.stage}</div>
                {s.description && (
                  <div className="text-base text-gray-700 mt-2 leading-relaxed">
                    {s.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Loading / error / not found UI
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto" />
          <p className="mt-3 text-sm text-gray-600">Loading job details…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border p-6 shadow-sm max-w-md w-full text-center">
          <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
            <span className="text-red-600 font-bold">!</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/jobs")}
            className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm"
          >
            Browse all jobs
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border p-6 shadow-sm max-w-md w-full text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Job not found
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            The role you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/jobs")}
            className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm"
          >
            Browse all jobs
          </button>
        </div>
      </div>
    );
  }

  // Main render — two-column hybrid with company details last
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header / Title row */}
        <div className="mb-10 pb-6 border-b-2 border-amber-600">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-amber-700 uppercase tracking-widest font-semibold mb-3">
                Featured Role
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4 font-serif">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-md">
                  <FiHome className="text-blue-600" />
                  <span className="font-medium">{job.company_name}</span>
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-md">
                  <FiMapPin className="text-rose-600" />
                  <span className="font-medium">{job.location}</span>
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-md">
                  <FiBriefcase className="text-violet-600" />
                  <span className="font-medium">
                    {job.job_type?.replace("_", " ")}
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-md">
                  <FiClock className="text-emerald-600" />
                  <span className="font-medium">
                    {job.employment_type?.replace("_", " ")}
                  </span>
                </span>
              </div>
            </div>

            {/* small action area (keeps page compact) */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleApply}
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-sm text-sm font-semibold transition-colors"
              >
                <FiSend />
                Apply Now
              </button>
              <button className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-gray-400 px-4 py-2 rounded-sm text-sm text-gray-700 bg-white transition-colors">
                <FiBookmark />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Core layout - Magazine style */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column — long-form content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Snapshot / brief */}
            {job.job_brief && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-600 p-6 shadow-sm">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-2">
                  At a Glance
                </p>
                <p className="text-base leading-relaxed text-gray-800 font-serif italic">
                  {job.job_brief}
                </p>
              </div>
            )}

            {/* Job description */}
            <section className="bg-white border-t-4 border-blue-600 p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                The Role
              </h2>
              <div className="text-base text-gray-700 leading-relaxed">
                {job.description}
              </div>
            </section>

            {/* Requirements, Responsibilities, Skills, Benefits as chapters */}
            {renderList(job.requirements, "Requirements")}
            {renderList(job.responsibilities, "Responsibilities")}

            {(job.skills_required || job.skills) && (
              <section className="bg-white border-l-4 border-rose-600 p-6 shadow-sm">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <FiAward className="text-rose-600 text-2xl" />
                  Skills Required
                </h3>
                <div className="flex flex-wrap gap-3">
                  {Array.isArray(job.skills_required || job.skills)
                    ? (job.skills_required || job.skills).map((s, i) => (
                        <span
                          key={i}
                          className="text-sm px-4 py-2 rounded-sm bg-rose-100 text-rose-800 font-semibold border border-rose-200"
                        >
                          {s}
                        </span>
                      ))
                    : String(job.skills_required || job.skills)
                        .split(",")
                        .map((s, i) => (
                          <span
                            key={i}
                            className="text-sm px-4 py-2 rounded-sm bg-rose-100 text-rose-800 font-semibold border border-rose-200"
                          >
                            {s.trim()}
                          </span>
                        ))}
                </div>
              </section>
            )}

            {renderList(job.benefits, "Benefits & Perks")}

            {job.candidate_profile && (
              <section className="bg-white border-l-4 border-indigo-600 p-6 shadow-sm">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiUsers className="text-indigo-600 text-2xl" />
                  Ideal Candidate
                </h3>
                <div className="text-base text-gray-700 leading-relaxed">
                  {job.candidate_profile}
                </div>
              </section>
            )}

            {job.company_benefits && (
              <section className="bg-white border-l-4 border-teal-600 p-6 shadow-sm">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiAward className="text-teal-600 text-2xl" />
                  Company Benefits
                </h3>
                <div className="text-base text-gray-700 leading-relaxed">
                  {job.company_benefits}
                </div>
              </section>
            )}

            {job.additional_notes && (
              <section className="bg-white border-l-4 border-slate-600 p-6 shadow-sm">
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
                  Additional Information
                </h3>
                <div className="text-base text-gray-700 leading-relaxed">
                  {job.additional_notes}
                </div>
              </section>
            )}

            {renderHiringProcess()}
            {renderScreening()}
            {renderFaqs()}
          </div>

          {/* Right column — compact sticky job summary */}
          <aside className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <div className="bg-white border-t-4 border-amber-600 p-5 shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs text-amber-800 uppercase font-bold tracking-widest mb-2">
                      Salary Range
                    </h4>
                    <div className="text-xl font-bold text-gray-900">
                      {formatSalary()}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-sm bg-amber-100 flex items-center justify-center">
                    <FiDollarSign className="text-amber-600 text-xl" />
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                      Deadline
                    </p>
                    <p className="font-bold text-gray-900">
                      {new Date(job.application_deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                      Type
                    </p>
                    <p className="font-bold text-gray-900">
                      {job.job_type?.replace("_", " ")}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={handleApply}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-sm text-sm font-bold transition-colors"
                  >
                    <FiSend />
                    Apply
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-gray-400 px-4 py-3 rounded-sm text-sm text-gray-700 bg-white transition-colors">
                    <FiBookmark />
                  </button>
                </div>
              </div>

              <div className="bg-white border-t-4 border-blue-600 p-5 shadow-md">
                <h4 className="text-xs text-blue-800 uppercase font-bold tracking-widest mb-4">
                  Quick Facts
                </h4>
                <div className="space-y-3 text-sm text-gray-700">
                  {job.location && (
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <FiMapPin className="text-rose-600 text-lg" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <FiUsers className="text-violet-600 text-lg" />
                    <span className="font-medium">
                      {job.company_size || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiEye className="text-emerald-600 text-lg" />
                    <span className="font-medium">
                      {job.views_count || 0} views
                    </span>
                  </div>
                </div>
              </div>

              {/* Interview details small */}
              {job.interview_method && (
                <div className="bg-white border-t-4 border-violet-600 p-5 shadow-md">
                  <h4 className="text-xs text-violet-800 uppercase font-bold tracking-widest mb-4">
                    Interview Details
                  </h4>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center gap-3">
                      <FiVideo className="text-violet-600 text-lg" />
                      <span className="font-bold capitalize">
                        {job.interview_method.replace("_", " ")}
                      </span>
                    </div>
                    {job.interview_method === "virtual" &&
                      job.virtual_platform && (
                        <div className="text-sm text-gray-700 flex items-center gap-3 pl-8">
                          <FiMonitor className="text-blue-600" />
                          <span className="font-medium">
                            {job.virtual_platform}
                          </span>
                        </div>
                      )}
                    {job.interview_method === "walkin" &&
                      job.walkin_address && (
                        <div className="text-sm text-gray-700 flex items-center gap-3 pl-8">
                          <FiMapPin className="text-rose-600" />
                          <span className="font-medium">
                            {job.walkin_address}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* COMPANY DETAILS — full width at bottom */}
        <div className="mt-16">
          <div className="bg-white border-t-4 border-blue-600 p-8 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-sm bg-blue-100 flex items-center justify-center border-2 border-blue-600">
                <FiHome className="text-3xl text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-serif font-bold text-gray-900">
                  {job.company_name}
                </h3>
                {job.industry && (
                  <div className="text-base text-blue-700 mt-2 font-semibold">
                    {job.industry}
                  </div>
                )}
                {job.employer_bio && (
                  <p className="mt-4 text-base text-gray-700 leading-relaxed">
                    {job.employer_bio}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-700">
              {job.company_size && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
                    Team Size
                  </p>
                  <p className="font-bold text-base text-gray-900">
                    {job.company_size}
                  </p>
                </div>
              )}

              {job.location && (
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
                    Headquarters
                  </p>
                  <p className="font-bold text-base text-gray-900">
                    {job.location}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">
                  Contact
                </p>
                <div className="space-y-2">
                  {job.employer_email && (
                    <a
                      href={`mailto:${job.employer_email}`}
                      className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 font-medium"
                    >
                      <FiMail className="text-blue-600" />
                      {job.employer_email}
                    </a>
                  )}
                  {job.employer_website_url && (
                    <a
                      href={job.employer_website_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 font-medium"
                    >
                      <FiGlobe className="text-blue-600" />
                      Visit website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* small global styles for hiding horizontal scrollbar on belt */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
