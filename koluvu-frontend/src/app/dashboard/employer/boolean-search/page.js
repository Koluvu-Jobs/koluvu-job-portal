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

  // Note: Candidate data now comes from the backend API

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

  // Toggle advanced search options
  const toggleAdvanced = (e) => {
    e.preventDefault();
    setShowAdvanced(!showAdvanced);
  };

  // Toggle review modal
  const toggleModal = () => {
    setShowModal(!showModal);
  };

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

    // Check all required fields
    const requiredFields = [
      "location",
      "department",
      "designation",
      "experience",
      "noticePeriod",
      "salaryRange",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
        isValid = false;
      }
    });

    // Query validation when advanced search is shown
    if (showAdvanced && formData.query && formData.query.length < 3) {
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
        className={`min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 ${styles.container}`}
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl ${styles.card}`}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
              <h2 className="text-2xl font-bold text-white text-center">
                Boolean Job Search
              </h2>
              <p className="text-white text-center text-sm mt-2">
                All fields are mandatory to search candidates
              </p>
            </div>

            <div className="p-4 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-4">
                  {/* Error message display */}
                  {errors.general && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                      {errors.general}
                    </div>
                  )}

                  {/* Search input row with OR option */}
                  <div
                    className={`flex ${
                      isMobile ? "flex-col" : "flex-row"
                    } items-center gap-2 max-w-5xl mx-auto`}
                  >
                    <div className="flex-grow min-w-0">
                      <input
                        type="text"
                        name="query"
                        value={formData.query}
                        onChange={handleInputChange}
                        className={`${styles.searchInput} ${
                          isMobile ? "rounded-lg mb-2" : "rounded-l-lg"
                        } w-full min-w-96 px-4 py-3 border ${
                          errors.query ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                        placeholder="Search jobs (e.g., Developer AND React NOT Junior)"
                      />
                      {errors.query && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.query}
                        </p>
                      )}
                    </div>

                    {!isMobile && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 font-medium">OR</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className={`${
                        styles.buttonPrimary
                      } bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 ${
                        isMobile ? "rounded-lg w-full" : "rounded-r-lg"
                      } transition-colors duration-300 flex items-center justify-center`}
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
                      Search
                    </button>
                  </div>

                  {isMobile && (
                    <div className="text-center my-2">
                      <span className="text-gray-500 font-medium">OR</span>
                    </div>
                  )}

                  {/* Advanced search options - Always shown since all fields are mandatory */}
                  <div
                    className={`border-t border-gray-200 pt-4 space-y-6 ${styles.advancedOptions}`}
                  >
                    <div
                      className={`grid ${
                        isMobile ? "grid-cols-1" : "grid-cols-2"
                      } gap-4 sm:gap-6`}
                    >
                      {/* Location - Autocomplete */}
                      <div ref={locationRef} className="relative">
                        <label
                          htmlFor="location"
                          className="block text-sm font-medium text-gray-700 mb-1"
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
                          className={`${
                            styles.searchInput
                          } w-full px-4 py-2 rounded-lg border ${
                            errors.location
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                          placeholder="Type or select location"
                        />
                        {activeField === "location" &&
                          filteredLocations.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                              {filteredLocations.map((location, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
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
                          <p className="mt-1 text-sm text-red-600">
                            {errors.location}
                          </p>
                        )}
                      </div>

                      {/* Department - Autocomplete */}
                      <div ref={departmentRef} className="relative">
                        <label
                          htmlFor="department"
                          className="block text-sm font-medium text-gray-700 mb-1"
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
                          className={`${
                            styles.searchInput
                          } w-full px-4 py-2 rounded-lg border ${
                            errors.department
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                          placeholder="Type or select department"
                        />
                        {activeField === "department" &&
                          filteredDepartments.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                              {filteredDepartments.map((department, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
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
                          <p className="mt-1 text-sm text-red-600">
                            {errors.department}
                          </p>
                        )}
                      </div>

                      {/* Designation - Autocomplete */}
                      <div ref={designationRef} className="relative">
                        <label
                          htmlFor="designation"
                          className="block text-sm font-medium text-gray-700 mb-1"
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
                          className={`${
                            styles.searchInput
                          } w-full px-4 py-2 rounded-lg border ${
                            errors.designation
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                          placeholder="Type or select designation"
                        />
                        {activeField === "designation" &&
                          filteredDesignations.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                              {filteredDesignations.map(
                                (designation, index) => (
                                  <div
                                    key={index}
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
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
                          <p className="mt-1 text-sm text-red-600">
                            {errors.designation}
                          </p>
                        )}
                      </div>

                      {/* Experience - Original select */}
                      <div>
                        <label
                          htmlFor="experience"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Experience <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className={`${
                            styles.selectDropdown
                          } w-full px-4 py-2 rounded-lg border ${
                            errors.experience
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                        >
                          <option value="">Select Experience</option>
                          <option>0-1 years</option>
                          <option>1-3 years</option>
                          <option>3-5 years</option>
                          <option>5+ years</option>
                        </select>
                        {errors.experience && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.experience}
                          </p>
                        )}
                      </div>

                      {/* Notice Period - Original select */}
                      <div>
                        <label
                          htmlFor="noticePeriod"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Notice Period <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="noticePeriod"
                          name="noticePeriod"
                          value={formData.noticePeriod}
                          onChange={handleInputChange}
                          className={`${
                            styles.selectDropdown
                          } w-full px-4 py-2 rounded-lg border ${
                            errors.noticePeriod
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                        >
                          <option value="">Select Notice Period</option>
                          <option>Immediate</option>
                          <option>15 Days</option>
                          <option>1 Month</option>
                          <option>2 Months</option>
                          <option>3 Months</option>
                        </select>
                        {errors.noticePeriod && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.noticePeriod}
                          </p>
                        )}
                      </div>

                      {/* Salary Range - Original select */}
                      <div>
                        <label
                          htmlFor="salaryRange"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Salary Range <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="salaryRange"
                          name="salaryRange"
                          value={formData.salaryRange}
                          onChange={handleInputChange}
                          className={`${
                            styles.selectDropdown
                          } w-full px-4 py-2 rounded-lg border ${
                            errors.salaryRange
                              ? "border-red-500"
                              : "border-gray-300"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                        >
                          <option value="">Select Salary Range</option>
                          <option>0-3 LPA</option>
                          <option>3-6 LPA</option>
                          <option>6-10 LPA</option>
                          <option>10-15 LPA</option>
                          <option>15+ LPA</option>
                        </select>
                        {errors.salaryRange && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.salaryRange}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actively Looking Checkbox */}
                    <div className="flex items-center">
                      <input
                        id="activelyLooking"
                        name="activelyLooking"
                        type="checkbox"
                        checked={formData.activelyLooking}
                        onChange={handleInputChange}
                        className={`${styles.checkbox} h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded`}
                      />
                      <label
                        htmlFor="activelyLooking"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Actively Looking for Job
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div
                      className={`flex ${
                        isMobile
                          ? "flex-col space-y-2"
                          : "flex-row space-x-3 justify-end"
                      }`}
                    >
                      <button
                        type="submit"
                        className={`${styles.buttonPrimary} bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center`}
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Submit
                      </button>

                      <button
                        type="button"
                        onClick={toggleModal}
                        className={`${styles.buttonPrimary} bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center`}
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Review
                      </button>

                      <button
                        type="button"
                        onClick={handleEdit}
                        className={`${styles.buttonPrimary} bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center`}
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Results Section */}
              {showResults && (
                <div id="results-section" className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {isLoading ? (
                      "Searching for candidates..."
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
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          Modify Search{" "}
                          <ChevronRight size={16} className="ml-1" />
                        </button>
                      </div>
                    )}
                  </h3>

                  {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                      <p className="text-gray-600 text-center">
                        Searching candidates based on your criteria...
                        <br />
                        <span className="text-sm text-gray-500">
                          This may take a few moments
                        </span>
                      </p>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="flex gap-6 flex-col lg:flex-row">
                      {/* Left Panel - Main Candidate Cards */}
                      <div className="flex-1 space-y-6">
                        {results.map((candidate) => (
                          <div
                            key={candidate.id}
                            className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                          >
                            <div className="p-6 flex flex-col md:flex-row gap-6">
                              {/* Candidate Photo + Contact Icons */}
                              <div className="flex flex-col items-center">
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                                  <Image
                                    src={candidate.profilePicture}
                                    alt={candidate.name}
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="mt-4 p-3 border rounded-xl bg-white shadow-sm w-full">
                                  <div className="flex justify-center gap-3">
                                    <a
                                      href={`tel:${candidate.contact.call}`}
                                      className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                                      title="Call"
                                    >
                                      <Phone
                                        size={18}
                                        className="text-blue-600"
                                      />
                                    </a>
                                    <a
                                      href={`mailto:${candidate.contact.email}`}
                                      className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
                                      title="Email"
                                    >
                                      <Mail
                                        size={18}
                                        className="text-green-600"
                                      />
                                    </a>
                                    <a
                                      href={`https://wa.me/${candidate.contact.whatsapp}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 bg-teal-100 hover:bg-teal-200 rounded-full transition-colors"
                                      title="WhatsApp"
                                    >
                                      <Smartphone
                                        size={18}
                                        className="text-teal-600"
                                      />
                                    </a>
                                    <a
                                      href={`sms:${candidate.contact.sms}`}
                                      className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-full transition-colors"
                                      title="SMS"
                                    >
                                      <MessageSquare
                                        size={18}
                                        className="text-yellow-600"
                                      />
                                    </a>
                                  </div>
                                </div>
                              </div>

                              {/* Candidate Info */}
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                  <div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                                      {candidate.name}
                                    </h3>
                                    <p className="text-lg text-blue-600 font-medium mb-2">
                                      {candidate.designation}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        <Briefcase size={12} className="mr-1" />{" "}
                                        {candidate.department}
                                      </span>
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <MapPin size={12} className="mr-1" />{" "}
                                        {candidate.location}
                                      </span>
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        <Clock size={12} className="mr-1" />{" "}
                                        {candidate.experience}
                                      </span>
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        <DollarSign
                                          size={12}
                                          className="mr-1"
                                        />{" "}
                                        {candidate.presentCTC}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <span
                                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        candidate.activelyLooking
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {candidate.activelyLooking
                                        ? "Actively Looking"
                                        : "Not Actively Looking"}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                      Match: {candidate.matchScore}%
                                    </span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                      <Star
                                        size={16}
                                        className="mr-1 text-yellow-500"
                                      />{" "}
                                      Key Skills
                                    </h4>
                                    <p className="text-gray-600">
                                      {candidate.keySkills}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                      <Award
                                        size={16}
                                        className="mr-1 text-blue-500"
                                      />{" "}
                                      Career Highlights
                                    </h4>
                                    <ul className="text-gray-600 space-y-1">
                                      <li className="flex items-start">
                                        <span className="inline-block h-1 w-1 rounded-full bg-gray-400 mt-2 mr-2"></span>
                                        <span>
                                          Expected CTC: {candidate.expectedCTC}
                                        </span>
                                      </li>
                                      <li className="flex items-start">
                                        <span className="inline-block h-1 w-1 rounded-full bg-gray-400 mt-2 mr-2"></span>
                                        <span>
                                          Notice Period:{" "}
                                          {candidate.noticePeriod}
                                        </span>
                                      </li>
                                      <li className="flex items-start">
                                        <span className="inline-block h-1 w-1 rounded-full bg-gray-400 mt-2 mr-2"></span>
                                        <span>
                                          Preferred Location:{" "}
                                          {candidate.preferredLocation}
                                        </span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>

                                <div className="mt-4 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
                                  <p className="text-sm text-gray-500">
                                    Last active: {candidate.lastActive}
                                  </p>
                                  <button
                                    onClick={() =>
                                      viewCandidateDetails(candidate)
                                    }
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                                  >
                                    View Profile
                                    <ChevronRight size={16} className="ml-1" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 rounded-xl text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h4 className="mt-4 text-lg font-medium text-gray-700">
                        No candidates found
                      </h4>
                      <p className="mt-2 text-gray-500">
                        No candidates match your current search criteria. Try:
                      </p>
                      <ul className="mt-3 text-sm text-gray-600 list-disc list-inside space-y-1">
                        <li>Broadening your location preferences</li>
                        <li>Adjusting experience requirements</li>
                        <li>Expanding department or designation search</li>
                        <li>Modifying salary range expectations</li>
                      </ul>
                      <button
                        onClick={handleEdit}
                        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Modify Search Criteria
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Current Search Criteria
              </h3>
            </div>
            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
              <ul className="list-disc pl-5 space-y-2">
                {formData.query && <li>Search Query: {formData.query}</li>}
                {formData.location && <li>Location: {formData.location}</li>}
                {formData.department && (
                  <li>Department: {formData.department}</li>
                )}
                {formData.designation && (
                  <li>Designation: {formData.designation}</li>
                )}
                {formData.experience && (
                  <li>Experience: {formData.experience}</li>
                )}
                {formData.noticePeriod && (
                  <li>Notice Period: {formData.noticePeriod}</li>
                )}
                {formData.salaryRange && (
                  <li>Salary Range: {formData.salaryRange}</li>
                )}
                <li>
                  Actively Looking: {formData.activelyLooking ? "Yes" : "No"}
                </li>
              </ul>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-900">
                Candidate Profile
              </h3>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column - Profile */}
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-gray-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg mb-4">
                    <Image
                      src={selectedCandidate.profilePicture}
                      alt={selectedCandidate.name}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h2 className="text-2xl font-bold text-center mb-1">
                    {selectedCandidate.name}
                  </h2>
                  <p className="text-lg text-blue-600 font-medium text-center mb-4">
                    {selectedCandidate.designation}
                  </p>

                  <div className="w-full bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Match Score
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {selectedCandidate.matchScore}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full"
                        style={{ width: `${selectedCandidate.matchScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="w-full space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Contact
                      </h4>
                      <div className="flex justify-center gap-3">
                        <a
                          href={`tel:${selectedCandidate.contact.call}`}
                          className="p-3 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                          title="Call"
                        >
                          <Phone size={20} className="text-blue-600" />
                        </a>
                        <a
                          href={`mailto:${selectedCandidate.contact.email}`}
                          className="p-3 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
                          title="Email"
                        >
                          <Mail size={20} className="text-green-600" />
                        </a>
                        <a
                          href={`https://wa.me/${selectedCandidate.contact.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-teal-100 hover:bg-teal-200 rounded-full transition-colors"
                          title="WhatsApp"
                        >
                          <Smartphone size={20} className="text-teal-600" />
                        </a>
                        <a
                          href={`sms:${selectedCandidate.contact.sms}`}
                          className="p-3 bg-yellow-100 hover:bg-yellow-200 rounded-full transition-colors"
                          title="SMS"
                        >
                          <MessageSquare
                            size={20}
                            className="text-yellow-600"
                          />
                        </a>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Availability
                      </h4>
                      <p className="text-gray-600">
                        {selectedCandidate.availability}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Last Active
                      </h4>
                      <p className="text-gray-600">
                        {selectedCandidate.lastActive}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="md:w-2/3">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
                        Professional Details
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex">
                          <span className="w-32 text-gray-600">
                            Department:
                          </span>
                          <span className="font-medium">
                            {selectedCandidate.department}
                          </span>
                        </li>
                        <li className="flex">
                          <span className="w-32 text-gray-600">Industry:</span>
                          <span className="font-medium">
                            {selectedCandidate.industry}
                          </span>
                        </li>
                        <li className="flex">
                          <span className="w-32 text-gray-600">
                            Experience:
                          </span>
                          <span className="font-medium">
                            {selectedCandidate.experience}
                          </span>
                        </li>
                        <li className="flex">
                          <span className="w-32 text-gray-600">
                            Key Skills:
                          </span>
                          <span className="font-medium">
                            {selectedCandidate.keySkills}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
                        Compensation
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex">
                          <span className="w-32 text-gray-600">
                            Current CTC:
                          </span>
                          <span className="font-medium">
                            {selectedCandidate.presentCTC}
                          </span>
                        </li>
                        <li className="flex">
                          <span className="w-32 text-gray-600">
                            Expected CTC:
                          </span>
                          <span className="font-medium">
                            {selectedCandidate.expectedCTC}
                          </span>
                        </li>
                        <li className="flex">
                          <span className="w-32 text-gray-600">
                            Notice Period:
                          </span>
                          <span className="font-medium">
                            {selectedCandidate.noticePeriod}
                          </span>
                        </li>
                        <li className="flex">
                          <span className="w-32 text-gray-600">
                            Job Status:
                          </span>
                          <span
                            className={`font-medium ${
                              selectedCandidate.activelyLooking
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {selectedCandidate.activelyLooking
                              ? "Actively Looking"
                              : "Not Actively Looking"}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
                        Location Details
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex">
                          <span className="w-32 text-gray-600">Current:</span>
                          <span className="font-medium">
                            {selectedCandidate.location}
                          </span>
                        </li>
                        <li className="flex">
                          <span className="w-32 text-gray-600">Preferred:</span>
                          <span className="font-medium">
                            {selectedCandidate.preferredLocation}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
                        Education
                      </h4>
                      <p className="text-gray-800">
                        {selectedCandidate.education}
                      </p>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
                      Achievements
                    </h4>
                    <ul className="space-y-2">
                      {selectedCandidate.achievements.map(
                        (achievement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mt-2 mr-2"></span>
                            <span>{achievement}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Projects */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
                      Key Projects
                    </h4>
                    <div className="space-y-4">
                      {selectedCandidate.projects.map((project, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-blue-600 mb-1">
                            {project.name}
                          </h5>
                          <p className="text-gray-700">{project.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2 text-blue-700">
                      Recruiter Notes
                    </h4>
                    <p className="text-gray-700">
                      This candidate has been pre-screened and meets all the
                      basic requirements for the position. They have relevant
                      experience in the industry and have received positive
                      feedback from references. Available for interviews as per
                      their schedule.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                Download Resume
              </button>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
                Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
