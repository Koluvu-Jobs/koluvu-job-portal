// src/app/applications/page.js

"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Star,
  Shield,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  ExternalLink,
  FileText,
  MessageSquare,
  Video,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

const ApplicationsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const applications = [
    {
      id: 1,
      name: "Rahul Sharma",
      position: "Senior Frontend Developer",
      email: "rahul.sharma@email.com",
      phone: "+91 98765 43210",
      appliedDate: "2024-01-15",
      status: "Shortlisted",
      score: 85,
      experience: "3 years",
      location: "Mumbai, India",
      avatar: "/images/avatar1.jpg",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      availability: "Immediate",
      salary: "$85K - $95K",
      rating: 4.8,
      verified: true,
      notice: "30 Days",
      lastContact: "2 days ago",
      interviews: 2,
      resume: "Rahul_Sharma_Resume.pdf",
    },
    {
      id: 2,
      name: "Sneha Reddy",
      position: "Backend Developer",
      email: "sneha.reddy@email.com",
      phone: "+91 98765 43211",
      appliedDate: "2024-01-14",
      status: "Under Review",
      score: 78,
      experience: "2 years",
      location: "Bangalore, India",
      avatar: "/images/avatar2.jpg",
      skills: ["Node.js", "MongoDB", "AWS"],
      availability: "2 weeks",
      salary: "$90K - $105K",
      rating: 4.9,
      verified: true,
      notice: "15 Days",
      lastContact: "1 week ago",
      interviews: 1,
      resume: "Sneha_Reddy_Resume.pdf",
    },
    {
      id: 3,
      name: "Ajay Mehta",
      position: "Full Stack Developer",
      email: "ajay.mehta@email.com",
      phone: "+91 98765 43212",
      appliedDate: "2024-01-13",
      status: "Rejected",
      score: 65,
      experience: "4 years",
      location: "Delhi, India",
      avatar: "/images/avatar3.jpg",
      skills: ["React", "Node.js", "PostgreSQL"],
      availability: "Immediate",
      salary: "$75K - $85K",
      rating: 4.5,
      verified: false,
      notice: "Immediate",
      lastContact: "3 days ago",
      interviews: 0,
      resume: "Ajay_Mehta_Resume.pdf",
    },
    {
      id: 4,
      name: "Nisha Verma",
      position: "DevOps Engineer",
      email: "nisha.verma@email.com",
      phone: "+91 98765 43213",
      appliedDate: "2024-01-12",
      status: "Shortlisted",
      score: 92,
      experience: "5 years",
      location: "Pune, India",
      avatar: "/images/avatar4.jpg",
      skills: ["Docker", "Kubernetes", "AWS"],
      availability: "1 month",
      salary: "$95K - $110K",
      rating: 4.7,
      verified: true,
      notice: "60 Days",
      lastContact: "Today",
      interviews: 3,
      resume: "Nisha_Verma_Resume.pdf",
    },
  ];

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      app.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "Under Review":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200";
      case "Rejected":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200";
      case "Applied":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Shortlisted":
        return <CheckCircle className="w-4 h-4" />;
      case "Under Review":
        return <Clock className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      case "Applied":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80)
      return "bg-gradient-to-r from-emerald-500 to-green-500 text-white";
    if (score >= 60)
      return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
    return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
  };

  const PremiumCard = ({ children, className = "" }) => (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] ${className}`}
    >
      {children}
    </div>
  );

  const StatCard = ({
    title,
    value,
    icon: Icon,
    bgColor,
    textColor,
    subtitle,
    trend,
    trendValue,
  }) => (
    <PremiumCard>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-4xl font-bold text-gray-900 mt-3">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-3">
              <TrendingUp
                className={`w-4 h-4 mr-1 ${
                  trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              />
              <span
                className={`text-sm font-semibold ${
                  trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-5 rounded-2xl ${bgColor} ${textColor} shadow-xl`}>
          <Icon className="h-10 w-10" />
        </div>
      </div>
    </PremiumCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 via-indigo-50 to-purple-50 px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 lg:py-8">
      {/* Fluid container (cap very large widths but allow broader than 7xl) */}
      <div className="w-full max-w-[2000px] mx-auto space-y-10">
        {/* Premium Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl 2xl:text-6xl font-bold text-gray-900 mb-2">
                  Applications Management
                </h1>
                <p className="text-xl text-gray-600">
                  Comprehensive candidate application tracking and management
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/main/ats-system"
              className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Back to ATS Optimizer
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <PremiumCard>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications by name, position, email, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 w-full shadow-lg bg-white/80 backdrop-blur-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border-2 border-gray-200 rounded-2xl px-4 py-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-lg"
                >
                  <option value="all">All Status</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="under review">Under Review</option>
                  <option value="rejected">Rejected</option>
                  <option value="applied">Applied</option>
                </select>
              </div>
            </div>
          </div>
        </PremiumCard>

        {/* Summary Stats - responsive auto-fit grid to fill available width */}
        <div className="grid gap-6 2xl:gap-8 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          <StatCard
            title="Total Applications"
            value={applications.length}
            icon={FileText}
            bgColor="bg-gradient-to-br from-blue-500 to-indigo-600"
            textColor="text-white"
            subtitle="All time applications"
            trend="up"
            trendValue="+5 this week"
          />
          <StatCard
            title="Shortlisted"
            value={
              applications.filter((app) => app.status === "Shortlisted").length
            }
            icon={CheckCircle}
            bgColor="bg-gradient-to-br from-emerald-500 to-green-600"
            textColor="text-white"
            subtitle="Top candidates"
            trend="up"
            trendValue="+2 this week"
          />
          <StatCard
            title="Under Review"
            value={
              applications.filter((app) => app.status === "Under Review").length
            }
            icon={Clock}
            bgColor="bg-gradient-to-br from-amber-500 to-orange-600"
            textColor="text-white"
            subtitle="In evaluation"
            trend="down"
            trendValue="-1 this week"
          />
          <StatCard
            title="Rejected"
            value={
              applications.filter((app) => app.status === "Rejected").length
            }
            icon={XCircle}
            bgColor="bg-gradient-to-br from-red-500 to-pink-600"
            textColor="text-white"
            subtitle="Not selected"
            trend="down"
            trendValue="-2 this week"
          />
        </div>

        {/* Applications Table */}
        <PremiumCard className="overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              All Applications
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Showing {filteredApplications.length} of {applications.length}{" "}
                applications
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="text-left py-6 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Candidate
                  </th>
                  <th className="text-left py-6 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Position
                  </th>
                  <th className="text-left py-6 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Applied Date
                  </th>
                  <th className="text-left py-6 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Score
                  </th>
                  <th className="text-left py-6 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left py-6 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 transform hover:scale-[1.01]"
                  >
                    <td className="py-6 px-6">
                      <div className="flex items-center">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center mr-4 shadow-lg">
                          <span className="text-lg font-bold text-white">
                            {app.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-bold text-gray-900 text-lg">
                              {app.name}
                            </div>
                            {app.verified && (
                              <Shield className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {app.email}
                          </div>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {app.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {app.position}
                        </div>
                        <div className="text-sm text-gray-500">
                          {app.experience} experience
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {app.salary}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {app.appliedDate}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Last contact: {app.lastContact}
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold ${getScoreColor(
                            app.score
                          )} shadow-lg`}
                        >
                          {app.score}%
                        </span>
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-xs font-semibold ml-1">
                            {app.rating}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <span
                        className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getStatusColor(
                          app.status
                        )}`}
                      >
                        {getStatusIcon(app.status)}
                        <span className="ml-2">{app.status}</span>
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedApplication(app)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200"
                          title="Download Resume"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200"
                          title="Send Email"
                        >
                          <Mail className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-all duration-200"
                          title="Call"
                        >
                          <Phone className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all duration-200"
                          title="Schedule Interview"
                        >
                          <Video className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PremiumCard>

        {/* Application Details Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <PremiumCard className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center mr-6 shadow-xl">
                    <span className="text-2xl font-bold text-white">
                      {selectedApplication.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedApplication.name}
                    </h2>
                    <div className="flex items-center gap-6 text-gray-600">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {selectedApplication.position}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {selectedApplication.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {selectedApplication.experience} experience
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-200"
                >
                  <XCircle className="w-8 h-8" />
                </button>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-gray-700">
                        {selectedApplication.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-gray-700">
                        {selectedApplication.phone}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="text-gray-700">
                        {selectedApplication.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Application Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          selectedApplication.status
                        )}`}
                      >
                        {selectedApplication.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Score:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(
                          selectedApplication.score
                        )}`}
                      >
                        {selectedApplication.score}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                        <span className="ml-1 font-semibold">
                          {selectedApplication.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interviews:</span>
                      <span className="font-semibold">
                        {selectedApplication.interviews}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Skills & Experience
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedApplication.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </PremiumCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
