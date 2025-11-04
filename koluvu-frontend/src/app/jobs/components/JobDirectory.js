// src/app/jobs/components/JobDirectory.js

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JobCard from "./JobCard";
import JobFilters from "./JobFilters";
import JobSearch from "./JobSearch";
import {
  Briefcase,
  MapPin,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  Building,
  Clock,
} from "lucide-react";

export default function JobDirectory() {
  // State management
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    industry: "",
    department: "",
    location: "",
    experience: "",
    salary: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(12);

  // Backend API URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the Next.js API route which connects to Django backend
      const response = await fetch("/api/jobs?public=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch jobs: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Transform backend data to frontend format
      const transformedJobs = (data.results || data.data || data).map(
        (job) => ({
          id: job.id,
          title: job.title,
          company: job.company_name || job.company || "Company Name",
          location: job.location || "Location TBD",
          industry: job.industry || "Technology",
          salary:
            job.salary_display ||
            `${job.salary_min ? `$${job.salary_min}` : "Salary"}${
              job.salary_max ? ` - $${job.salary_max}` : ""
            }` ||
            "Competitive",
          experience:
            job.experience_display ||
            `${job.experience_min || 0}-${job.experience_max || 5} years`,
          type: job.employment_type || job.job_type || "Full-time",
          department: job.department || "General",
          description: job.description || "",
          skills: job.skills || [],
          postedDate: job.created_at || new Date().toISOString(),
          deadline: job.application_deadline,
          urgency: job.urgency || "normal",
          companyLogo: job.company_logo || "/images/default-company-logo.png",
          contactEmail: job.contact_email,
          interviewMethod: job.interview_method,
          virtualPlatform: job.virtual_platform,
          walkinAddress: job.walkin_address,
          requirements: job.candidate_profile || "",
          perks: job.perks || [],
          education: job.education || "",
          status: job.status || "active",
        })
      );

      setJobs(transformedJobs);
      setFilteredJobs(transformedJobs);
      console.log(
        `Successfully loaded ${transformedJobs.length} jobs from backend`
      );
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError(err.message || "Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = jobs;

    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower) ||
          job.industry.toLowerCase().includes(searchLower) ||
          job.department.toLowerCase().includes(searchLower) ||
          (job.skills &&
            job.skills.some((skill) =>
              skill.toLowerCase().includes(searchLower)
            ))
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((job) => {
          if (key === "experience") {
            // Handle experience filtering logic
            return job.experience.toLowerCase().includes(value.toLowerCase());
          }
          return job[key]?.toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filters, jobs]);

  // Get unique values for filters
  const getUniqueValues = (key) => {
    return [...new Set(jobs.map((job) => job[key]).filter(Boolean))].sort();
  };

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: "",
      industry: "",
      department: "",
      location: "",
      experience: "",
      salary: "",
    });
    setSearchTerm("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Unable to Load Jobs
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchJobs}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <Briefcase className="w-10 h-10 text-blue-500" />
            Job Directory
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing career opportunities from top companies. Find your
            perfect job match with our comprehensive job directory.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span>{jobs.length} Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>{filteredJobs.length} Jobs Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Updated Daily</span>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, location, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
                <motion.div
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  ↓
                </motion.div>
              </button>

              {(searchTerm || Object.values(filters).some((f) => f)) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-white rounded-lg shadow-sm p-6"
              >
                <JobFilters
                  filters={filters}
                  setFilters={setFilters}
                  jobTypes={getUniqueValues("type")}
                  industries={getUniqueValues("industry")}
                  departments={getUniqueValues("department")}
                  locations={getUniqueValues("location")}
                  experienceLevels={getUniqueValues("experience")}
                  onClear={clearFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-gray-600">
            Showing {indexOfFirstJob + 1}-
            {Math.min(indexOfLastJob, filteredJobs.length)} of{" "}
            {filteredJobs.length} jobs
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </motion.div>

        {/* Job Grid */}
        {filteredJobs.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or filters to find more
              opportunities.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentJobs.map((job) => (
              <motion.div key={job.id} variants={itemVariants}>
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="mt-12 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isCurrentPage = pageNumber === currentPage;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-4 py-2 rounded-lg ${
                      isCurrentPage
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
