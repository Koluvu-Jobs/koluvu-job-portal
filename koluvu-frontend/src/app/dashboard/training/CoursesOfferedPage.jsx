// src/app/main/dashboard/training/CoursesOfferedPage.jsx

"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Helper function to generate a unique ID
const generateId = () => {
  return Math.floor(Math.random() * 100000);
};

const initialCourses = [
  {
    id: 1,
    title: "Web Development Bootcamp",
    category: "Programming",
    duration: "12 weeks",
    teachingMode: "Online",
    location: "Remote",
    fee: "$499",
    description:
      "Comprehensive full-stack web development course covering HTML, CSS, JavaScript, React, Node.js, and MongoDB. Perfect for beginners looking to start a career in web development.",
    features: [
      "Hands-on projects",
      "Career support",
      "Certificate upon completion",
      "Flexible schedule",
      "24/7 mentor support",
      "Real-world projects",
    ],
    upcomingBatches: [
      { startDate: "2023-10-01", seats: 15 },
      { startDate: "2023-11-15", seats: 20 },
    ],
    syllabus: [
      "HTML5 & CSS3 Fundamentals",
      "JavaScript ES6+",
      "React Framework",
      "Node.js & Express",
      "MongoDB Database",
      "RESTful APIs",
      "Authentication & Authorization",
      "Deployment Strategies",
    ],
    instructor: {
      name: "Sarah Johnson",
      bio: "Senior Full-Stack Developer with 10+ years of experience building web applications for Fortune 500 companies.",
      rating: 4.9,
    },
    cardColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
    borderColor: "border-purple-200",
    accentColor: "from-purple-600 to-indigo-600",
  },
  {
    id: 2,
    title: "Data Science Fundamentals",
    category: "Data Science",
    duration: "16 weeks",
    teachingMode: "Hybrid",
    location: "New York / Remote",
    fee: "$599",
    description:
      "Master data analysis, visualization, and machine learning with Python and R. Learn from industry experts and work with real datasets to build your portfolio.",
    features: [
      "Real-world datasets",
      "Industry mentors",
      "Portfolio projects",
      "Job placement assistance",
      "Python & R programming",
      "Machine learning fundamentals",
    ],
    upcomingBatches: [
      { startDate: "2023-10-10", seats: 10 },
      { startDate: "2023-12-05", seats: 12 },
    ],
    syllabus: [
      "Python for Data Science",
      "Data Visualization",
      "Statistical Analysis",
      "Machine Learning Basics",
      "Data Wrangling",
      "Exploratory Data Analysis",
    ],
    instructor: {
      name: "Michael Chen",
      bio: "Data Scientist with 8 years of experience at Google and Microsoft, specializing in machine learning applications.",
      rating: 4.8,
    },
    cardColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
    borderColor: "border-emerald-200",
    accentColor: "from-emerald-600 to-teal-600",
  },
  {
    id: 3,
    title: "Digital Marketing Certification",
    category: "Marketing",
    duration: "8 weeks",
    teachingMode: "Online",
    location: "Remote",
    fee: "$349",
    description:
      "Learn SEO, social media marketing, Google Ads, and analytics tools. Gain practical skills to launch successful digital marketing campaigns.",
    features: [
      "Certified instructors",
      "Practical assignments",
      "Live case studies",
      "Networking opportunities",
      "Google Analytics certification",
      "Facebook Ads training",
    ],
    upcomingBatches: [
      { startDate: "2023-09-25", seats: 25 },
      { startDate: "2023-11-01", seats: 30 },
    ],
    syllabus: [
      "SEO Fundamentals",
      "Social Media Marketing",
      "Google Ads",
      "Content Marketing",
      "Email Marketing",
      "Analytics & Reporting",
    ],
    instructor: {
      name: "Emily Rodriguez",
      bio: "Digital Marketing Director with 12 years of experience growing brands online.",
      rating: 4.7,
    },
    cardColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
    accentColor: "from-amber-600 to-orange-600",
  },
  {
    id: 4,
    title: "Cloud Computing with AWS",
    category: "DevOps",
    duration: "10 weeks",
    teachingMode: "Offline",
    location: "San Francisco",
    fee: "$649",
    description:
      "Comprehensive training on AWS services, architecture, and deployment strategies. Prepare for AWS certification with hands-on labs.",
    features: [
      "AWS certification prep",
      "Hands-on labs",
      "Capstone project",
      "Exam voucher included",
      "EC2, S3, Lambda training",
      "Cloud security best practices",
    ],
    upcomingBatches: [
      { startDate: "2023-10-15", seats: 8 },
      { startDate: "2024-01-10", seats: 12 },
    ],
    syllabus: [
      "AWS Fundamentals",
      "Compute Services",
      "Storage Solutions",
      "Networking",
      "Security & Compliance",
      "Serverless Architecture",
    ],
    instructor: {
      name: "David Wilson",
      bio: "AWS Certified Solutions Architect with 7 years of cloud infrastructure experience.",
      rating: 4.9,
    },
    cardColor: "bg-gradient-to-br from-sky-50 to-blue-50",
    borderColor: "border-sky-200",
    accentColor: "from-sky-600 to-blue-600",
  },
  {
    id: 5,
    title: "Mobile App Development with Flutter",
    category: "Mobile Development",
    duration: "14 weeks",
    teachingMode: "Online",
    location: "Remote",
    fee: "$549",
    description:
      "Build cross-platform mobile applications with Flutter framework. Learn Dart programming and publish apps on both iOS and Android stores.",
    features: [
      "Flutter framework",
      "Dart programming",
      "UI/UX principles",
      "API integration",
      "Firebase backend",
      "App publishing guidance",
    ],
    upcomingBatches: [
      { startDate: "2023-10-05", seats: 18 },
      { startDate: "2023-12-01", seats: 15 },
    ],
    syllabus: [
      "Dart Programming",
      "Flutter Widgets",
      "State Management",
      "API Integration",
      "Firebase Services",
      "App Deployment",
    ],
    instructor: {
      name: "Jessica Lee",
      bio: "Mobile Developer with 6 years of experience building cross-platform applications.",
      rating: 4.7,
    },
    cardColor: "bg-gradient-to-br from-fuchsia-50 to-pink-50",
    borderColor: "border-fuchsia-200",
    accentColor: "from-fuchsia-600 to-pink-600",
  },
  {
    id: 6,
    title: "Cybersecurity Fundamentals",
    category: "Security",
    duration: "12 weeks",
    teachingMode: "Hybrid",
    location: "Chicago / Remote",
    fee: "$699",
    description:
      "Learn essential cybersecurity concepts including network security, ethical hacking, and risk management. Prepare for industry certifications.",
    features: [
      "Network security",
      "Ethical hacking",
      "Risk management",
      "CompTIA Security+ prep",
      "Hands-on labs",
      "Incident response training",
    ],
    upcomingBatches: [
      { startDate: "2023-11-01", seats: 12 },
      { startDate: "2024-02-15", seats: 10 },
    ],
    syllabus: [
      "Security Principles",
      "Network Defense",
      "Threat Analysis",
      "Cryptography",
      "Penetration Testing",
      "Security Operations",
    ],
    instructor: {
      name: "Robert Smith",
      bio: "Cybersecurity Specialist with 10 years of experience in enterprise security.",
      rating: 4.8,
    },
    cardColor: "bg-gradient-to-br from-red-50 to-rose-50",
    borderColor: "border-red-200",
    accentColor: "from-red-600 to-rose-600",
  },
  {
    id: 7,
    title: "UX/UI Design Masterclass",
    category: "Design",
    duration: "10 weeks",
    teachingMode: "Online",
    location: "Remote",
    fee: "$449",
    description:
      "Master user experience and interface design principles. Learn Figma, Adobe XD, and create professional design portfolios.",
    features: [
      "Figma & Adobe XD",
      "User research methods",
      "Prototyping",
      "Design systems",
      "Portfolio building",
      "Industry design tools",
    ],
    upcomingBatches: [
      { startDate: "2023-10-20", seats: 20 },
      { startDate: "2024-01-05", seats: 18 },
    ],
    syllabus: [
      "Design Thinking",
      "Wireframing",
      "Prototyping",
      "User Testing",
      "Design Systems",
      "Portfolio Development",
    ],
    instructor: {
      name: "Olivia Martin",
      bio: "Senior UX Designer with 8 years of experience at top design agencies.",
      rating: 4.8,
    },
    cardColor: "bg-gradient-to-br from-violet-50 to-purple-50",
    borderColor: "border-violet-200",
    accentColor: "from-violet-600 to-purple-600",
  },
  {
    id: 8,
    title: "Business Analytics with Power BI",
    category: "Business Intelligence",
    duration: "6 weeks",
    teachingMode: "Online",
    location: "Remote",
    fee: "$399",
    description:
      "Transform data into business insights with Power BI. Learn data modeling, visualization, and dashboard creation for business decision making.",
    features: [
      "Power BI Desktop",
      "DAX language",
      "Data modeling",
      "Dashboard creation",
      "Real business datasets",
      "Microsoft certification prep",
    ],
    upcomingBatches: [
      { startDate: "2023-11-10", seats: 25 },
      { startDate: "2024-01-20", seats: 20 },
    ],
    syllabus: [
      "Data Import & Transformation",
      "Data Modeling",
      "DAX Formulas",
      "Visualization Techniques",
      "Dashboard Design",
      "Report Publishing",
    ],
    instructor: {
      name: "Daniel Brown",
      bio: "Business Intelligence Consultant with 9 years of experience in data analytics.",
      rating: 4.7,
    },
    cardColor: "bg-gradient-to-br from-cyan-50 to-blue-50",
    borderColor: "border-cyan-200",
    accentColor: "from-cyan-600 to-blue-600",
  },
];

