// src/app/dashboard/employer/boolean-search/page.js

"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import styles from "@koluvu/styles/employer/dashboard/boolean-search.module.css";
import {
  Phone,
  Mail,
  MessageSquare,
  Smartphone,
  ChevronRight,
  Star,
  Award,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
} from "lucide-react";

export default function BooleanJobSearch() {
  // Authentication context
  const { accessToken, isAuthenticated, isEmployer, refreshAccessToken } =
    useAuth();

  // State management
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    query: "",
    location: "",
    department: "",
    designation: "",
    experience: "",
    noticePeriod: "",
    salaryRange: "",
    activelyLooking: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Autocomplete states
  const [activeField, setActiveField] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredDesignations, setFilteredDesignations] = useState([]);

  // Refs for dropdown containers
  const locationRef = useRef(null);
  const departmentRef = useRef(null);
  const designationRef = useRef(null);

  // Predefined options for autocomplete fields
  const locationOptions = [
    "Hyderabad",
    "Vishakapatnam",
    "Bangalore",
    "Mumbai",
    "Chennai",
    "Pune",
    "Delhi",
  ];
  const departmentOptions = [
    "IT",
    "HR",
    "Finance",
    "Marketing",
    "Operations",
    "Sales",
  ];
  const designationOptions = [
    "Software Developer",
    "Senior Developer",
    "HR Manager",
    "Financial Analyst",
    "Marketing Executive",
    "Team Lead",
    "Project Manager",
  ];

  // Responsive design effect
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setActiveField((prev) => (prev === "location" ? null : prev));
      }
      if (
        departmentRef.current &&
        !departmentRef.current.contains(event.target)
      ) {
        setActiveField((prev) => (prev === "department" ? null : prev));
      }
      if (
        designationRef.current &&
        !designationRef.current.contains(event.target)
      ) {
        setActiveField((prev) => (prev === "designation" ? null : prev));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter options based on input
  useEffect(() => {
    if (formData.location) {
      setFilteredLocations(
        locationOptions.filter((option) =>
          option.toLowerCase().includes(formData.location.toLowerCase())
        )
      );
    } else {
      setFilteredLocations(locationOptions);
    }

    if (formData.department) {
      setFilteredDepartments(
        departmentOptions.filter((option) =>
          option.toLowerCase().includes(formData.department.toLowerCase())
        )
      );
    } else {
      setFilteredDepartments(departmentOptions);
    }

    if (formData.designation) {
      setFilteredDesignations(
        designationOptions.filter((option) =>
          option.toLowerCase().includes(formData.designation.toLowerCase())
        )
      );
    } else {
      setFilteredDesignations(designationOptions);
    }
  }, [formData.location, formData.department, formData.designation]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: null }));
    }
  };

  // Handle autocomplete field focus
  const handleFieldFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  // Handle autocomplete selection
  const handleOptionSelect = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
    setActiveField(null);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Check all required fields for detailed search
    const requiredFields = [
      "location",
      "department",
      "designation",
      "experience",
      "noticePeriod",
      "salaryRange",
    ];

    // Only validate required fields if no query is provided
    if (!formData.query) {
      requiredFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`;
          isValid = false;
        }
      });
    }

    // Query validation
    if (formData.query && formData.query.length < 3) {
      newErrors.query = "Search query must be at least 3 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setShowResults(true);
    setResults([]);
    setErrors({});

    try {
      // Check authentication
      if (!isAuthenticated || !isEmployer || !accessToken) {
        setErrors({
          general: "Authentication required. Please log in as an employer.",
        });
        return;
      }

      // Prepare search data for backend API
      const searchPayload = {
        query: formData.query || "",
        location: formData.location,
        department: formData.department,
        designation: formData.designation,
        experience: formData.experience,
        notice_period: formData.noticePeriod,
        salary_range: formData.salaryRange,
        actively_looking: formData.activelyLooking,
      };

      console.log("Submitting boolean search:", searchPayload);

      let currentToken = accessToken;

      const makeRequest = async (token) => {
        return await fetch("/api/employer/boolean-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(searchPayload),
        });
      };

      let response = await makeRequest(currentToken);

      // If token is invalid, try to refresh it
      if (response.status === 403) {
        try {
          console.log("Token expired, attempting refresh...");
          currentToken = await refreshAccessToken();
          response = await makeRequest(currentToken);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          setErrors({
            general: "Session expired. Please log in again.",
          });
          return;
        }
      }

      const data = await response.json();
      console.log("Boolean search response:", data);

      if (!response.ok) {
        if (response.status === 403) {
          setErrors({
            general: "Authentication failed. Please log in again.",
          });
        } else {
          setErrors({
            general:
              data.error || "Failed to search candidates. Please try again.",
          });
        }

        // If there are validation errors from backend
        if (data.details && typeof data.details === "object") {
          setErrors((prev) => ({ ...prev, ...data.details }));
        }

        setResults([]);
      } else {
        // Transform backend data to match frontend structure
        const transformedCandidates = (data.candidates || []).map(
          (candidate) => ({
            id: candidate.id,
            name:
              candidate.employee?.user?.first_name &&
              candidate.employee?.user?.last_name
                ? `${candidate.employee.user.first_name} ${candidate.employee.user.last_name}`
                : candidate.employee?.user?.username || "Anonymous",
            designation:
              candidate.employee?.current_designation ||
              candidate.employee?.current_position ||
              "Not specified",
            department: candidate.department || "Not specified",
            industry: candidate.industry || "Not specified",
            keySkills: candidate.key_skills || "Not specified",
            experience: `${candidate.employee?.experience_years || 0} years`,
            location: candidate.employee?.location || "Not specified",
            presentCTC: candidate.current_ctc
              ? `${candidate.current_ctc} LPA`
              : "Not disclosed",
            expectedCTC: candidate.expected_ctc
              ? `${candidate.expected_ctc} LPA`
              : "Not specified",
            noticePeriod: candidate.notice_period || "Not specified",
            preferredLocation:
              candidate.preferred_location ||
              candidate.employee?.location ||
              "Not specified",
            activelyLooking: candidate.actively_looking || false,
            profilePicture:
              candidate.employee?.profile_picture ||
              "https://randomuser.me/api/portraits/lego/1.jpg",
            contact: {
              call:
                candidate.employee?.user?.phone ||
                candidate.employee?.phone ||
                "Not available",
              email: candidate.employee?.user?.email || "Not available",
              whatsapp:
                candidate.employee?.user?.phone ||
                candidate.employee?.phone ||
                "Not available",
              sms:
                candidate.employee?.user?.phone ||
                candidate.employee?.phone ||
                "Not available",
            },
            education: candidate.employee?.education?.[0]?.degree
              ? `${candidate.employee.education[0].degree} - ${
                  candidate.employee.education[0].institution ||
                  "Institution not specified"
                }`
              : "Education details not available",
            languages: "English, Hindi", // Default languages
            achievements: candidate.achievement_details?.map(
              (ach) => ach.title
            ) || ["Professional achievements not listed"],
            projects:
              candidate.projects?.map((project) => ({
                name: project.title || "Project",
                description:
                  project.description || "Project description not available",
              })) || [],
            availability: candidate.availability || "Contact for availability",
            lastActive: candidate.last_active
              ? `Active ${new Date(candidate.last_active).toLocaleDateString()}`
              : "Recently active",
            matchScore: candidate.match_score || 70,
          })
        );

        setResults(transformedCandidates);
        console.log("Transformed candidates:", transformedCandidates.length);
      }
    } catch (error) {
      console.error("Boolean search error:", error);
      setErrors({
        general:
          "Network error occurred. Please check your connection and try again.",
      });
      setResults([]);
    } finally {
      setIsLoading(false);

      // Scroll to results on mobile
      if (isMobile) {
        setTimeout(() => {
          document
            .getElementById("results-section")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  };

  // Reset form
  const handleEdit = () => {
    setFormData({
      query: "",
      location: "",
      department: "",
      designation: "",
      experience: "",
      noticePeriod: "",
      salaryRange: "",
      activelyLooking: false,
    });
    setShowResults(false);
    setShowAdvanced(true);
    setErrors({});
  };

  // View candidate details
  const viewCandidateDetails = (candidate) => {
    setSelectedCandidate(candidate);
  };

  return (
    <>
      <Head>
        <title>Boolean Job Search | Talent Acquisition</title>
        <meta
          name="description"
          content="Advanced boolean search for job candidates"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>

      <div
        className={`min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 ${styles.container}`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Boolean Job Search
            </h1>
            <p className="text-lg text-gray-600">
              Find the perfect candidates using advanced search
            </p>
          </div>

          {/* Error message display */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {errors.general}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Left Column - Normal Boolean Search */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-blue-600 px-6 py-4 border-b border-blue-700">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h2 className="text-xl font-bold text-white">
                      Boolean Query Search
                    </h2>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">
                    Use AND, OR, NOT operators for precise results
                  </p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Search Query
                      </label>
                      <input
                        type="text"
                        name="query"
                        value={formData.query}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 ${
                          errors.query ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                        placeholder="e.g., Developer AND React NOT Junior"
                      />
                      {errors.query && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.query}
                        </p>
                      )}
                    </div>

                    {/* Boolean Query Examples */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        💡 Query Examples:
                      </h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <code className="bg-white px-2 py-0.5 rounded">Developer AND React</code></li>
                        <li>• <code className="bg-white px-2 py-0.5 rounded">Manager OR Lead</code></li>
                        <li>• <code className="bg-white px-2 py-0.5 rounded">Python NOT Junior</code></li>
                      </ul>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Search by Query
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Detailed Search Form */}
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-indigo-600 px-6 py-4 border-b border-indigo-700">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-white mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <h2 className="text-xl font-bold text-white">
                      Detailed Filter Search
                    </h2>
                  </div>
                  <p className="text-indigo-100 text-sm mt-1">
                    All fields are mandatory for accurate matching
                  </p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {/* Location - Autocomplete */}
                    <div ref={locationRef} className="relative">
                      <label
                        htmlFor="location"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleInputChange}
                        onFocus={() => handleFieldFocus("location")}
                        className={`w-full px-4 py-3 rounded-lg border-2 ${
                          errors.location
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
                        placeholder="Type or select location"
                      />
                      {activeField === "location" &&
                        filteredLocations.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {filteredLocations.map((location, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                                onClick={() =>
                                  handleOptionSelect("location", location)
                                }
                              >
                                {location}
                              </div>
                            ))}
                          </div>
                        )}
                      {errors.location && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.location}
                        </p>
                      )}
                    </div>

                    {/* Department - Autocomplete */}
                    <div ref={departmentRef} className="relative">
                      <label
                        htmlFor="department"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Department <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="department"
                        name="department"
                        type="text"
                        value={formData.department}
                        onChange={handleInputChange}
                        onFocus={() => handleFieldFocus("department")}
                        className={`w-full px-4 py-3 rounded-lg border-2 ${
                          errors.department
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
                        placeholder="Type or select department"
                      />
                      {activeField === "department" &&
                        filteredDepartments.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {filteredDepartments.map((department, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                                onClick={() =>
                                  handleOptionSelect("department", department)
                                }
                              >
                                {department}
                              </div>
                            ))}
                          </div>
                        )}
                      {errors.department && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.department}
                        </p>
                      )}
                    </div>

                    {/* Designation - Autocomplete */}
                    <div ref={designationRef} className="relative">
                      <label
                        htmlFor="designation"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="designation"
                        name="designation"
                        type="text"
                        value={formData.designation}
                        onChange={handleInputChange}
                        onFocus={() => handleFieldFocus("designation")}
                        className={`w-full px-4 py-3 rounded-lg border-2 ${
                          errors.designation
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
                        placeholder="Type or select designation"
                      />
                      {activeField === "designation" &&
                        filteredDesignations.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {filteredDesignations.map(
                              (designation, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                                  onClick={() =>
                                    handleOptionSelect(
                                      "designation",
                                      designation
                                    )
                                  }
                                >
                                  {designation}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      {errors.designation && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.designation}
                        </p>
                      )}
                    </div>

                    {/* Experience */}
                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Experience <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 ${
                          errors.experience
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
                      >
                        <option value="">Select Experience</option>
                        <option>0-1 years</option>
                        <option>1-3 years</option>
                        <option>3-5 years</option>
                        <option>5+ years</option>
                      </select>
                      {errors.experience && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.experience}
                        </p>
                      )}
                    </div>

                    {/* Notice Period */}
                    <div>
                      <label
                        htmlFor="noticePeriod"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Notice Period <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="noticePeriod"
                        name="noticePeriod"
                        value={formData.noticePeriod}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 ${
                          errors.noticePeriod
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
                      >
                        <option value="">Select Notice Period</option>
                        <option>Immediate</option>
                        <option>15 Days</option>
                        <option>1 Month</option>
                        <option>2 Months</option>
                        <option>3 Months</option>
                      </select>
                      {errors.noticePeriod && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.noticePeriod}
                        </p>
                      )}
                    </div>

                    {/* Salary Range */}
                    <div>
                      <label
                        htmlFor="salaryRange"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Salary Range <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="salaryRange"
                        name="salaryRange"
                        value={formData.salaryRange}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border-2 ${
                          errors.salaryRange
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all`}
                      >
                        <option value="">Select Salary Range</option>
                        <option>0-3 LPA</option>
                        <option>3-6 LPA</option>
                        <option>6-10 LPA</option>
                        <option>10-15 LPA</option>
                        <option>15+ LPA</option>
                      </select>
                      {errors.salaryRange && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.salaryRange}
                        </p>
                      )}
                    </div>

                    {/* Actively Looking Checkbox */}
                    <div className="flex items-center pt-2">
                      <input
                        id="activelyLooking"
                        name="activelyLooking"
                        type="checkbox"
                        checked={formData.activelyLooking}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="activelyLooking"
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        Only actively looking candidates
                      </label>
                    </div>

                    {/* Submit Button for Detailed Search */}
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center shadow-md hover:shadow-lg mt-4"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      Search with Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Results Section */}
          {showResults && (
            <div id="results-section" className="mt-8">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching for candidates...
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>
                        {results.length}{" "}
                        {results.length === 1
                          ? "Candidate Found"
                          : "Candidates Found"}
                      </span>
                      <button
                        onClick={handleEdit}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
                      >
                        Modify Search{" "}
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  )}
                </h3>

                {/* Display results here - you can add the candidate cards */}
                {!isLoading && results.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="mt-4 text-gray-600">No candidates found matching your criteria.</p>
                    <p className="text-sm text-gray-500 mt-2">Try adjusting your search parameters.</p>
                  </div>
                )}

                {/* Candidate Results Grid */}
                {!isLoading && results.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {results.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => viewCandidateDetails(candidate)}
                      >
                        <div className="flex items-center mb-3">
                          <img
                            src={candidate.profilePicture}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-full mr-3"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">{candidate.name}</h4>
                            <p className="text-sm text-gray-600">{candidate.designation}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-700">
                            <MapPin size={14} className="mr-2" />
                            {candidate.location}
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Briefcase size={14} className="mr-2" />
                            {candidate.experience}
                          </div>
                          <div className="flex items-center text-gray-700">
                            <DollarSign size={14} className="mr-2" />
                            {candidate.expectedCTC}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
