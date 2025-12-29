// src/app/jobs/page.js

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";
import { AnimatedWrapper } from "@koluvu/styles/employer/menubar/AnimatedWrapper";

const slugify = (str) =>
  String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const JobCard = ({ job }) => {
  const formattedDate = new Date(job.application_deadline).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // Format salary range from min/max values
  const formatSalaryRange = () => {
    if (job.salary_min && job.salary_max) {
      return `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}`;
    } else if (job.salary_min) {
      return `₹${job.salary_min.toLocaleString()}+`;
    }
    return null;
  };

  // Build the job detail URL using public_url from API response or generate from slugs
  const jobUrl = job.public_url ? `/${job.public_url}` : `/jobs/${job.id}`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all"
    >
      <a href={jobUrl} className="block hover:no-underline focus:no-underline">
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
              {job.industry}
            </span>
          </div>

          <div className="flex items-center text-gray-500 mb-3">
            <i className="fas fa-building mr-2 text-sm"></i>
            <span className="text-sm font-medium">{job.company_name}</span>
          </div>

          <div className="flex items-center text-gray-600 mb-4">
            <i className="fas fa-map-marker-alt mr-2 text-sm"></i>
            <span className="text-sm">{job.location}</span>
            <span className="mx-2">•</span>
            <i className="fas fa-clock mr-2 text-sm"></i>
            <span className="text-sm capitalize">
              {job.employment_type.replace("_", " ")}
            </span>
          </div>

          <p className="text-gray-700 mb-4 line-clamp-3 text-sm">
            {job.description}
          </p>

          {formatSalaryRange() && (
            <div className="flex items-center text-gray-600 mb-4">
              <i className="fas fa-money-bill-wave mr-2 text-sm"></i>
              <span className="text-sm">{formatSalaryRange()}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Apply by: {formattedDate}
            </div>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
              View Details
            </span>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const postedSuccess = searchParams.get("posted");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/jobs?public=true");
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const result = await response.json();

        // The API returns paginated data directly from Django REST framework
        if (result.results) {
          setJobs(result.results);
        } else if (Array.isArray(result)) {
          setJobs(result);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header className="bg-white shadow-sm" />
      <main className="flex-1">
        <AnimatedWrapper className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {postedSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded"
            >
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-3"></i>
                <p className="text-green-700">Job posted successfully!</p>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Available Jobs
            </h1>
            <p className="text-gray-600 mt-2">
              Browse through our current job openings
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
              <div className="flex items-center">
                <i className="fas fa-info-circle text-blue-500 mr-3"></i>
                <p className="text-blue-700">
                  No jobs available at the moment. Please check back later.
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {jobs.map((job) => (
                <JobCard key={job._id || job.id} job={job} />
              ))}
            </motion.div>
          )}
        </AnimatedWrapper>
      </main>
      <Footer className="bg-white border-t" />
    </div>
  );
}