const CoursesOfferedPage = () => {
  const [courses, setCourses] = useState(initialCourses);
  const [viewCourse, setViewCourse] = useState(null);
  const [enrollCourse, setEnrollCourse] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState({
    name: "",
    email: "",
    phone: "",
    selectedBatch: "",
  });
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    title: "",
    category: "",
    duration: "",
    teachingMode: "",
    location: "",
    fee: "",
    description: "",
    features: "",
    upcomingBatches: "",
    syllabus: "",
    instructorName: "",
    instructorBio: "",
    instructorRating: "",
    cardColor: "bg-gradient-to-br from-gray-50 to-gray-50",
    borderColor: "border-gray-200",
    accentColor: "from-gray-600 to-gray-600",
  });

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

  const handleNewCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourseData({
      ...newCourseData,
      [name]: value,
    });
  };

  const handleAddCourseSubmit = (e) => {
    e.preventDefault();
    const formattedFeatures = newCourseData.features
      .split(",")
      .map((item) => item.trim());
    const formattedSyllabus = newCourseData.syllabus
      .split(",")
      .map((item) => item.trim());
    const formattedBatches = newCourseData.upcomingBatches
      .split(";")
      .map((batch) => {
        const [startDate, seats] = batch.split(",").map((item) => item.trim());
        return { startDate, seats: parseInt(seats, 10) };
      });

    const newCourse = {
      id: generateId(),
      title: newCourseData.title,
      category: newCourseData.category,
      duration: newCourseData.duration,
      teachingMode: newCourseData.teachingMode,
      location: newCourseData.location,
      fee: newCourseData.fee,
      description: newCourseData.description,
      features: formattedFeatures,
      upcomingBatches: formattedBatches,
      syllabus: formattedSyllabus,
      instructor: {
        name: newCourseData.instructorName,
        bio: newCourseData.instructorBio,
        rating: parseFloat(newCourseData.instructorRating),
      },
      cardColor: newCourseData.cardColor,
      borderColor: newCourseData.borderColor,
      accentColor: newCourseData.accentColor,
    };

    setCourses([...courses, newCourse]);
    handleCloseModal();
    setNewCourseData({
      title: "",
      category: "",
      duration: "",
      teachingMode: "",
      location: "",
      fee: "",
      description: "",
      features: "",
      upcomingBatches: "",
      syllabus: "",
      instructorName: "",
      instructorBio: "",
      instructorRating: "",
      cardColor: "bg-gradient-to-br from-gray-50 to-gray-50",
      borderColor: "border-gray-200",
      accentColor: "from-gray-600 to-gray-600",
    });
    alert(`New course "${newCourse.title}" added successfully!`);
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm">
      <CardContent className="p-6">
        <div className="mb-10 text-center">
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3">
              Explore Our Courses
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover professional courses designed to boost your career
            </p>
            <div className="absolute top-0 right-0 hidden md:block">
              <Button
                onClick={() => setAddCourseModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Course
              </Button>
            </div>
          </div>
          <div className="mt-4 md:hidden">
            <Button
              onClick={() => setAddCourseModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full md:w-auto"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Course
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`${course.cardColor} rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border ${course.borderColor}`}
            >
              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${course.accentColor} text-white mb-2`}
                    >
                      {course.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      {course.title}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.teachingMode === "Online"
                        ? "bg-green-100 text-green-800"
                        : course.teachingMode === "Offline"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {course.teachingMode}
                  </span>
                </div>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <span className="text-gray-500 w-24 flex-shrink-0">
                        Duration:
                      </span>
                      <span className="text-gray-800 font-medium">
                        {course.duration}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 w-24 flex-shrink-0">
                        Location:
                      </span>
                      <span className="text-gray-800 font-medium">
                        {course.location}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 w-24 flex-shrink-0">
                        Fee:
                      </span>
                      <span className="text-gray-800 font-bold">
                        {course.fee}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Key Features
                    </h4>
                    <ul className="space-y-2 text-gray-700">
                      {course.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="w-4 h-4 mt-1 mr-2 text-green-500 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Description
                    </h4>
                    <p className="text-gray-600">{course.description}</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Upcoming Batches
                    </h4>
                    <div className="space-y-3">
                      {course.upcomingBatches.map((batch, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <span className="text-gray-700 font-medium">
                            Starts: {batch.startDate}
                          </span>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              batch.seats > 10
                                ? "bg-green-100 text-green-800"
                                : batch.seats > 5
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {batch.seats} seats left
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <Button
                      onClick={() => handleViewDetails(course)}
                      variant="outline"
                      className="flex-1 border-gray-300 hover:bg-gray-50"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
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
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleEnroll(course)}
                      className={`flex-1 bg-gradient-to-r ${course.accentColor} hover:opacity-90 text-white`}
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View Course Details Modal */}
        {viewCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-8 mx-auto">
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {viewCourse.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          viewCourse.teachingMode === "Online"
                            ? "bg-green-100 text-green-800"
                            : viewCourse.teachingMode === "Offline"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {viewCourse.teachingMode}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">
                        {viewCourse.duration}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">
                        {viewCourse.location}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-500 p-1 -mr-2 transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        Course Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {viewCourse.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        What You'll Learn
                      </h3>
                      <ul className="space-y-3">
                        {viewCourse.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div
                      className={`${viewCourse.cardColor} p-6 rounded-lg border ${viewCourse.borderColor}`}
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Course Details
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-3">
                            Syllabus
                          </h4>
                          <ul className="space-y-2 text-gray-700">
                            {viewCourse.syllabus.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <span
                                  className={`text-${
                                    viewCourse.accentColor.split("-")[1]
                                  }-500 mr-2`}
                                >
                                  •
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800 mb-3">
                            Instructor
                          </h4>
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-12 h-12 rounded-full bg-gradient-to-r ${viewCourse.accentColor} flex items-center justify-center text-white font-medium text-lg`}
                            >
                              {viewCourse.instructor.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {viewCourse.instructor.name}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Rating: {viewCourse.instructor.rating}/5
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-gray-600">
                            {viewCourse.instructor.bio}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-800 mb-3">
                            Upcoming Batches
                          </h4>
                          <div className="space-y-3">
                            {viewCourse.upcomingBatches.map((batch, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200"
                              >
                                <span className="text-gray-700 font-medium">
                                  Starts: {batch.startDate}
                                </span>
                                <span
                                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                    batch.seats > 10
                                      ? "bg-green-100 text-green-800"
                                      : batch.seats > 5
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {batch.seats} seats left
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
          </div>
        )}

        {/* Enrollment Modal */}
        {enrollCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-8 mx-auto">
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Enroll in {enrollCourse.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Complete the form to secure your spot
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-500 p-1 -mr-2 transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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
                <form onSubmit={handleEnrollmentSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={enrollmentData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={enrollmentData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={enrollmentData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="batch"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Select Batch
                    </label>
                    <select
                      id="batch"
                      name="selectedBatch"
                      value={enrollmentData.selectedBatch}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    >
                      {enrollCourse.upcomingBatches.map((batch, index) => (
                        <option key={index} value={batch.startDate}>
                          {batch.startDate} ({batch.seats} seats available)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className={`w-full py-3 bg-gradient-to-r ${enrollCourse.accentColor} hover:opacity-90 text-white font-medium rounded-lg transition-all`}
                    >
                      Complete Enrollment
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Course Modal */}
        {addCourseModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 mx-auto">
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 mb-1">
                      Add a New Course
                    </h2>
                    <p className="text-sm text-gray-600">
                      Fill out the details to add a new course to the list.
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-500 p-1 -mr-2 transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
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

              <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <form onSubmit={handleAddCourseSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Course Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={newCourseData.title}
                        onChange={handleNewCourseChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Category
                      </label>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        value={newCourseData.category}
                        onChange={handleNewCourseChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="duration"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Duration
                      </label>
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={newCourseData.duration}
                        onChange={handleNewCourseChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="teachingMode"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Teaching Mode
                      </label>
                      <select
                        id="teachingMode"
                        name="teachingMode"
                        value={newCourseData.teachingMode}
                        onChange={handleNewCourseChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      >
                        <option value="">Select a mode</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={newCourseData.location}
                        onChange={handleNewCourseChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="fee"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Fee
                      </label>
                      <input
                        type="text"
                        id="fee"
                        name="fee"
                        value={newCourseData.fee}
                        onChange={handleNewCourseChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newCourseData.description}
                      onChange={handleNewCourseChange}
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor="features"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Key Features (comma separated)
                    </label>
                    <input
                      type="text"
                      id="features"
                      name="features"
                      value={newCourseData.features}
                      onChange={handleNewCourseChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="syllabus"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Syllabus (comma separated)
                    </label>
                    <input
                      type="text"
                      id="syllabus"
                      name="syllabus"
                      value={newCourseData.syllabus}
                      onChange={handleNewCourseChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="upcomingBatches"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Upcoming Batches (format: "start date, seats; start date,
                      seats")
                    </label>
                    <input
                      type="text"
                      id="upcomingBatches"
                      name="upcomingBatches"
                      value={newCourseData.upcomingBatches}
                      onChange={handleNewCourseChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="instructorName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Instructor Name
                      </label>
                      <input
                        type="text"
                        id="instructorName"
                        name="instructorName"
                        value={newCourseData.instructorName}
                        onChange={handleNewCourseChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="instructorRating"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Instructor Rating
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="instructorRating"
                        name="instructorRating"
                        value={newCourseData.instructorRating}
                        onChange={handleNewCourseChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="instructorBio"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Instructor Bio
                    </label>
                    <textarea
                      id="instructorBio"
                      name="instructorBio"
                      value={newCourseData.instructorBio}
                      onChange={handleNewCourseChange}
                      rows="2"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      required
                    ></textarea>
                  </div>
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
                    >
                      Add Course
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoursesOfferedPage;
