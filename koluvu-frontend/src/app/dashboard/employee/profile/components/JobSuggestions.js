// src/app/dashboard/employee/profile/components/JobSuggestions.js

import React from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, ExternalLink } from "lucide-react";

const JobSuggestions = ({
  jobSuggestions,
  isEditing,
  isDarkMode,
  showCustomMessage,
}) => {
  const router = useRouter();

  // Always show first 3 jobs
  const jobsToDisplay = jobSuggestions.slice(0, 3);

  const handleViewAllJobs = () => {
    router.push("/jobs");
  };

  return (
    <div className="lg:w-1/4 min-w-64">
      <div
        className={`p-6 rounded-xl sticky top-8 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-xl border ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h3
          className={`text-xl font-bold mb-5 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Job Suggestions
        </h3>
        <div className="space-y-4">
          {jobsToDisplay.map((job) => (
            <div
              key={job.id}
              className={`p-4 rounded-lg overflow-hidden ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              } shadow-sm border ${
                isDarkMode ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <h4
                className={`font-bold text-lg overflow-wrap-anywhere ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {job.title}
              </h4>
              <p
                className={`text-sm overflow-wrap-anywhere ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mt-1`}
              >
                {job.description}
              </p>
              <button
                className={`mt-3 px-4 py-2 rounded-md text-sm font-medium ${
                  isDarkMode
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } transition-colors`}
              >
                Apply Now
              </button>
            </div>
          ))}

          {/* View All Jobs Button */}
          <button
            onClick={handleViewAllJobs}
            className={`mt-4 w-full flex items-center justify-center space-x-2 px-5 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } shadow-sm`}
          >
            <ExternalLink className="w-5 h-5" />
            <span>View All Jobs</span>
          </button>

          {isEditing && (
            <button
              onClick={() =>
                showCustomMessage(
                  "Adding new job suggestions is not yet implemented."
                )
              }
              className={`mt-4 flex items-center space-x-2 px-5 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } shadow-sm`}
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add New Suggestion</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSuggestions;
