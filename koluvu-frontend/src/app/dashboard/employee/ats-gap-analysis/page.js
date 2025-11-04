// src/app/dashboard/employee/ats-gap-analysis/page.js

"use client";

import React, { useState } from "react";
import {
  Star,
  MapPin,
  DollarSign,
  Clock,
  Award,
  Users,
  CheckCircle,
  TrendingUp,
  BookOpen,
  Code,
  Server,
  Database,
  Cloud,
  Shield,
  Smartphone,
  Palette,
  BarChart,
  Globe,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";

const SkillCoursesPage = () => {
  const [viewCourse, setViewCourse] = useState(null);
  const [enrollCourse, setEnrollCourse] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState({
    name: "",
    email: "",
    phone: "",
    selectedBatch: "",
  });
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const router = useRouter();

  // Training Centers and Courses data based on skill gaps
  const skillCourses = [
    {
      id: 1,
      title: "TypeScript Fundamentals & Advanced Features",
      category: "Programming",
      skillType: "TypeScript",
      priority: "High",
      duration: "8 weeks",
      teachingMode: "Online",
      location: "Remote",
      fee: "$299",
      trainingCenter: "TechSkill Academy",
      centerRating: 4.8,
      description:
        "Master TypeScript from basics to advanced features. Learn type safety, interfaces, generics, and modern TypeScript patterns used in enterprise applications.",
      features: [
        "Type safety & error prevention",
        "Interface design patterns",
        "Generic programming",
        "Advanced TypeScript features",
        "Real-world projects",
        "Industry best practices",
      ],
      upcomingBatches: [
        { startDate: "2024-10-15", seats: 20 },
        { startDate: "2024-11-01", seats: 15 },
      ],
      syllabus: [
        "TypeScript Basics & Setup",
        "Type Annotations & Inference",
        "Interfaces & Type Aliases",
        "Generic Types & Constraints",
        "Advanced Types & Utilities",
        "TypeScript with React/Node.js",
        "Testing TypeScript Code",
        "Enterprise Patterns",
      ],
      instructor: {
        name: "Alex Thompson",
        bio: "Senior TypeScript Developer with 8+ years experience at Microsoft and Google. TypeScript team contributor.",
        rating: 4.9,
      },
      cardColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      accentColor: "from-blue-600 to-indigo-600",
      icon: <Code className="w-6 h-6" />,
    },
    {
      id: 2,
      title: "AWS Cloud Architecture & Development",
      category: "Cloud Computing",
      skillType: "AWS",
      priority: "High",
      duration: "12 weeks",
      teachingMode: "Hybrid",
      location: "Bangalore / Remote",
      fee: "$599",
      trainingCenter: "CloudMaster Institute",
      centerRating: 4.9,
      description:
        "Comprehensive AWS training covering cloud architecture, services, and certification preparation. Build scalable applications on AWS infrastructure.",
      features: [
        "AWS certification preparation",
        "Hands-on cloud projects",
        "Architecture design patterns",
        "Cost optimization strategies",
        "Security best practices",
        "DevOps integration",
      ],
      upcomingBatches: [
        { startDate: "2024-10-20", seats: 12 },
        { startDate: "2024-11-10", seats: 18 },
      ],
      syllabus: [
        "AWS Core Services Overview",
        "EC2 & Compute Services",
        "Storage Solutions (S3, EBS)",
        "Networking & Security",
        "Database Services (RDS, DynamoDB)",
        "Serverless Architecture (Lambda)",
        "Monitoring & DevOps",
        "Cost Management & Optimization",
      ],
      instructor: {
        name: "Priya Nair",
        bio: "AWS Solutions Architect with 10+ years cloud experience. AWS Certified Solutions Architect Professional.",
        rating: 4.9,
      },
      cardColor: "bg-gradient-to-br from-orange-50 to-yellow-50",
      borderColor: "border-orange-200",
      accentColor: "from-orange-600 to-yellow-600",
      icon: <Cloud className="w-6 h-6" />,
    },
    {
      id: 3,
      title: "Docker & Kubernetes Containerization",
      category: "DevOps",
      skillType: "Docker",
      priority: "Medium",
      duration: "6 weeks",
      teachingMode: "Online",
      location: "Remote",
      fee: "$399",
      trainingCenter: "DevOps Excellence Hub",
      centerRating: 4.7,
      description:
        "Learn containerization with Docker and orchestration with Kubernetes. Master modern deployment strategies and microservices architecture.",
      features: [
        "Docker fundamentals",
        "Kubernetes orchestration",
        "Microservices deployment",
        "Container security",
        "CI/CD integration",
        "Production best practices",
      ],
      upcomingBatches: [
        { startDate: "2024-10-25", seats: 25 },
        { startDate: "2024-11-15", seats: 20 },
      ],
      syllabus: [
        "Docker Basics & Installation",
        "Container Management",
        "Docker Compose",
        "Kubernetes Architecture",
        "Pod & Service Management",
        "Deployment Strategies",
        "Monitoring & Logging",
        "Security & Best Practices",
      ],
      instructor: {
        name: "Rajesh Kumar",
        bio: "DevOps Engineer with 7+ years experience in containerization and Kubernetes. Docker Certified Associate.",
        rating: 4.8,
      },
      cardColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      accentColor: "from-purple-600 to-pink-600",
      icon: <Server className="w-6 h-6" />,
    },
    {
      id: 4,
      title: "Node.js Backend Development Mastery",
      category: "Backend Development",
      skillType: "Node.js",
      priority: "High",
      duration: "10 weeks",
      teachingMode: "Online",
      location: "Remote",
      fee: "$449",
      trainingCenter: "Backend Masters Academy",
      centerRating: 4.8,
      description:
        "Complete Node.js backend development course covering APIs, databases, authentication, and scalable server architecture.",
      features: [
        "RESTful API development",
        "Database integration",
        "Authentication & security",
        "Performance optimization",
        "Testing strategies",
        "Deployment & scaling",
      ],
      upcomingBatches: [
        { startDate: "2024-10-12", seats: 15 },
        { startDate: "2024-11-05", seats: 22 },
      ],
      syllabus: [
        "Node.js Fundamentals",
        "Express.js Framework",
        "Database Integration (MongoDB/SQL)",
        "Authentication & Authorization",
        "API Design & Security",
        "Testing & Debugging",
        "Performance & Scaling",
        "Deployment Strategies",
      ],
      instructor: {
        name: "Sarah Chen",
        bio: "Senior Backend Developer with 9+ years Node.js experience. Former Netflix and Uber engineer.",
        rating: 4.9,
      },
      cardColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      accentColor: "from-green-600 to-emerald-600",
      icon: <Server className="w-6 h-6" />,
    },
    {
      id: 5,
      title: "React Advanced Patterns & Performance",
      category: "Frontend Development",
      skillType: "React",
      priority: "Medium",
      duration: "8 weeks",
      teachingMode: "Online",
      location: "Remote",
      fee: "$379",
      trainingCenter: "Frontend Excellence Institute",
      centerRating: 4.7,
      description:
        "Advanced React patterns, state management, performance optimization, and modern React ecosystem for experienced developers.",
      features: [
        "Advanced React patterns",
        "State management (Redux/Zustand)",
        "Performance optimization",
        "Testing strategies",
        "Next.js integration",
        "Modern React ecosystem",
      ],
      upcomingBatches: [
        { startDate: "2024-10-18", seats: 18 },
        { startDate: "2024-11-08", seats: 20 },
      ],
      syllabus: [
        "Advanced Component Patterns",
        "Custom Hooks & Context",
        "State Management Solutions",
        "Performance Optimization",
        "Testing React Applications",
        "Next.js & SSR",
        "React 18+ Features",
        "Production Best Practices",
      ],
      instructor: {
        name: "Michael Rodriguez",
        bio: "React core contributor and senior frontend architect with 8+ years React experience.",
        rating: 4.8,
      },
      cardColor: "bg-gradient-to-br from-cyan-50 to-blue-50",
      borderColor: "border-cyan-200",
      accentColor: "from-cyan-600 to-blue-600",
      icon: <Code className="w-6 h-6" />,
    },
    {
      id: 6,
      title: "Python Data Science & Machine Learning",
      category: "Data Science",
      skillType: "Python",
      priority: "Medium",
      duration: "14 weeks",
      teachingMode: "Hybrid",
      location: "Mumbai / Remote",
      fee: "$699",
      trainingCenter: "Data Science Pro Academy",
      centerRating: 4.9,
      description:
        "Comprehensive Python data science course covering analysis, visualization, machine learning, and AI applications.",
      features: [
        "Python for data science",
        "Machine learning algorithms",
        "Data visualization",
        "Deep learning basics",
        "Real-world projects",
        "Industry tools & libraries",
      ],
      upcomingBatches: [
        { startDate: "2024-10-22", seats: 12 },
        { startDate: "2024-11-12", seats: 16 },
      ],
      syllabus: [
        "Python Programming Review",
        "NumPy & Pandas",
        "Data Visualization (Matplotlib/Seaborn)",
        "Statistical Analysis",
        "Machine Learning with Scikit-learn",
        "Deep Learning with TensorFlow",
        "NLP & Computer Vision Basics",
        "MLOps & Deployment",
      ],
      instructor: {
        name: "Dr. Anita Sharma",
        bio: "PhD in Computer Science, 12+ years in data science and ML. Former Google AI researcher.",
        rating: 4.9,
      },
      cardColor: "bg-gradient-to-br from-indigo-50 to-purple-50",
      borderColor: "border-indigo-200",
      accentColor: "from-indigo-600 to-purple-600",
      icon: <BarChart className="w-6 h-6" />,
    },
    {
      id: 7,
      title: "Cybersecurity & Ethical Hacking Bootcamp",
      category: "Security",
      skillType: "Cybersecurity",
      priority: "High",
      duration: "16 weeks",
      teachingMode: "Hybrid",
      location: "Bangalore / Remote",
      fee: "$799",
      trainingCenter: "SecureSkills Institute",
      centerRating: 4.8,
      description:
        "Comprehensive cybersecurity training covering ethical hacking, penetration testing, and security architecture.",
      features: [
        "Ethical hacking techniques",
        "Penetration testing",
        "Network security",
        "Incident response",
        "Compliance & governance",
        "Hands-on labs",
      ],
      upcomingBatches: [
        { startDate: "2024-11-01", seats: 10 },
        { startDate: "2024-12-01", seats: 12 },
      ],
      syllabus: [
        "Security Fundamentals",
        "Network Security & Protocols",
        "Web Application Security",
        "Penetration Testing Methods",
        "Malware Analysis",
        "Incident Response",
        "Compliance & Risk Management",
        "Advanced Threat Detection",
      ],
      instructor: {
        name: "Captain Vikram Singh",
        bio: "Cybersecurity expert with 15+ years experience. Former military cybersecurity specialist. CISSP certified.",
        rating: 4.9,
      },
      cardColor: "bg-gradient-to-br from-red-50 to-orange-50",
      borderColor: "border-red-200",
      accentColor: "from-red-600 to-orange-600",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      id: 8,
      title: "UI/UX Design & Research Fundamentals",
      category: "Design",
      skillType: "UI/UX Design",
      priority: "Medium",
      duration: "12 weeks",
      teachingMode: "Online",
      location: "Remote",
      fee: "$499",
      trainingCenter: "Design Innovation Studio",
      centerRating: 4.7,
      description:
        "Complete UI/UX design course covering user research, design systems, prototyping, and modern design tools.",
      features: [
        "User research methods",
        "Design thinking process",
        "Figma & Adobe XD mastery",
        "Prototyping & testing",
        "Design systems",
        "Portfolio development",
      ],
      upcomingBatches: [
        { startDate: "2024-10-28", seats: 20 },
        { startDate: "2024-11-18", seats: 25 },
      ],
      syllabus: [
        "Design Thinking & User Research",
        "Information Architecture",
        "Wireframing & Prototyping",
        "Visual Design Principles",
        "Design Systems & Components",
        "Usability Testing",
        "Accessibility in Design",
        "Portfolio & Case Studies",
      ],
      instructor: {
        name: "Emily Watson",
        bio: "Senior UX Designer with 10+ years experience at Apple and Airbnb. Design systems specialist.",
        rating: 4.8,
      },
      cardColor: "bg-gradient-to-br from-pink-50 to-rose-50",
      borderColor: "border-pink-200",
      accentColor: "from-pink-600 to-rose-600",
      icon: <Palette className="w-6 h-6" />,
    },
  ];

  const categories = [
    "All",
    "Programming",
    "Cloud Computing",
    "DevOps",
    "Backend Development",
    "Frontend Development",
    "Data Science",
    "Security",
    "Design",
  ];

  const filteredCourses =
    selectedCategory === "All"
      ? skillCourses
      : skillCourses.filter((course) => course.category === selectedCategory);

  const handleViewDetails = (course) => {
    setViewCourse(course);
    document.body.style.overflow = "hidden";
  };

  const handleEnroll = (course) => {
    setEnrollCourse(course);
    setEnrollmentData({
      ...enrollmentData,
      selectedBatch: course.upcomingBatches[0]?.startDate || "",
    });
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setViewCourse(null);
    setEnrollCourse(null);
    setAddCourseModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleEnrollmentSubmit = (e) => {
    e.preventDefault();
    console.log("Enrollment submitted:", {
      courseId: enrollCourse.id,
      ...enrollmentData,
    });
    handleCloseModal();
    alert(`Enrollment successful for ${enrollCourse.title}!`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnrollmentData({
      ...enrollmentData,
      [name]: value,
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleBackClick = () => {
    // Mock back functionality since router.back() might not work in standalone mode
    alert("Back button clicked - would normally navigate to ATS Analysis page");
  };

  // Utility mappers replacing styled-jsx classes
  const getPriorityBadgeClasses = (priority) => {
    switch (priority) {
      case "High":
        return "bg-gradient-to-br from-rose-100 to-red-50 text-red-700 border border-red-200";
      case "Medium":
        return "bg-gradient-to-br from-amber-100 to-yellow-50 text-amber-700 border border-amber-200";
      case "Low":
        return "bg-gradient-to-br from-emerald-100 to-green-50 text-green-700 border border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getTeachingModeClasses = (mode) => {
    const m = mode.toLowerCase();
    if (m === "online")
      return "bg-gradient-to-br from-emerald-100 to-green-50 text-emerald-700";
    if (m === "hybrid")
      return "bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-700";
    if (m === "offline")
      return "bg-gradient-to-br from-fuchsia-100 to-purple-50 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  const getSeatsClasses = (seats) => {
    if (seats > 15)
      return "bg-gradient-to-br from-emerald-100 to-green-50 text-emerald-700";
    if (seats > 8)
      return "bg-gradient-to-br from-amber-100 to-yellow-50 text-amber-700";
    return "bg-gradient-to-br from-rose-100 to-red-50 text-red-700";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black mb-2">
            Skill Enhancement Courses
          </h1>
          <p className="text-black">
            Bridge your skill gaps with targeted training programs
          </p>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to ATS Analysis
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-8 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-black mb-4">
            Filter by Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`${course.cardColor} rounded-xl overflow-hidden border ${course.borderColor} transition-all duration-300 shadow hover:shadow-lg hover:-translate-y-0.5`}
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${course.accentColor} text-white mr-3`}
                    >
                      {course.icon}
                    </div>
                    <div>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 ${getPriorityBadgeClasses(
                          course.priority
                        )}`}
                      >
                        {course.priority} Priority
                      </span>
                      <h3 className="text-xl font-bold text-black">
                        {course.title}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getTeachingModeClasses(
                      course.teachingMode
                    )}`}
                  >
                    {course.teachingMode}
                  </span>
                </div>

                <div className="flex items-center text-sm text-black mb-2">
                  <Award className="w-4 h-4 mr-2" />
                  <span className="font-medium">{course.trainingCenter}</span>
                  <div className="flex items-center ml-4">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{course.centerRating}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <Clock className="w-4 h-4 text-black mt-1 mr-2" />
                      <div>
                        <span className="text-black text-sm">Duration:</span>
                        <span className="text-black font-medium ml-2">
                          {course.duration}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-black mt-1 mr-2" />
                      <div>
                        <span className="text-black text-sm">Location:</span>
                        <span className="text-black font-medium ml-2">
                          {course.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="w-4 h-4 text-black mt-1 mr-2" />
                      <div>
                        <span className="text-black text-sm">Fee:</span>
                        <span className="text-black font-bold ml-2">
                          {course.fee}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-black mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                      Key Features
                    </h4>
                    <ul className="space-y-2 text-black">
                      {course.features.slice(0, 4).map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start text-sm text-black"
                        >
                          <CheckCircle className="w-4 h-4 mt-0.5 mr-2 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <h4 className="font-semibold text-black mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                      Description
                    </h4>
                    <p className="text-black text-sm leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-black mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      Upcoming Batches
                    </h4>
                    <div className="space-y-3">
                      {course.upcomingBatches.map((batch, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <span className="text-black font-medium text-sm">
                            Starts: {batch.startDate}
                          </span>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${getSeatsClasses(
                              batch.seats
                            )}`}
                          >
                            {batch.seats} seats
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => handleViewDetails(course)}
                      className="flex-1 bg-gray-900 border border-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center justify-center"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleEnroll(course)}
                      className={`flex-1 bg-gradient-to-r ${course.accentColor} hover:opacity-90 text-white px-4 py-2 rounded-lg transition-all text-sm flex items-center justify-center font-medium`}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Details Modal */}
        {viewCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 mx-auto">
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-black">
                      {viewCourse.title}
                    </h2>
                    <div className="flex items-center mt-2 text-sm text-black">
                      <Award className="w-4 h-4 mr-2" />
                      <span className="font-medium">
                        {viewCourse.trainingCenter}
                      </span>
                      <div className="flex items-center ml-4">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{viewCourse.centerRating}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-black hover:text-gray-700 p-1 -mr-2 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-3">
                        Course Overview
                      </h3>
                      <p className="text-black leading-relaxed">
                        {viewCourse.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-black mb-3">
                        What You'll Learn
                      </h3>
                      <ul className="space-y-3">
                        {viewCourse.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-black">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-black mb-3">
                        Course Syllabus
                      </h3>
                      <div className="space-y-2">
                        {viewCourse.syllabus.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start p-3 bg-gray-50 rounded-lg"
                          >
                            <span className="text-blue-600 font-semibold mr-3 text-sm">
                              {index + 1}.
                            </span>
                            <span className="text-black text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div
                      className={`${viewCourse.cardColor} p-6 rounded-lg border ${viewCourse.borderColor}`}
                    >
                      <h3 className="text-xl font-semibold text-black mb-4">
                        Course Details
                      </h3>

                      <div className="space-y-4 mb-6">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-black mr-3" />
                          <div>
                            <span className="text-black text-sm">
                              Duration:
                            </span>
                            <span className="text-black font-medium ml-2">
                              {viewCourse.duration}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-black mr-3" />
                          <div>
                            <span className="text-black text-sm">Mode:</span>
                            <span className="text-black font-medium ml-2">
                              {viewCourse.teachingMode}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Globe className="w-5 h-5 text-black mr-3" />
                          <div>
                            <span className="text-black text-sm">
                              Location:
                            </span>
                            <span className="text-black font-medium ml-2">
                              {viewCourse.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-black mr-3" />
                          <div>
                            <span className="text-black text-sm">Fee:</span>
                            <span className="text-black font-bold ml-2 text-lg">
                              {viewCourse.fee}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-medium text-black mb-3">
                          Instructor
                        </h4>
                        <div className="flex items-center space-x-4 mb-3">
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-r ${viewCourse.accentColor} flex items-center justify-center text-white font-medium text-lg`}
                          >
                            {viewCourse.instructor.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-black">
                              {viewCourse.instructor.name}
                            </p>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 mr-1" />
                              <span className="text-sm text-black">
                                {viewCourse.instructor.rating}/5
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-black">
                          {viewCourse.instructor.bio}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-black mb-3">
                          Upcoming Batches
                        </h4>
                        <div className="space-y-3">
                          {viewCourse.upcomingBatches.map((batch, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200"
                            >
                              <span className="text-black font-medium">
                                Starts: {batch.startDate}
                              </span>
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${getSeatsClasses(
                                  batch.seats
                                )}`}
                              >
                                {batch.seats} seats
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Modal */}
        {enrollCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-8 mx-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-black mb-1">
                      Enroll in {enrollCourse.title}
                    </h2>
                    <div className="flex items-center text-sm text-black">
                      <Award className="w-4 h-4 mr-2" />
                      <span className="font-medium">
                        {enrollCourse.trainingCenter}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-black hover:text-gray-700 p-1 -mr-2 transition-colors"
                    aria-label="Close enrollment modal"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
              </div>

              {/* Form */}
              <form onSubmit={handleEnrollmentSubmit} className="p-6 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={enrollmentData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-black"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={enrollmentData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-black"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={enrollmentData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-black"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="batch"
                    className="block text-sm font-medium text-black mb-2"
                  >
                    Select Batch
                  </label>
                  <select
                    id="batch"
                    name="selectedBatch"
                    value={enrollmentData.selectedBatch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white text-black"
                    required
                  >
                    {enrollCourse.upcomingBatches.map((batch, index) => (
                      <option key={index} value={batch.startDate}>
                        {batch.startDate} ({batch.seats} seats available)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-black">
                      Course Fee:
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {enrollCourse.fee}
                    </span>
                  </div>
                  <p className="text-xs text-black">
                    Payment options and installment plans available after
                    enrollment
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-3 bg-gradient-to-r ${enrollCourse.accentColor} hover:opacity-90 text-white font-medium rounded-lg transition-all`}
                  >
                    Complete Enrollment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillCoursesPage;
