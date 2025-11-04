"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  TrendingUp,
  Search,
  Eye,
  Filter,
  Download,
  BarChart3,
  UserCheck,
  Clock,
  AlertCircle,
  ChevronDown,
  Star,
  Calendar,
  Building,
  Mail,
  Phone,
  X,
  MapPin,
  Award,
  MessageSquare,
  Video,
  UserX,
  CheckCircle,
  ArrowLeft,
  Briefcase,
  ExternalLink,
  Target,
} from "lucide-react";

const ATSPage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("score");
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock job roles data
  const jobRoles = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Bangalore",
      type: "Full-time",
      posted: "2024-01-10",
      status: "Active",
      requiredSkills: [
        "React",
        "JavaScript",
        "Node.js",
        "MongoDB",
        "Redux",
        "TypeScript",
      ],
    },
    {
      id: 2,
      title: "Backend Developer",
      department: "Engineering",
      location: "Hyderabad",
      type: "Full-time",
      posted: "2024-01-12",
      status: "Active",
      requiredSkills: [
        "Python",
        "Django",
        "PostgreSQL",
        "AWS",
        "Docker",
        "REST API",
      ],
    },
    {
      id: 3,
      title: "Full Stack Developer",
      department: "Technology",
      location: "Mumbai",
      type: "Full-time",
      posted: "2024-01-15",
      status: "Active",
      requiredSkills: [
        "React",
        "Express",
        "MySQL",
        "Node.js",
        "JavaScript",
        "AWS",
      ],
    },
    {
      id: 4,
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Delhi",
      type: "Full-time",
      posted: "2024-01-18",
      status: "Active",
      requiredSkills: [
        "Kubernetes",
        "Docker",
        "Jenkins",
        "AWS",
        "Linux",
        "CI/CD",
      ],
    },
    {
      id: 5,
      title: "UI/UX Designer",
      department: "Design",
      location: "Pune",
      type: "Full-time",
      posted: "2024-01-20",
      status: "Active",
      requiredSkills: [
        "Figma",
        "Adobe XD",
        "Sketch",
        "Prototyping",
        "User Research",
      ],
    },
    {
      id: 6,
      title: "Data Scientist",
      department: "Analytics",
      location: "Chennai",
      type: "Full-time",
      posted: "2024-01-08",
      status: "Active",
      requiredSkills: [
        "Python",
        "TensorFlow",
        "SQL",
        "Tableau",
        "Machine Learning",
      ],
    },
  ];

  const topKeywords = [
    { name: "JavaScript", weight: 95, category: "Programming" },
    { name: "React", weight: 88, category: "Framework" },
    { name: "Node.js", weight: 82, category: "Backend" },
    { name: "MongoDB", weight: 78, category: "Database" },
    { name: "REST API", weight: 85, category: "Architecture" },
    { name: "Git", weight: 92, category: "Version Control" },
    { name: "Docker", weight: 75, category: "DevOps" },
    { name: "AWS", weight: 70, category: "Cloud" },
    { name: "Agile", weight: 65, category: "Methodology" },
    { name: "TypeScript", weight: 80, category: "Programming" },
  ];

  const missingKeywords = [
    { name: "GraphQL", priority: "High", impact: 15 },
    { name: "CI/CD", priority: "High", impact: 18 },
    { name: "Redis", priority: "Medium", impact: 10 },
    { name: "Kubernetes", priority: "High", impact: 20 },
    { name: "Next.js", priority: "Medium", impact: 12 },
    { name: "Unit Testing", priority: "High", impact: 16 },
    { name: "JIRA", priority: "Low", impact: 5 },
    { name: "SASS", priority: "Low", impact: 6 },
    { name: "Webpack", priority: "Medium", impact: 8 },
    { name: "Jest", priority: "Medium", impact: 10 },
  ];

  const candidatesData = [
    {
      id: 1,
      jobId: 1, // Senior Frontend Developer
      name: "Rahul Sharma",
      position: "Senior Frontend Developer",
      dept: "Engineering",
      score: 92,
      skillScore: 88,
      status: "Interview Scheduled",
      verified: true,
      notice: "30 Days",
      email: "rahul.sharma@email.com",
      phone: "+91 98765 43210",
      experience: "5+ years",
      location: "Bangalore",
      appliedDate: "2024-01-15",
      lastActive: "2 hours ago",
      skills: [
        "React",
        "JavaScript",
        "Node.js",
        "MongoDB",
        "HTML",
        "CSS",
        "Redux",
        "Express",
      ],
      keywordsMatched: ["React", "JavaScript", "Node.js", "MongoDB", "Redux"],
      missingSkills: [
        "GraphQL",
        "CI/CD",
        "Redis",
        "Kubernetes",
        "Next.js",
        "Unit Testing",
      ],
      avatar: "RS",
      matchPercentage: 78,
      salary: "₹12-15 LPA",
      education: "B.Tech Computer Science",
    },
    {
      id: 2,
      jobId: 1, // Senior Frontend Developer
      name: "Amit Patel",
      position: "Senior Frontend Developer",
      dept: "Engineering",
      score: 85,
      skillScore: 82,
      status: "Under Review",
      verified: true,
      notice: "45 Days",
      email: "amit.patel@email.com",
      phone: "+91 98765 43211",
      experience: "4+ years",
      location: "Bangalore",
      appliedDate: "2024-01-16",
      lastActive: "5 hours ago",
      skills: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Git"],
      keywordsMatched: ["React", "JavaScript", "TypeScript"],
      missingSkills: ["Node.js", "MongoDB", "Redux", "GraphQL"],
      avatar: "AP",
      matchPercentage: 65,
      salary: "₹10-13 LPA",
      education: "B.Tech Information Technology",
    },
    {
      id: 3,
      jobId: 2, // Backend Developer
      name: "Sneha Reddy",
      position: "Backend Developer",
      dept: "Engineering",
      score: 88,
      skillScore: 85,
      status: "Technical Round",
      verified: true,
      notice: "15 Days",
      email: "sneha.reddy@email.com",
      phone: "+91 87654 32109",
      experience: "4+ years",
      location: "Hyderabad",
      appliedDate: "2024-01-18",
      lastActive: "1 day ago",
      skills: ["Python", "Django", "PostgreSQL", "AWS", "Docker", "REST API"],
      keywordsMatched: [
        "Python",
        "Django",
        "PostgreSQL",
        "AWS",
        "Docker",
        "REST API",
      ],
      missingSkills: ["Kubernetes", "GraphQL", "CI/CD", "Redis"],
      avatar: "SR",
      matchPercentage: 92,
      salary: "₹10-12 LPA",
      education: "M.Tech Software Engineering",
    },
    {
      id: 4,
      jobId: 2, // Backend Developer
      name: "Ravi Kumar",
      position: "Backend Developer",
      dept: "Engineering",
      score: 79,
      skillScore: 75,
      status: "New Application",
      verified: false,
      notice: "30 Days",
      email: "ravi.kumar@email.com",
      phone: "+91 87654 32110",
      experience: "3+ years",
      location: "Hyderabad",
      appliedDate: "2024-01-19",
      lastActive: "4 hours ago",
      skills: ["Python", "Flask", "MySQL", "AWS", "Git"],
      keywordsMatched: ["Python", "AWS"],
      missingSkills: ["Django", "PostgreSQL", "Docker", "REST API"],
      avatar: "RK",
      matchPercentage: 58,
      salary: "₹8-10 LPA",
      education: "B.Tech Computer Science",
    },
    {
      id: 5,
      jobId: 3, // Full Stack Developer
      name: "Ajay Mehta",
      position: "Full Stack Developer",
      dept: "Technology",
      score: 85,
      skillScore: 80,
      status: "Under Review",
      verified: false,
      notice: "Immediate",
      email: "ajay.mehta@email.com",
      phone: "+91 76543 21098",
      experience: "3+ years",
      location: "Mumbai",
      appliedDate: "2024-01-20",
      lastActive: "3 hours ago",
      skills: ["React", "Express", "MySQL", "Docker", "JavaScript", "Node.js"],
      keywordsMatched: ["React", "Express", "MySQL", "Node.js", "JavaScript"],
      missingSkills: ["AWS", "GraphQL", "CI/CD", "Kubernetes", "TypeScript"],
      avatar: "AM",
      matchPercentage: 75,
      salary: "₹8-10 LPA",
      education: "B.E. Information Technology",
    },
    {
      id: 6,
      jobId: 3, // Full Stack Developer
      name: "Pooja Shah",
      position: "Full Stack Developer",
      dept: "Technology",
      score: 81,
      skillScore: 78,
      status: "New Application",
      verified: true,
      notice: "60 Days",
      email: "pooja.shah@email.com",
      phone: "+91 76543 21099",
      experience: "3+ years",
      location: "Mumbai",
      appliedDate: "2024-01-21",
      lastActive: "2 hours ago",
      skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript"],
      keywordsMatched: ["React", "Node.js", "Express", "JavaScript"],
      missingSkills: ["MySQL", "AWS", "Docker"],
      avatar: "PS",
      matchPercentage: 70,
      salary: "₹9-11 LPA",
      education: "B.Tech Computer Science",
    },
    {
      id: 7,
      jobId: 4, // DevOps Engineer
      name: "Nisha Verma",
      position: "DevOps Engineer",
      dept: "Infrastructure",
      score: 78,
      skillScore: 74,
      status: "New Application",
      verified: false,
      notice: "60 Days",
      email: "nisha.verma@email.com",
      phone: "+91 65432 10987",
      experience: "2+ years",
      location: "Delhi",
      appliedDate: "2024-01-22",
      lastActive: "5 hours ago",
      skills: ["Kubernetes", "Docker", "Jenkins", "AWS", "Linux"],
      keywordsMatched: ["Kubernetes", "Docker", "Jenkins", "AWS", "Linux"],
      missingSkills: ["Python", "CI/CD", "Terraform", "Ansible"],
      avatar: "NV",
      matchPercentage: 80,
      salary: "₹7-9 LPA",
      education: "B.Tech Electronics",
    },
    {
      id: 8,
      jobId: 5, // UI/UX Designer
      name: "Priya Singh",
      position: "UI/UX Designer",
      dept: "Design",
      score: 82,
      skillScore: 79,
      status: "Portfolio Review",
      verified: true,
      notice: "45 Days",
      email: "priya.singh@email.com",
      phone: "+91 54321 09876",
      experience: "4+ years",
      location: "Pune",
      appliedDate: "2024-01-25",
      lastActive: "1 hour ago",
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
      keywordsMatched: [
        "Figma",
        "Adobe XD",
        "Sketch",
        "Prototyping",
        "User Research",
      ],
      missingSkills: ["HTML", "CSS", "JavaScript", "React"],
      avatar: "PS",
      matchPercentage: 95,
      salary: "₹9-11 LPA",
      education: "B.Des Visual Communication",
    },
    {
      id: 9,
      jobId: 6, // Data Scientist
      name: "Vikram Kumar",
      position: "Data Scientist",
      dept: "Analytics",
      score: 90,
      skillScore: 87,
      status: "Final Round",
      verified: true,
      notice: "90 Days",
      email: "vikram.kumar@email.com",
      phone: "+91 43210 98765",
      experience: "6+ years",
      location: "Chennai",
      appliedDate: "2024-01-12",
      lastActive: "30 minutes ago",
      skills: ["Python", "TensorFlow", "SQL", "Tableau", "Machine Learning"],
      keywordsMatched: [
        "Python",
        "TensorFlow",
        "SQL",
        "Tableau",
        "Machine Learning",
      ],
      missingSkills: ["PyTorch", "Spark", "Hadoop", "AWS SageMaker"],
      avatar: "VK",
      matchPercentage: 92,
      salary: "₹15-18 LPA",
      education: "M.Sc. Data Science",
    },
    {
      id: 10,
      jobId: 1, // Senior Frontend Developer
      name: "Sanjay Gupta",
      position: "Senior Frontend Developer",
      dept: "Engineering",
      score: 87,
      skillScore: 84,
      status: "Technical Round",
      verified: true,
      notice: "30 Days",
      email: "sanjay.gupta@email.com",
      phone: "+91 98765 43212",
      experience: "5+ years",
      location: "Bangalore",
      appliedDate: "2024-01-17",
      lastActive: "6 hours ago",
      skills: ["React", "JavaScript", "Redux", "TypeScript", "HTML", "CSS"],
      keywordsMatched: ["React", "JavaScript", "Redux", "TypeScript"],
      missingSkills: ["Node.js", "MongoDB", "GraphQL"],
      avatar: "SG",
      matchPercentage: 72,
      salary: "₹11-14 LPA",
      education: "B.Tech Computer Science",
    },
  ];

  // Enhanced mock data with more realistic information
  const dashboardStats = useMemo(
    () => ({
      avgScore: 76,
      totalCandidates: candidatesData.length,
      highMatch: candidatesData.filter((c) => c.score >= 85).length,
      mediumMatch: candidatesData.filter((c) => c.score >= 70 && c.score < 85)
        .length,
      lowMatch: candidatesData.filter((c) => c.score < 70).length,
      newApplications: candidatesData.filter(
        (c) => c.status === "New Application"
      ).length,
      verifiedCandidates: candidatesData.filter((c) => c.verified).length,
      unverifiedCandidates: candidatesData.filter((c) => !c.verified).length,
      totalJobs: jobRoles.length,
      activeJobs: jobRoles.filter((j) => j.status === "Active").length,
    }),
    []
  );

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let filtered = candidatesData.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.dept.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "verified" && candidate.verified) ||
        (filterStatus === "unverified" && !candidate.verified) ||
        (filterStatus === "high-score" && candidate.score >= 85);

      return matchesSearch && matchesFilter;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return new Date(b.appliedDate) - new Date(a.appliedDate);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, filterStatus, sortBy]);

  // Separate verified and unverified candidates
  const verifiedCandidates = useMemo(
    () => candidatesData.filter((candidate) => candidate.verified),
    []
  );

  const unverifiedCandidates = useMemo(
    () => candidatesData.filter((candidate) => !candidate.verified),
    []
  );

  // Get candidates for selected job
  const jobCandidates = useMemo(() => {
    if (!selectedJob) return [];
    return candidatesData.filter(
      (candidate) => candidate.jobId === selectedJob.id
    );
  }, [selectedJob]);

  // Calculate dynamic applicant counts for each job
  const jobRolesWithApplicants = useMemo(() => {
    return jobRoles.map((job) => ({
      ...job,
      applicants: candidatesData.filter(
        (candidate) => candidate.jobId === job.id
      ).length,
    }));
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      "Interview Scheduled": "bg-blue-100 text-blue-800 border-blue-200",
      "Technical Round": "bg-purple-100 text-purple-800 border-purple-200",
      "Under Review": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "New Application": "bg-green-100 text-green-800 border-green-200",
      "Portfolio Review": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Final Round": "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${color}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
        {trend && (
          <div className="flex items-center text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">+{trend}%</span>
          </div>
        )}
      </div>
    </div>
  );

  const CandidateDetailModal = ({ candidate, onClose }) => {
    if (!candidate) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {candidate.avatar}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {candidate.name}
                  </h2>
                  <p className="text-gray-600">{candidate.position}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getScoreColor(
                        candidate.score
                      )}`}
                    >
                      Score: {candidate.score}%
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        candidate.status
                      )}`}
                    >
                      {candidate.status}
                    </span>
                    {candidate.verified ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{candidate.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{candidate.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{candidate.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    Experience: {candidate.experience}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    Applied: {candidate.appliedDate}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    Notice Period: {candidate.notice}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    Last Active: {candidate.lastActive}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    Expected Salary: {candidate.salary}
                  </span>
                </div>
              </div>
            </div>

            {/* Match Score Visualization */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold mb-6 text-gray-800">
                Overall Match Analysis
              </h3>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-blue-600">
                    {candidate.matchPercentage}%
                  </div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                    Skills Match
                  </div>
                  <div className="text-xs text-gray-500">
                    Based on {candidate.skills.length} matching skills
                  </div>
                </div>
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="url(#modalGradient)"
                      strokeWidth="8"
                      strokeDasharray={`${
                        (candidate.matchPercentage / 100) * 352
                      } 352`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="modalGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">
                      {candidate.matchPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyword Analysis Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Keyword Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-green-700">
                      Matching Skills ({candidate.skills.length})
                    </h4>
                    <span className="text-sm text-gray-500">Strong Match</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-red-700">
                      Missing Skills ({candidate.missingSkills.length})
                    </h4>
                    <span className="text-sm text-gray-500">
                      Training Required
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {candidate.missingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Video className="w-4 h-4" />
                <span>Schedule Interview</span>
              </button>
              <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Send Message</span>
              </button>
              {!candidate.verified && (
                <button className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify Candidate</span>
                </button>
              )}
              <button className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Three-level view logic
  // Level 1: Job openings (default)
  // Level 2: Candidates for selected job
  // Level 3: ATS score analysis for selected candidate

  const handleBackNavigation = () => {
    if (selectedEmployee) {
      setSelectedEmployee(null); // Go back to candidates table
    } else if (selectedJob) {
      setSelectedJob(null); // Go back to job openings
    }
  };

  const getPageTitle = () => {
    if (selectedEmployee) {
      return `${selectedEmployee.name} - ATS Score Analysis`;
    }
    if (selectedJob) {
      return `${selectedJob.title} - Applicants`;
    }
    return "Job Openings";
  };

  const getPageSubtitle = () => {
    if (selectedEmployee) {
      return `Detailed ATS analysis for ${selectedEmployee.position}`;
    }
    if (selectedJob) {
      return `${jobCandidates.length} candidates applied for this position`;
    }
    return `${jobRolesWithApplicants.length} active job openings`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {(selectedJob || selectedEmployee) && (
              <button
                onClick={handleBackNavigation}
                className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm border border-gray-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
            )}
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {getPageTitle()}
              </h1>
              <p className="text-gray-600 mt-2">{getPageSubtitle()}</p>
            </div>
          </div>
        </div>

        {/* Level 1: Job Roles Table - Show when no job is selected */}
        {!selectedJob && !selectedEmployee && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                Job Openings
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Click on a job to view applicants
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Job Title
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Department
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Location
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Applicants
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Posted
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobRolesWithApplicants.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedJob(job)}
                    >
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">
                          {job.title}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-700 flex items-center">
                          <Building className="w-4 h-4 mr-1 text-gray-400" />
                          {job.department}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-700 flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {job.location}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {job.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">
                            {job.applicants}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-700 flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {job.posted}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Level 2: Candidates Table - Show when job is selected but no employee selected */}
        {selectedJob && !selectedEmployee && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Applicants for {selectedJob.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Review candidates and their ATS scores
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {jobCandidates.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Applicants</div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex space-x-3">
                  <select
                    className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="score">Sort by ATS Score</option>
                    <option value="name">Sort by Name</option>
                    <option value="date">Sort by Date</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Sequence
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Keywords Matched
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      ATS Score
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Skill Score
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobCandidates
                    .filter(
                      (candidate) =>
                        candidate.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        candidate.email
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                    .sort((a, b) => {
                      if (sortBy === "score") return b.score - a.score;
                      if (sortBy === "name")
                        return a.name.localeCompare(b.name);
                      if (sortBy === "date")
                        return (
                          new Date(b.appliedDate) - new Date(a.appliedDate)
                        );
                      return 0;
                    })
                    .map((candidate, index) => (
                      <tr
                        key={candidate.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {candidate.avatar}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {candidate.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {candidate.experience}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-700 flex items-center">
                            <Mail className="w-4 h-4 mr-1 text-gray-400" />
                            {candidate.email}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {candidate.keywordsMatched
                              .slice(0, 3)
                              .map((keyword, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200"
                                >
                                  {keyword}
                                </span>
                              ))}
                            {candidate.keywordsMatched.length > 3 && (
                              <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full border border-gray-200">
                                +{candidate.keywordsMatched.length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {candidate.keywordsMatched.length} /{" "}
                            {selectedJob.requiredSkills.length} matched
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(
                                candidate.score
                              )}`}
                            >
                              {candidate.score}%
                            </span>
                            {candidate.score >= 85 && (
                              <Star className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <div className="relative w-16 h-16">
                              <svg className="transform -rotate-90 w-16 h-16">
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="#e5e7eb"
                                  strokeWidth="6"
                                  fill="none"
                                />
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke={
                                    candidate.skillScore >= 80
                                      ? "#10b981"
                                      : candidate.skillScore >= 70
                                      ? "#f59e0b"
                                      : "#ef4444"
                                  }
                                  strokeWidth="6"
                                  fill="none"
                                  strokeDasharray={`${
                                    (candidate.skillScore / 100) * 176
                                  } 176`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold">
                                  {candidate.skillScore}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => setSelectedEmployee(candidate)}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {jobCandidates.length === 0 && (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No Applicants Yet
                </h3>
                <p className="text-gray-500">
                  This job posting hasn't received any applications yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Level 3: ATS Score Analysis - Show when employee is selected */}
        {selectedEmployee && (
          <div className="space-y-6">
            {/* Candidate Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {selectedEmployee.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedEmployee.name}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {selectedEmployee.position}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {selectedEmployee.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {selectedEmployee.phone}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {selectedEmployee.location}
                      </span>
                    </div>
                  </div>
                </div>
                {selectedEmployee.verified && (
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* ATS Score Analysis Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
                  <BarChart3 className="text-blue-500 mr-2 w-5 h-5" />
                  ATS Score Analysis
                </h2>
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <svg className="w-52 h-52">
                      <circle
                        cx="104"
                        cy="104"
                        r="85"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="14"
                      />
                      <circle
                        cx="104"
                        cy="104"
                        r="85"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="14"
                        strokeDasharray={`${
                          (selectedEmployee.score / 100) * 534.07
                        } 534.07`}
                        strokeLinecap="round"
                        transform="rotate(-90 104 104)"
                      />
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#1e40af" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-bold text-blue-600 mb-1">
                        {selectedEmployee.score}
                      </span>
                      <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        ATS Score
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium mb-6 text-base">
                    Overall Application Score
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 shadow-sm">
                      <p className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">
                        Skill Score
                      </p>
                      <div className="text-2xl font-bold text-green-800">
                        {selectedEmployee.skillScore}%
                      </div>
                      <p className="text-xs text-green-600 font-medium">
                        Technical Match
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm">
                      <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">
                        Match Rate
                      </p>
                      <div className="text-2xl font-bold text-blue-800">
                        {selectedEmployee.matchPercentage}%
                      </div>
                      <p className="text-xs text-blue-600 font-medium">
                        Overall Match
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
                  <Target className="text-blue-500 mr-2 w-5 h-5" />
                  Keyword Analysis
                </h2>
                <div className="space-y-6">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        Matched Keywords (
                        {selectedEmployee.keywordsMatched.length})
                      </h3>
                      <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                        Strong Match
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.keywordsMatched.map(
                        (keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium border border-green-200 rounded-full"
                          >
                            {keyword}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                        Missing Skills ({selectedEmployee.missingSkills.length})
                      </h3>
                      <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full">
                        Training Required
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.missingSkills
                        .slice(0, 6)
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-50 text-red-700 text-sm font-medium border border-red-200 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      {selectedEmployee.missingSkills.length > 6 && (
                        <span className="px-3 py-1 bg-gray-50 text-gray-700 text-sm font-medium border border-gray-200 rounded-full">
                          +{selectedEmployee.missingSkills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Requirements Analysis */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
                <BarChart3 className="text-blue-500 mr-2 w-5 h-5" />
                Core Requirements for ATS Analysis
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Resume Parsing Accuracy */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-blue-900">
                      Resume Parsing
                    </h3>
                    <div className="text-2xl font-bold text-blue-700">95%</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-700">Data Extraction</span>
                      <div className="w-20 bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "95%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-700">Format Quality</span>
                      <div className="w-20 bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "90%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keyword Matching */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-green-900">
                      Keyword Match
                    </h3>
                    <div className="text-2xl font-bold text-green-700">
                      {selectedEmployee.keywordsMatched.length}/
                      {selectedJob?.requiredSkills?.length || 10}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-700">Technical Skills</span>
                      <span className="font-semibold text-green-800">
                        {Math.round(selectedEmployee.skillScore)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-700">Industry Terms</span>
                      <span className="font-semibold text-green-800">85%</span>
                    </div>
                  </div>
                </div>

                {/* Scoring Criteria */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-purple-900">
                      Scoring Criteria
                    </h3>
                    <div className="text-2xl font-bold text-purple-700">
                      {selectedEmployee.score}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-purple-700">Must-Haves</span>
                      <span className="font-semibold text-purple-800">80%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-purple-700">Nice-to-Haves</span>
                      <span className="font-semibold text-purple-800">65%</span>
                    </div>
                  </div>
                </div>

                {/* Filtering Parameters */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-orange-900">
                      Filters Applied
                    </h3>
                    <CheckCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-700">Min. Threshold</span>
                      <span className="font-semibold text-orange-800">70%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-700">Screening Pass</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                        ✓
                      </span>
                    </div>
                  </div>
                </div>

                {/* Work Experience Analysis */}
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-indigo-900">
                      Experience
                    </h3>
                    <div className="text-2xl font-bold text-indigo-700">
                      {selectedEmployee.experience.split("+")[0]}+
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-indigo-700">Relevance</span>
                      <span className="font-semibold text-indigo-800">
                        High
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-indigo-700">Progression</span>
                      <span className="font-semibold text-indigo-800">
                        Steady
                      </span>
                    </div>
                  </div>
                </div>

                {/* Compliance Tracking */}
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-teal-900">
                      Compliance
                    </h3>
                    <CheckCircle className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-teal-700">Fair Evaluation</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                        ✓
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-teal-700">Audit Trail</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                        ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Data Points Visualization */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center text-gray-800">
                <Target className="text-blue-500 mr-2 w-5 h-5" />
                Data Points Analysis
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Work Experience */}
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg className="transform -rotate-90 w-20 h-20">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#e0e7ff"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(88 / 100) * 226} 226`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">
                        88%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    Experience Match
                  </p>
                </div>

                {/* Education */}
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg className="transform -rotate-90 w-20 h-20">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#d1fae5"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#10b981"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(92 / 100) * 226} 226`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-600">
                        92%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    Education Level
                  </p>
                </div>

                {/* Certifications */}
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg className="transform -rotate-90 w-20 h-20">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#e9d5ff"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#a855f7"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(75 / 100) * 226} 226`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-purple-600">
                        75%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    Certifications
                  </p>
                </div>

                {/* Career Progression */}
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-100">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg className="transform -rotate-90 w-20 h-20">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#fed7aa"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#f97316"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(85 / 100) * 226} 226`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-orange-600">
                        85%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    Career Growth
                  </p>
                </div>
              </div>

              {/* Additional Metrics Bar Chart */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-gray-700">
                          Skills Proficiency
                        </span>
                        <span className="text-blue-600">
                          {selectedEmployee.skillScore}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                          style={{ width: `${selectedEmployee.skillScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-gray-700">Location Match</span>
                        <span className="text-green-600">100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-gray-700">Notice Period</span>
                        <span className="text-purple-600">80%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                          style={{ width: "80%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-gray-700">
                          Salary Expectation
                        </span>
                        <span className="text-orange-600">90%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full"
                          style={{ width: "90%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-gray-700">Cultural Fit</span>
                        <span className="text-indigo-600">82%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full"
                          style={{ width: "82%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-medium mb-1">
                        <span className="text-gray-700">Communication</span>
                        <span className="text-teal-600">88%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full"
                          style={{ width: "88%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Application Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Applied Date</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedEmployee.appliedDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Active</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedEmployee.lastActive}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedEmployee.status
                      )}`}
                    >
                      {selectedEmployee.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  <Briefcase className="inline w-4 h-4 mr-1" />
                  Professional Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedEmployee.experience}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Education</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedEmployee.education}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Notice Period</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedEmployee.notice}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  <Award className="inline w-4 h-4 mr-1" />
                  Compensation
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Expected Salary</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedEmployee.salary}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedEmployee.dept}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location Preference</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedEmployee.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-wrap gap-3">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Video className="w-5 h-5" />
                  <span>Schedule Interview</span>
                </button>
                <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
                {!selectedEmployee.verified && (
                  <button className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Verify Candidate</span>
                  </button>
                )}
                <button className="bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download Resume</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSPage;
