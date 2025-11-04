// src/app/main/ats-optimizer/page.js

'use client';

import { useState } from "react";
import { Users, TrendingUp, Search, Eye, Filter, BarChart3, Target, Award, Clock, CheckCircle, AlertCircle, XCircle, Star, Zap, Shield, Briefcase, MapPin, Calendar, Phone, Mail, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ATSAnalysis = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Constants moved inside component
  const avgScore = 76;
  const highMatch = 12;
  const mediumMatch = 8;
  const lowMatch = 10;
  const totalCandidates = highMatch + mediumMatch + lowMatch;

  const topKeywords = [
    "JavaScript", "React", "Node.js", "MongoDB", "REST API", "Git", "Docker", 
    "AWS", "Agile", "TypeScript", "Express", "Tailwind CSS", "HTML", "CSS", 
    "Redux", "Linux"
  ];

  const missingKeywords = [
    "GraphQL", "CI/CD", "Redis", "Kubernetes", "Next.js", "Unit Testing", 
    "JIRA", "SASS", "Webpack", "Jest", "Mocha", "Cypress", "PWA", 
    "Storybook", "ESLint"
  ];

  const verifiedCandidates = [
    { 
      id: 1,
      name: "Rahul Sharma", 
      position: "Senior Frontend Developer", 
      dept: "Engineering", 
      score: 82, 
      status: "Active", 
      verified: true, 
      notice: "30 Days",
      avatar: "/images/avatar1.jpg",
      experience: "3 years",
      location: "Mumbai, India",
      skills: ["React", "TypeScript", "Tailwind CSS"],
      availability: "Immediate",
      salary: "$85K - $95K",
      rating: 4.8
    },
    { 
      id: 2,
      name: "Sneha Reddy", 
      position: "Backend Developer", 
      dept: "Engineering", 
      score: 88, 
      status: "On Hold", 
      verified: true, 
      notice: "15 Days",
      avatar: "/images/avatar2.jpg",
      experience: "4 years",
      location: "Bangalore, India",
      skills: ["Node.js", "MongoDB", "AWS"],
      availability: "2 weeks",
      salary: "$90K - $105K",
      rating: 4.9
    },
  ];

  const unverifiedCandidates = [
    { 
      id: 3,
      name: "Ajay Mehta", 
      position: "Full Stack Developer", 
      dept: "Engineering", 
      score: 70, 
      status: "Review", 
      verified: false, 
      notice: "Immediate",
      avatar: "/images/avatar3.jpg",
      experience: "2 years",
      location: "Delhi, India",
      skills: ["React", "Node.js", "PostgreSQL"],
      availability: "Immediate",
      salary: "$75K - $85K",
      rating: 4.5
    },
    { 
      id: 4,
      name: "Nisha Verma", 
      position: "DevOps Engineer", 
      dept: "Cloud", 
      score: 60, 
      status: "Applied", 
      verified: false, 
      notice: "60 Days",
      avatar: "/images/avatar4.jpg",
      experience: "5 years",
      location: "Pune, India",
      skills: ["Docker", "Kubernetes", "AWS"],
      availability: "1 month",
      salary: "$95K - $110K",
      rating: 4.7
    },
  ];

  // Filter candidates based on search query
  const filteredVerifiedCandidates = verifiedCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUnverifiedCandidates = unverifiedCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-green-500 text-white";
    if (score >= 60) return "bg-gradient-to-r from-amber-500 to-orange-500 text-white";
    return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4" />;
      case "On Hold":
        return <Clock className="w-4 h-4" />;
      case "Review":
        return <AlertCircle className="w-4 h-4" />;
      case "Applied":
        return <Target className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "On Hold":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200";
      case "Review":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "Applied":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200";
    }
  };

  const PremiumCard = ({ children, className = "", gradient = "from-violet-500/10 to-purple-500/10" }) => (
    <div className={`relative group overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-3xl"></div>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group-hover:border-white/50">
        {children}
      </div>
    </div>
  );

  const CandidateTable = ({ title, color, data, icon, badgeColor }) => (
    <PremiumCard className="overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className={`w-4 h-4 ${color} rounded-full mr-4`}></div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {icon && <div className="ml-3 text-gray-400">{icon}</div>}
          <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold ${badgeColor} text-white`}>
            {data.length} candidates
          </span>
        </div>
        <Link 
          href="/main/applications" 
          className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <Eye className="w-4 h-4 mr-2" />
          View All
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="text-left py-6 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide">Candidate</th>
              <th className="text-left py-6 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide">Position</th>
              <th className="text-left py-6 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide">Score</th>
              <th className="text-left py-6 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide">Status</th>
              <th className="text-left py-6 px-6 text-sm font-bold text-gray-700 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((candidate) => (
              <tr
                key={candidate.id}
                className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 transform hover:scale-[1.01]"
              >
                <td className="py-6 px-6">
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-lg font-bold text-white">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-gray-900 text-lg">{candidate.name}</div>
                        {candidate.verified && (
                          <Shield className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{candidate.dept}</div>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {candidate.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-6">
                  <div>
                    <div className="font-semibold text-gray-900">{candidate.position}</div>
                    <div className="text-sm text-gray-500">{candidate.experience} experience</div>
                    <div className="text-xs text-gray-400 mt-1">{candidate.salary}</div>
                  </div>
                </td>
                <td className="py-6 px-6">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold ${getScoreColor(candidate.score)} shadow-lg`}>
                      {candidate.score}%
                    </span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs font-semibold ml-1">{candidate.rating}</span>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-6">
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getStatusColor(candidate.status)}`}>
                    {getStatusIcon(candidate.status)}
                    <span className="ml-2">{candidate.status}</span>
                  </span>
                </td>
                <td className="py-6 px-6">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedEmployee(candidate)}
                      className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200" 
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl transition-all duration-200" title="Download Resume">
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200" title="Send Email">
                      <Mail className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-all duration-200" title="Call">
                      <Phone className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PremiumCard>
  );

  const StatCard = ({ title, value, icon: Icon, bgColor, textColor, gradient, subtitle, trend, trendValue, cardGradient }) => (
    <PremiumCard gradient={cardGradient}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">{title}</p>
          <p className="text-5xl font-black text-gray-900 mt-4 drop-shadow-sm">{value}</p>
          {subtitle && <p className="text-base font-medium text-gray-600 mt-3">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-4 bg-white/50 backdrop-blur-sm rounded-full px-3 py-2 w-fit">
              <TrendingUp className={`w-5 h-5 mr-2 ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`} />
              <span className={`text-sm font-bold ${trend === 'up' ? 'text-emerald-700' : 'text-red-700'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`relative p-6 rounded-3xl ${bgColor} ${textColor} shadow-2xl transform hover:scale-110 transition-transform duration-300 group`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl"></div>
          <Icon className="h-12 w-12 relative z-10 group-hover:animate-pulse" />
        </div>
      </div>
    </PremiumCard>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-400/20 via-purple-500/20 to-indigo-600/20 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/20 via-blue-500/20 to-indigo-600/20 rounded-full translate-y-48 -translate-x-48 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-pink-400/15 via-rose-500/15 to-orange-600/15 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse delay-2000"></div>
      
      <div className="relative z-10 p-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Ultra Premium Header */}
          <div className="text-center mb-16">
            <div className="inline-block relative group mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
              <div className="relative bg-white/70 backdrop-blur-md rounded-3xl px-16 py-12 border border-white/40 shadow-2xl">
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="p-4 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-12 w-12 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                      ATS Analysis Dashboard
                    </h1>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-700">
                      AI-powered candidate selection optimization 🎨✨
                    </p>
                  </div>
                </div>
                <div className="flex justify-center space-x-6">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-full text-lg font-bold flex items-center gap-3 shadow-xl">
                    <Zap className="w-5 h-5 animate-pulse" />
                    Smart Filtering
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full text-lg font-bold flex items-center gap-3 shadow-xl">
                    <Shield className="w-5 h-5 animate-pulse" />
                    Verified Profiles
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-full text-lg font-bold flex items-center gap-3 shadow-xl">
                    <Target className="w-5 h-5 animate-pulse" />
                    Perfect Matches
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-md rounded-2xl p-2 border border-white/40 shadow-2xl">
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-purple-500" />
                    <input
                      type="text"
                      placeholder="Search candidates... 🔍"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-16 pr-8 py-5 border-0 rounded-xl focus:ring-4 focus:ring-purple-500/30 w-full bg-transparent text-lg font-medium placeholder-gray-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full lg:w-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 w-full shadow-lg bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Ultra Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard 
            title="Avg. Match Score" 
            value={`${avgScore}%`} 
            icon={TrendingUp} 
            bgColor="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" 
            textColor="text-white" 
            subtitle="Above industry average 📈"
            trend="up"
            trendValue="+12% this month"
            cardGradient="from-violet-500/20 to-purple-500/20"
          />
          <StatCard 
            title="High Matches" 
            value={highMatch} 
            icon={Users} 
            bgColor="bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700" 
            textColor="text-white" 
            subtitle="Top-tier candidates 🏆"
            trend="up"
            trendValue="+3 this week"
            cardGradient="from-emerald-500/20 to-teal-500/20"
          />
          <StatCard 
            title="Medium Matches" 
            value={mediumMatch} 
            icon={Users} 
            bgColor="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600" 
            textColor="text-white" 
            subtitle="Good potential 🚀"
            trend="down"
            trendValue="-1 this week"
            cardGradient="from-orange-500/20 to-amber-500/20"
          />
          <StatCard 
            title="Low Matches" 
            value={lowMatch} 
            icon={Users} 
            bgColor="bg-gradient-to-br from-rose-600 via-pink-600 to-red-600" 
            textColor="text-white" 
            subtitle="Needs review 🔍"
            trend="down"
            trendValue="-2 this week"
            cardGradient="from-rose-500/20 to-pink-500/20"
          />
        </div>

        {/* Enhanced Keyword Analysis */}
        {selectedEmployee && (
          <PremiumCard className="animate-fadeIn">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center mr-6 shadow-xl">
                  <span className="text-2xl font-bold text-white">
                    {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Keyword Analysis for {selectedEmployee.name}
                  </h2>
                  <div className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {selectedEmployee.position}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedEmployee.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {selectedEmployee.experience} experience
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-200"
              >
                <XCircle className="w-8 h-8" />
              </button>
            </div>
            <div className="grid lg:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-4"></div>
                  Top Matching Keywords
                </h3>
                <div className="flex flex-wrap gap-4">
                  {topKeywords.map((kw, index) => (
                    <span key={index} className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-6 py-3 rounded-2xl text-sm font-semibold border-2 border-green-200 hover:from-green-200 hover:to-emerald-200 transition-all duration-300 shadow-md hover:shadow-lg">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-700 mb-6 flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-4"></div>
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-4">
                  {missingKeywords.map((kw, index) => (
                    <span key={index} className="bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-6 py-3 rounded-2xl text-sm font-semibold border-2 border-red-200 hover:from-red-200 hover:to-pink-200 transition-all duration-300 shadow-md hover:shadow-lg">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </PremiumCard>
        )}

        {/* Premium Candidate Tables */}
        <div className="grid lg:grid-cols-2 gap-10">
          <CandidateTable 
            title="Verified Candidates" 
            color="bg-gradient-to-r from-emerald-500 to-green-500" 
            data={filteredVerifiedCandidates}
            icon={<CheckCircle className="w-6 h-6" />}
            badgeColor="bg-gradient-to-r from-emerald-500 to-green-500"
          />
          <CandidateTable 
            title="Unverified Candidates" 
            color="bg-gradient-to-r from-amber-500 to-orange-500" 
            data={filteredUnverifiedCandidates}
            icon={<AlertCircle className="w-6 h-6" />}
            badgeColor="bg-gradient-to-r from-amber-500 to-orange-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ATSAnalysis;
