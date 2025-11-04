// src/app/dashboard/employer/components/JobListings.js

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  ChevronDown,
  Clock,
  TrendingUp,
  Star,
  AlertCircle,
} from "lucide-react";

export default function JobListings() {
  const [showAll, setShowAll] = useState(false);

  const allJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      applicants: 24,
      status: "Active",
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "UX Designer",
      department: "Design",
      applicants: 18,
      status: "Active",
      posted: "1 week ago",
    },
    {
      id: 3,
      title: "Backend Developer",
      department: "Engineering",
      applicants: 32,
      status: "Active",
      posted: "3 days ago",
    },
    {
      id: 4,
      title: "Product Manager",
      department: "Management",
      applicants: 8,
      status: "Closing soon",
      posted: "2 weeks ago",
    },
    {
      id: 5,
      title: "Data Scientist",
      department: "Analytics",
      applicants: 15,
      status: "Active",
      posted: "5 days ago",
    },
    {
      id: 6,
      title: "DevOps Engineer",
      department: "Engineering",
      applicants: 12,
      status: "Active",
      posted: "1 day ago",
    },
    {
      id: 7,
      title: "Marketing Specialist",
      department: "Marketing",
      applicants: 21,
      status: "Closing soon",
      posted: "3 weeks ago",
    },
    {
      id: 8,
      title: "HR Coordinator",
      department: "Human Resources",
      applicants: 9,
      status: "Active",
      posted: "4 days ago",
    },
    {
      id: 9,
      title: "Sales Executive",
      department: "Sales",
      applicants: 14,
      status: "Active",
      posted: "6 days ago",
    },
    {
      id: 10,
      title: "Customer Support",
      department: "Operations",
      applicants: 27,
      status: "Active",
      posted: "1 day ago",
    },
    // Additional jobs that will show when "View All" is clicked
    {
      id: 11,
      title: "Content Writer",
      department: "Marketing",
      applicants: 7,
      status: "Active",
      posted: "1 week ago",
    },
    {
      id: 12,
      title: "QA Engineer",
      department: "Engineering",
      applicants: 19,
      status: "Active",
      posted: "4 days ago",
    },
    {
      id: 13,
      title: "System Administrator",
      department: "IT",
      applicants: 11,
      status: "Closing soon",
      posted: "2 weeks ago",
    },
    {
      id: 14,
      title: "Financial Analyst",
      department: "Finance",
      applicants: 13,
      status: "Active",
      posted: "5 days ago",
    },
    {
      id: 15,
      title: "Technical Support",
      department: "Operations",
      applicants: 22,
      status: "Active",
      posted: "3 days ago",
    },
  ];

  const jobsToDisplay = showAll ? allJobs : allJobs.slice(0, 5);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Closing soon":
        return "bg-yellow-100 text-yellow-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {showAll ? "All Job Listings" : "Recent Job Listings"}
        </h2>
        <div className="flex space-x-2">
          <button className="text-sm font-medium text-gray-600 hover:text-gray-800 flex items-center">
            <i className="fas fa-filter mr-1"></i> Filter
          </button>
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
          >
            {showAll ? "Show Less" : "View All"}
            <i
              className={`fas ${
                showAll ? "fa-chevron-up" : "fa-chevron-right"
              } ml-1 text-xs`}
            ></i>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicants
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posted
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobsToDisplay.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {job.title}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.department}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link
                    href="/dashboard/employer/applicants"
                    className="flex items-center hover:text-blue-600 cursor-pointer"
                  >
                    <i className="fas fa-user-friends mr-2 text-blue-500"></i>
                    {job.applicants}
                  </Link>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.posted}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="text-green-600 hover:text-green-900 mr-3">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showAll && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to{" "}
            <span className="font-medium">{allJobs.length}</span> of{" "}
            <span className="font-medium">{allJobs.length}</span> jobs
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
