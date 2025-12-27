// src/app/main/dashboard/employee/components/DashboardContent.js

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, config } from "@react-spring/web";
import Image from "next/image";
import JobPreferencesForm from "./JobPreferencesForm";
import Stats from "./stats";
import Notifications from "./notifications";
import Messages from "./messages";
import AppliedJobsModal from "./applied-jobs";
import { FiBell, FiMessageSquare, FiBriefcase } from "react-icons/fi";
import styles from "@koluvu/styles/employee/dashboard.module.css";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardContent() {
  const { user: authUser, loading } = useAuth();
  const [windowWidth, setWindowWidth] = useState(1024);
  const [isClient, setIsClient] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [messagesCount, setMessagesCount] = useState(5);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showAppliedJobsModal, setShowAppliedJobsModal] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  // Create dynamic user data from auth context
  const user = authUser
    ? {
        name:
          `${authUser.first_name || ""} ${authUser.last_name || ""}`.trim() ||
          authUser.email?.split("@")[0] ||
          "User",
        email: authUser.email || "",
        title: authUser.employee_profile?.current_designation || "Professional",
        company: authUser.employee_profile?.current_company || "Your Company",
        status: authUser.employee_profile?.is_profile_complete
          ? "Active"
          : "Incomplete",
        profileComplete:
          authUser.employee_profile?.profile_completion_percentage || 60,
        profilePicture:
          authUser.employee_profile?.effective_profile_picture ||
          authUser.employee_profile?.image_field_picture ||
          "",
        phone: authUser.employee_profile?.phone_number || "",
        location: authUser.employee_profile?.location || "",
        presentCTC: authUser.employee_profile?.current_ctc || "Not specified",
        expectedCTC: authUser.employee_profile?.expected_ctc || "Not specified",
        workPeriod:
          authUser.employee_profile?.total_experience || "Not specified",
        applications: dashboardData?.applications || [],
        resume: {
          summary:
            authUser.employee_profile?.summary ||
            "Experienced professional seeking new opportunities.",
          experience: authUser.employee_profile?.experience || [
            {
              position: "Senior Software Engineer",
              company: "Tech Innovations Inc.",
              duration: "2020 - Present",
              description:
                "Lead development of web applications using React and Node.js.",
            },
          ],
          education: authUser.employee_profile?.education || [
            {
              degree: "B.S. Computer Science",
              university: "University of California",
              year: "2018",
            },
          ],
          skills: authUser.employee_profile?.skills || [
            "JavaScript",
            "React",
            "Node.js",
            "TypeScript",
            "AWS",
          ],
          certifications: authUser.employee_profile?.certifications || [
            "AWS Certified Developer - Associate",
          ],
        },
        preferences: {
          jobTypes: authUser.employee_profile?.preferred_job_types || [
            "Full-time",
            "Remote",
          ],
          locations: authUser.employee_profile?.preferred_locations || [
            "Remote",
          ],
          salaryRange:
            authUser.employee_profile?.expected_salary || "18 - 25 LPA",
          industries: authUser.employee_profile?.preferred_industries || [
            "Technology",
            "SaaS",
          ],
        },
      }
    : {
        name: "Guest User",
        email: "",
        title: "Professional",
        company: "Your Company",
        status: "Incomplete",
        profileComplete: 0,
        profilePicture: "",
        phone: "",
        location: "",
        presentCTC: "Not specified",
        expectedCTC: "Not specified",
        workPeriod: "Not specified",
        applications: [],
        resume: {
          summary: "",
          experience: [],
          education: [],
          skills: [],
          certifications: [],
        },
        preferences: {
          jobTypes: [],
          locations: [],
          salaryRange: "",
          industries: [],
        },
      };

  const recommendedJobs = [
    {
      id: 1,
      designation: "Senior Frontend Developer",
      company: "TechCorp Solutions",
      matchScore: 92,
      location: "Remote",
      department: "Engineering",
      experience: "5+ years",
      skills: ["React", "TypeScript", "Redux", "CSS"],
      ctc: "18 - 22 LPA",
      noticePeriod: "30 days",
    },
    {
      id: 2,
      designation: "Full Stack Engineer",
      company: "InnovateSoft",
      matchScore: 88,
      location: "Bangalore",
      department: "Product Development",
      experience: "4+ years",
      skills: ["Node.js", "React", "MongoDB", "AWS"],
      ctc: "16 - 20 LPA",
      noticePeriod: "Immediate",
    },
    {
      id: 3,
      designation: "UI/UX Developer",
      company: "DesignHub",
      matchScore: 85,
      location: "Hyderabad",
      department: "Design",
      experience: "3+ years",
      skills: ["Figma", "React", "CSS", "Animation"],
      ctc: "12 - 16 LPA",
      noticePeriod: "15 days",
    },
    {
      id: 4,
      designation: "Backend Engineer",
      company: "DataSystems",
      matchScore: 90,
      location: "Pune",
      department: "Engineering",
      experience: "4+ years",
      skills: ["Python", "Django", "PostgreSQL", "AWS"],
      ctc: "15 - 20 LPA",
      noticePeriod: "30 days",
    },
    {
      id: 5,
      designation: "DevOps Specialist",
      company: "CloudNova",
      matchScore: 87,
      location: "Remote",
      department: "Operations",
      experience: "5+ years",
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
      ctc: "20 - 25 LPA",
      noticePeriod: "Immediate",
    },
  ];

  useEffect(() => {
    setIsClient(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch dashboard data when user is available
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (authUser && !loading) {
        try {
          // TODO: Replace with actual API endpoint
          // const response = await fetch(`/api/dashboard/employee/${authUser.id}`);
          // const data = await response.json();
          // setDashboardData(data);

          // For now, set some mock data based on user
          setDashboardData({
            applications: user.applications,
            recentActivity: [],
            notifications: [],
            messages: [],
          });
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      }
    };

    fetchDashboardData();
  }, [authUser, loading]);

  const getVisibleCount = () => {
    if (!isClient) return 1;
    if (windowWidth < 640) return 1;
    if (windowWidth < 768) return 1;
    if (windowWidth < 1024) return 2;
    return 3;
  };

  const visibleJobs = showAllJobs
    ? recommendedJobs
    : recommendedJobs.slice(0, getVisibleCount());

  const handleProfilePictureChange = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const pictureDataUrl = e.target.result;
      // TODO: Update profile picture in backend via API
      // For now, just store in localStorage for temporary display
      if (isClient) {
        localStorage.setItem("profilePicture", pictureDataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleShowAllJobs = () => {
    setShowAllJobs(!showAllJobs);
  };

  const handleApplyJob = (jobId) => {
    const jobToApply = recommendedJobs.find((job) => job.id === jobId);
    if (jobToApply) {
      const newApplication = {
        id: Date.now(),
        title: jobToApply.designation,
        company: jobToApply.company,
        status: "In Review",
        appliedDate: new Date().toISOString().split("T")[0],
      };

      // TODO: Submit application to backend API
      // For now, update local state
      setDashboardData((prev) => ({
        ...prev,
        applications: [...(prev?.applications || []), newApplication],
      }));

      setAppliedJobs((prev) => [...prev, jobId]);
    }
  };

  const handleWithdrawApplication = (applicationId) => {
    // TODO: Withdraw application via backend API
    // For now, update local state
    setDashboardData((prev) => ({
      ...prev,
      applications: (prev?.applications || []).filter(
        (app) => app.id !== applicationId
      ),
    }));
  };

  // Notifications and Messages handlers
  const handleShowNotifications = () => setShowNotifications(true);
  const handleCloseNotifications = () => setShowNotifications(false);
  const handleNotificationRead = () =>
    setNotificationsCount((prev) => Math.max(0, prev - 1));

  const handleShowMessages = () => setShowMessages(true);
  const handleCloseMessages = () => setShowMessages(false);
  const handleMessageRead = () =>
    setMessagesCount((prev) => Math.max(0, prev - 1));

  // Animations
  const profileAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: config.gentle,
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Section with Dark Background */}
      <div className="bg-gray-900 text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  className="relative h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold"
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt="Profile"
                      className="rounded-full"
                      width={80}
                      height={80}
                      priority
                    />
                  ) : (
                    <span>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  )}
                </motion.div>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-300">
                    {user.title} at {user.company}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.preferences.jobTypes.map((type, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-100"
                      >
                        {type}
                      </span>
                    ))}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-100">
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <motion.button
                  className="relative px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowNotifications}
                >
                  <FiBell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                  {notificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {notificationsCount}
                    </span>
                  )}
                </motion.button>
                <motion.button
                  className="relative px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowMessages}
                >
                  <FiMessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Messages</span>
                  {messagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {messagesCount}
                    </span>
                  )}
                </motion.button>
                <motion.button
                  className="px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAppliedJobsModal(true)}
                >
                  <FiBriefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    View Applied Jobs({user.applications.length})
                  </span>
                  <span className="sm:hidden">
                    Jobs({user.applications.length})
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Profile Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{user.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{user.workPeriod}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">About</p>
                  <p className="text-gray-700">{user.resume.summary}</p>
                </div>
              </div>
            </motion.div>

            {/* Job Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recommended Jobs
                  </h3>
                  <button
                    onClick={toggleShowAllJobs}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {showAllJobs ? "Show Less" : "View All"}
                  </button>
                </div>

                <div className="space-y-4">
                  {visibleJobs.map((job, index) => (
                    <div
                      key={job.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-600 font-semibold">
                              {job.company.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {job.designation}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {job.company}•{job.location}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {job.skills.slice(0, 3).map((skill, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              {job.experience}•{job.noticePeriod}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {job.ctc}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleApplyJob(job.id)}
                          disabled={
                            appliedJobs.includes(job.id) ||
                            user.applications.some(
                              (app) =>
                                app.title === job.designation &&
                                app.company === job.company
                            )
                          }
                          className={`ml-4 px-4 py-2 rounded-md text-sm font-medium ${
                            appliedJobs.includes(job.id) ||
                            user.applications.some(
                              (app) =>
                                app.title === job.designation &&
                                app.company === job.company
                            )
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                        >
                          {appliedJobs.includes(job.id) ||
                          user.applications.some(
                            (app) =>
                              app.title === job.designation &&
                              app.company === job.company
                          )
                            ? "Applied"
                            : "Apply Now"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - 1/3 width on large screens */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAppliedJobsModal(true)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      View Applied Jobs
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {user.applications.length}
                    </span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">
                      Update Resume
                    </span>
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Profile Completion
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.profileComplete}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${user.profileComplete}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h3>
                  <button
                    onClick={handleShowNotifications}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Interview Scheduled
                      </p>
                      <p className="text-sm text-gray-500">
                        Your interview with{" "}
                        {user.applications[0]?.company || "a company"} is
                        tomorrow at 10:00 AM
                      </p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <svg
                        className="h-5 w-5"
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
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Application Viewed
                      </p>
                      <p className="text-sm text-gray-500">
                        Your application for{" "}
                        {user.applications[1]?.title || "a position"} has been
                        viewed
                      </p>
                      <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AppliedJobsModal
        isOpen={showAppliedJobsModal}
        onClose={() => setShowAppliedJobsModal(false)}
        applications={user.applications}
        onWithdraw={handleWithdrawApplication}
      />

      {/* Notifications and Messages Modals */}
      <Notifications
        isOpen={showNotifications}
        onClose={handleCloseNotifications}
        onNotificationRead={handleNotificationRead}
      />
      <Messages
        isOpen={showMessages}
        onClose={handleCloseMessages}
        onMessageRead={handleMessageRead}
      />

      {/* Profile Completion Card */}
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className={styles.profileCompletionHeader}>
          <h3 className={styles.cardTitle}>Profile Completion</h3>
          <span className={styles.completionPercentage}>
            {user.profileComplete}%
          </span>
        </div>
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progress}
            initial={{ width: 0 }}
            animate={{ width: `${user.profileComplete}%` }}
            transition={{ duration: 1, type: "spring", stiffness: 100 }}
          />
        </div>
        <p className={styles.completionText}>
          Complete your profile to increase your visibility to employers.
        </p>
      </motion.div>

      <JobPreferencesForm />
      <Stats
        user={user}
        onViewAppliedJobs={() => setShowAppliedJobsModal(true)}
      />

      {/* Job Listings Card */}
      <motion.div
        className={styles.jobListings}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ position: "relative", zIndex: 1 }}
      >
        <div className={styles.jobHeader}>
          <motion.h2
            className={styles.jobListingTitle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Recommended Jobs
          </motion.h2>
          <motion.button
            className={styles.viewAllButton}
            onClick={toggleShowAllJobs}
            whileHover={{
              scale: 1.05,
              background: "linear-gradient(135deg, #4338ca, #6d28d9)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            {showAllJobs ? "Show Less" : "View All"}
          </motion.button>
        </div>
        <div className={styles.jobGrid}>
          <AnimatePresence>
            {visibleJobs.map((job, index) => (
              <motion.div
                key={job.id}
                className={styles.jobCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.1 },
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
                  transition: { duration: 0.3 },
                }}
              >
                <div className={styles.jobCardContent}>
                  <div className={styles.jobCardHeader}>
                    <div className={styles.companyLogo}>
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3 className={styles.jobTitle}>{job.designation}</h3>
                      <p className={styles.jobCompany}>{job.company}</p>
                      <motion.span
                        className={styles.matchScore}
                        whileHover={{
                          scale: 1.1,
                          background:
                            "linear-gradient(135deg, #22c55e, #16a34a)",
                        }}
                      >
                        {job.matchScore}% Match
                      </motion.span>
                    </div>
                  </div>
                  <div className={styles.jobDetails}>
                    <p className={styles.jobDetail}>
                      <span className={styles.detailLabel}>Location: </span>
                      {job.location}
                    </p>
                    <p className={styles.jobDetail}>
                      <span className={styles.detailLabel}>Department: </span>
                      {job.department}
                    </p>
                    <p className={styles.jobDetail}>
                      <span className={styles.detailLabel}>Experience: </span>
                      {job.experience}
                    </p>
                    <div>
                      <p className={styles.skillsLabel}>Key Skills:</p>
                      <div className={styles.skillsContainer}>
                        {job.skills.map((skill, skillIndex) => (
                          <motion.span
                            key={skillIndex}
                            className={styles.skillTag}
                            whileHover={{ scale: 1.05, background: "#e0e7ff" }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    <p className={styles.jobDetail}>
                      <span className={styles.detailLabel}>CTC: </span>
                      {job.ctc}
                    </p>
                    <p className={styles.jobDetail}>
                      <span className={styles.detailLabel}>
                        Notice Period:{" "}
                      </span>
                      {job.noticePeriod}
                    </p>
                  </div>
                  <div className={styles.jobActions}>
                    <motion.button
                      className={styles.viewButton}
                      whileHover={{
                        scale: 1.03,
                        backgroundColor: "#f5f3ff",
                        borderColor: "#6366f1",
                        boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      className={styles.applyButton}
                      whileHover={{
                        scale: 1.03,
                        background: "linear-gradient(135deg, #4338ca, #6d28d9)",
                        boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleApplyJob(job.id)}
                      disabled={
                        appliedJobs.includes(job.id) ||
                        user.applications.some(
                          (app) =>
                            app.title === job.designation &&
                            app.company === job.company
                        )
                      }
                    >
                      {appliedJobs.includes(job.id) ||
                      user.applications.some(
                        (app) =>
                          app.title === job.designation &&
                          app.company === job.company
                      )
                        ? "Applied"
                        : "Apply Now"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
