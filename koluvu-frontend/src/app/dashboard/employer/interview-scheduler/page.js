// src/app/main/dashboard/employer/interview-scheduler/page.js
"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { toast } from "react-toastify";
import styles from "@koluvu/styles/employer/dashboard/interview-scheduler.module.css";

export default function InterviewScheduler() {
  const [interviewType, setInterviewType] = useState("video");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("11:00 AM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dynamic data states
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    statistics: {},
    todays_interviews: [],
    upcoming_interviews: [],
    live_interview: null,
  });

  const [formData, setFormData] = useState({
    candidate: "",
    jobPosition: "",
    interviewers: [],
    date: "",
    duration: "60",
    title: "",
    description: "",
    location: "",
    sendReminder: true,
  });

  useEffect(() => {
    // Load initial data
    loadAllData();

    // Initialize date picker
    flatpickr("#interviewDate", {
      minDate: "today",
      dateFormat: "Y-m-d",
      onChange: (selectedDates, dateStr) => {
        setFormData((prev) => ({ ...prev, date: dateStr }));
      },
    });
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadCandidates(),
        loadJobs(),
        loadInterviewers(),
        loadDashboardData(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async () => {
    try {
      const response = await fetch("/api/employer/candidates");
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          setCandidates(data);
        } else if (data && Array.isArray(data.results)) {
          // Handle paginated response format
          setCandidates(data.results);
        } else if (data && Array.isArray(data.candidates)) {
          // Handle nested candidates array
          setCandidates(data.candidates);
        } else {
          console.error("Candidates data is not in expected format:", data);
          setCandidates([]);
        }
      } else {
        console.error(
          "Failed to fetch candidates:",
          response.status,
          response.statusText
        );
        setCandidates([]);
      }
    } catch (error) {
      console.error("Failed to load candidates:", error);
      setCandidates([]);
    }
  };

  const loadJobs = async () => {
    try {
      const response = await fetch("/api/employer/jobs?status=active");
      if (response.ok) {
        const data = await response.json();
        setJobs(Array.isArray(data) ? data : data.jobs || []);
      }
    } catch (error) {
      console.error("Failed to load jobs:", error);
    }
  };

  const loadInterviewers = async () => {
    try {
      const response = await fetch("/api/employer/interviewers");
      if (response.ok) {
        const data = await response.json();
        setInterviewers(data);
      }
    } catch (error) {
      console.error("Failed to load interviewers:", error);
    }
  };

  const loadDashboardData = async () => {
    try {
      const response = await fetch("/api/employer/interviews/dashboard");
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelect = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData((prev) => ({ ...prev, interviewers: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !formData.candidate ||
        !formData.jobPosition ||
        !formData.date ||
        !formData.title
      ) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      if (formData.interviewers.length === 0) {
        toast.error("Please select at least one interviewer");
        setIsSubmitting(false);
        return;
      }

      // Convert time slot to 24-hour format
      const time24 = convertTimeTo24Hour(selectedTimeSlot);

      // Prepare interview data for backend
      const interviewData = {
        title: formData.title,
        description: formData.description,
        interview_type: interviewType,
        candidate: parseInt(formData.candidate),
        job_position: parseInt(formData.jobPosition),
        interviewers: formData.interviewers.map((id) => parseInt(id)),
        interview_date: formData.date,
        interview_time: time24,
        duration: parseInt(formData.duration),
        location: formData.location,
        send_reminder: formData.sendReminder,
        status: "scheduled",
      };

      console.log("Submitting interview data:", interviewData);

      const response = await fetch("/api/employer/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(interviewData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to schedule interview");
      }

      const result = await response.json();
      console.log("Interview created successfully:", result);

      toast.success("Interview scheduled successfully!");

      // Refresh dashboard data to show new interview
      await loadDashboardData();

      // Reset form
      setFormData({
        candidate: "",
        jobPosition: "",
        interviewers: [],
        date: "",
        duration: "60",
        title: "",
        description: "",
        location: "",
        sendReminder: true,
      });
      setSelectedTimeSlot("11:00 AM");

      // Clear date picker
      flatpickr("#interviewDate").clear();
    } catch (error) {
      console.error("Interview creation error:", error);
      toast.error(
        error.message || "Failed to schedule interview. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertTimeTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours.padStart(2, "0")}:${minutes || "00"}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Interview Scheduler - Bhuvih HR Solutions</title>
        <meta
          name="description"
          content="Schedule interviews with candidates"
        />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Schedule an Interview */}
          <div className="lg:w-7/12">
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white p-6">
                <h2 className="text-2xl font-bold">Schedule an Interview</h2>
                <p className="opacity-90">
                  Plan and organize candidate interviews efficiently
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  {/* Interview Type Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Interview Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        className={`border-2 rounded-lg p-5 cursor-pointer transition-all ${
                          interviewType === "video"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => setInterviewType("video")}
                      >
                        <h5 className="flex items-center font-semibold text-gray-800">
                          <svg
                            className="w-5 h-5 text-blue-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                          </svg>
                          Video Interview
                        </h5>
                        <p className="text-gray-500 text-sm mt-1 pl-7">
                          Face-to-face interview via video conference
                        </p>
                      </div>

                      <div
                        className={`border-2 rounded-lg p-5 cursor-pointer transition-all ${
                          interviewType === "phone"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => setInterviewType("phone")}
                      >
                        <h5 className="flex items-center font-semibold text-gray-800">
                          <svg
                            className="w-5 h-5 text-blue-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          Phone Interview
                        </h5>
                        <p className="text-gray-500 text-sm mt-1 pl-7">
                          Voice call interview via phone
                        </p>
                      </div>

                      <div
                        className={`border-2 rounded-lg p-5 cursor-pointer transition-all ${
                          interviewType === "inperson"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => setInterviewType("inperson")}
                      >
                        <h5 className="flex items-center font-semibold text-gray-800">
                          <svg
                            className="w-5 h-5 text-blue-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          In-Person
                        </h5>
                        <p className="text-gray-500 text-sm mt-1 pl-7">
                          Face-to-face interview at office location
                        </p>
                      </div>

                      <div
                        className={`border-2 rounded-lg p-5 cursor-pointer transition-all ${
                          interviewType === "assessment"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => setInterviewType("assessment")}
                      >
                        <h5 className="flex items-center font-semibold text-gray-800">
                          <svg
                            className="w-5 h-5 text-blue-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm1 8a1 1 0 100 2h6a1 1 0 100-2H7z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Assessment
                        </h5>
                        <p className="text-gray-500 text-sm mt-1 pl-7">
                          Technical or skill assessment session
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-6"></div>

                  {/* Candidate Selection */}
                  <div className="mb-6">
                    <label
                      htmlFor="candidateSelect"
                      className="block text-sm font-medium text-gray-700 mb-2 after:content-['*'] after:text-pink-500 after:ml-1"
                    >
                      Select Candidate
                    </label>
                    <select
                      id="candidateSelect"
                      name="candidate"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={formData.candidate}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        {Array.isArray(candidates) && candidates.length === 0
                          ? "No candidates available"
                          : "Choose a candidate"}
                      </option>
                      {Array.isArray(candidates) &&
                        candidates.map((candidate) => (
                          <option key={candidate.id} value={candidate.id}>
                            {candidate.name} -{" "}
                            {candidate.current_position || "No Position"}
                          </option>
                        ))}
                    </select>
                    {Array.isArray(candidates) && candidates.length === 0 && (
                      <p className="mt-1 text-sm text-red-500">
                        No candidates found. Add candidates first to schedule
                        interviews.
                      </p>
                    )}
                  </div>

                  {/* Job Position */}
                  <div className="mb-6">
                    <label
                      htmlFor="jobPosition"
                      className="block text-sm font-medium text-gray-700 mb-2 after:content-['*'] after:text-pink-500 after:ml-1"
                    >
                      Job Position
                    </label>
                    <select
                      id="jobPosition"
                      name="jobPosition"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={formData.jobPosition}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        {jobs.length === 0
                          ? "No active jobs available"
                          : "Select job position"}
                      </option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title} - {job.location}
                        </option>
                      ))}
                    </select>
                    {jobs.length === 0 && (
                      <p className="mt-1 text-sm text-red-500">
                        No active jobs found. Create active job postings first
                        to schedule interviews.
                      </p>
                    )}
                  </div>

                  {/* Interviewers */}
                  <div className="mb-6">
                    <label
                      htmlFor="interviewers"
                      className="block text-sm font-medium text-gray-700 mb-2 after:content-['*'] after:text-pink-500 after:ml-1"
                    >
                      Interviewers
                    </label>
                    <select
                      id="interviewers"
                      name="interviewers"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      multiple
                      value={formData.interviewers}
                      onChange={handleMultiSelect}
                      required
                      size="5"
                    >
                      {interviewers.length > 0 ? (
                        interviewers.map((interviewer) => (
                          <option key={interviewer.id} value={interviewer.id}>
                            {interviewer.name} - {interviewer.designation}
                          </option>
                        ))
                      ) : (
                        <option disabled>No interviewers available</option>
                      )}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      {interviewers.length > 0
                        ? "Hold Ctrl (or Cmd) to select multiple interviewers"
                        : "No interviewers found. Add company interviewers first."}
                    </p>
                  </div>

                  <div className="border-t border-gray-200 my-6"></div>

                  {/* Date & Time Selection */}
                  <div className="mb-6">
                    <label
                      htmlFor="interviewDate"
                      className="block text-sm font-medium text-gray-700 mb-2 after:content-['*'] after:text-pink-500 after:ml-1"
                    >
                      Interview Date
                    </label>
                    <input
                      type="text"
                      id="interviewDate"
                      name="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Select date"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2 after:content-['*'] after:text-pink-500 after:ml-1">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {[
                        "9:00 AM",
                        "10:00 AM",
                        "11:00 AM",
                        "12:00 PM",
                        "1:00 PM",
                        "2:00 PM",
                        "3:00 PM",
                        "4:00 PM",
                        "5:00 PM",
                      ].map((time) => (
                        <div
                          key={time}
                          className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                            selectedTimeSlot === time
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => setSelectedTimeSlot(time)}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-gray-700 mb-2 after:content-['*'] after:text-pink-500 after:ml-1"
                    >
                      Duration
                    </label>
                    <select
                      id="duration"
                      name="duration"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1 hour 30 minutes</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  <div className="border-t border-gray-200 my-6"></div>

                  {/* Additional Details */}
                  <div className="mb-6">
                    <label
                      htmlFor="interviewTitle"
                      className="block text-sm font-medium text-gray-700 mb-2 after:content-['*'] after:text-pink-500 after:ml-1"
                    >
                      Interview Title
                    </label>
                    <input
                      type="text"
                      id="interviewTitle"
                      name="title"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g. Technical Interview - Frontend Developer"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="interviewDescription"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Description / Agenda
                    </label>
                    <textarea
                      id="interviewDescription"
                      name="description"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Enter interview details, topics to cover, or special instructions..."
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Location / Meeting Link
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder={
                        interviewType === "video"
                          ? "Will be generated automatically for video interviews"
                          : "Enter meeting location"
                      }
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      {interviewType === "inperson"
                        ? "Please specify the office location"
                        : "Meeting link will be generated automatically"}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center">
                      <input
                        id="sendReminder"
                        name="sendReminder"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={formData.sendReminder}
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="sendReminder"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Send email reminders to all participants
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-6 py-3 border border-blue-500 text-blue-500 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors shadow-sm ${
                        isSubmitting
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isSubmitting ? "Scheduling..." : "Schedule Interview"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Interview Data */}
          <div className="lg:w-5/12">
            {loading ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Live Interview Card */}
                {dashboardData.live_interview ? (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="bg-white p-6 border-b border-gray-200">
                      <h3 className="flex items-center text-lg font-semibold text-gray-800">
                        <svg
                          className="w-5 h-5 text-blue-500 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 011.34.447l1.303 2.606a1 1 0 01-.203 1.133l-.96.96a1 1 0 00-.281.648v2.509a1 1 0 01-.42.813l-1.41.94a.5.5 0 01-.659-.122L10 10.101a.5.5 0 00-.659-.122l-1.41.94a1 1 0 01-.813.42H5.5a.5.5 0 01-.5-.5v-1.893a1 1 0 00-.281-.648l-.96-.96a1 1 0 01-.203-1.133L4.663 5.249a1 1 0 011.34-.447l1.599.8L9 4.323V3a1 1 0 011-1z" />
                        </svg>
                        Live Interview
                      </h3>
                    </div>

                    <div className="p-6">
                      <div className="inline-flex items-center bg-blue-50 text-blue-500 px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <span className="relative flex h-2 w-2 mr-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Live Now
                      </div>

                      <h4 className="text-lg font-semibold text-gray-800 mb-2">
                        {dashboardData.live_interview.title}
                      </h4>
                      <p className="text-gray-500 mb-6">
                        {dashboardData.live_interview.candidate_name} -{" "}
                        {dashboardData.live_interview.job_title}
                      </p>

                      <div className="space-y-3 mb-6">
                        {dashboardData.live_interview.meeting_link && (
                          <a
                            href={dashboardData.live_interview.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                          >
                            <svg
                              className="w-5 h-5 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
                            </svg>
                            Join Interview Now
                          </a>
                        )}

                        <button className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-yellow-500 text-yellow-500 rounded-lg font-medium hover:bg-yellow-50 transition-colors">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Reschedule
                        </button>

                        <button className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-pink-500 text-pink-500 rounded-lg font-medium hover:bg-pink-50 transition-colors">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Cancel Interview
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // No Live Interview
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="bg-white p-6 border-b border-gray-200">
                      <h3 className="flex items-center text-lg font-semibold text-gray-800">
                        <svg
                          className="w-5 h-5 text-gray-400 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 011.34.447l1.303 2.606a1 1 0 01-.203 1.133l-.96.96a1 1 0 00-.281.648v2.509a1 1 0 01-.42.813l-1.41.94a.5.5 0 01-.659-.122L10 10.101a.5.5 0 00-.659-.122l-1.41.94a1 1 0 01-.813.42H5.5a.5.5 0 01-.5-.5v-1.893a1 1 0 00-.281-.648l-.96-.96a1 1 0 01-.203-1.133L4.663 5.249a1 1 0 011.34-.447l1.599.8L9 4.323V3a1 1 0 011-1z" />
                        </svg>
                        No Live Interviews
                      </h3>
                    </div>
                    <div className="p-6 text-center text-gray-500">
                      <p>No interviews are currently in progress.</p>
                    </div>
                  </div>
                )}

                {/* Today's Interviews */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                  <div className="bg-white p-6 border-b border-gray-200">
                    <h3 className="flex items-center text-lg font-semibold text-gray-800">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Today's Schedule (
                      {dashboardData.statistics.todays_count || 0})
                    </h3>
                  </div>

                  <div className="p-6">
                    {dashboardData.todays_interviews &&
                    dashboardData.todays_interviews.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.todays_interviews.map((interview) => (
                          <div
                            key={interview.id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {interview.interview_time}
                              </p>
                              <p className="text-sm text-gray-600">
                                {interview.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {interview.candidate_name}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                interview.status === "scheduled"
                                  ? "bg-blue-100 text-blue-700"
                                  : interview.status === "in_progress"
                                  ? "bg-green-100 text-green-700"
                                  : interview.status === "completed"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {interview.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center">
                        No interviews scheduled for today.
                      </p>
                    )}
                  </div>
                </div>

                {/* Upcoming Interviews */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                  <div className="bg-white p-6 border-b border-gray-200">
                    <h3 className="flex items-center text-lg font-semibold text-gray-800">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Upcoming (Next 7 Days)
                    </h3>
                  </div>

                  <div className="p-6">
                    {dashboardData.upcoming_interviews &&
                    dashboardData.upcoming_interviews.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.upcoming_interviews.map((interview) => (
                          <div
                            key={interview.id}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {interview.interview_date}
                              </p>
                              <p className="text-sm text-gray-600">
                                {interview.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {interview.candidate_name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-700">
                                {interview.interview_time}
                              </p>
                              <p className="text-xs text-gray-500">
                                {interview.duration} min
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center">
                        No upcoming interviews in the next 7 days.
                      </p>
                    )}
                  </div>
                </div>

                {/* Statistics Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-white p-6 border-b border-gray-200">
                    <h3 className="flex items-center text-lg font-semibold text-gray-800">
                      <svg
                        className="w-5 h-5 text-blue-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                      </svg>
                      Interview Statistics
                    </h3>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {dashboardData.statistics.total_interviews || 0}
                        </p>
                        <p className="text-sm text-gray-600">Total</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {dashboardData.statistics.completed || 0}
                        </p>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">
                          {dashboardData.statistics.scheduled || 0}
                        </p>
                        <p className="text-sm text-gray-600">Scheduled</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">
                          {dashboardData.statistics.cancelled || 0}
                        </p>
                        <p className="text-sm text-gray-600">Cancelled</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
