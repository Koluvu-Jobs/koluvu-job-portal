"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useAuth } from "@/contexts/AuthContext";
import {
  Briefcase,
  MapPin,
  Bell,
  CheckCircle,
  Target,
  TrendingUp,
  Star,
  ArrowRight,
  Eye,
  Clock,
  Building2,
  Zap,
  Code,
  Database,
  Cloud,
  Box,
  Layers,
  User,
  Settings,
  X,
  Save,
  Edit3,
  Plus,
  Trash2,
} from "lucide-react";

// Create query client
const queryClient = new QueryClient();

// Tab mapping for employee dashboard
const tabToSlug = {
  Dashboard: "",
  "My Applications": "applications",
  "My Profile": "profile",
  "Resume Builder": "resume",
  ATS: "ats",
  "Skill Enhancement": "skill-enhancement",
  "Interview Feedback": "feedback",
  Verification: "verification",
  Subscription: "subscription",
  "Account Settings": "settings",
};

const slugToTab = Object.fromEntries(
  Object.entries(tabToSlug).map(([k, v]) => [v, k])
);

const availabilityOptions = [
  "Available for Hire",
  "Open to Offers",
  "Not Available",
];

// Dashboard component
const Dashboard = ({
  username,
  setActiveTab: navigateToTab,
  profileCompletion = 0,
  onShowCompletionGuide,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [dismissedNotifications, setDismissedNotifications] = useState(
    new Set()
  );
  const [appliedJobs, setAppliedJobs] = useState([]);

  const [locationJobs, setLocationJobs] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [preferredJobs, setPreferredJobs] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const fileInputRef = useRef(null);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    offers: 0,
    profileViews: 0,
  });
  const [rawStats, setRawStats] = useState(null);
  const [availabilityStatus, setAvailabilityStatus] = useState(
    availabilityOptions[0]
  );
  const [showJobsOptions, setShowJobsOptions] = useState(false);
  const [expandedJobSection, setExpandedJobSection] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [lastActivity, setLastActivity] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    name: "",
    role: "",
    email: "",
    location: "",
    bio: "",
    skills: [],
    experience: [],
    education: [],
  });

  useEffect(() => {
    if (!user) {
      setEmployee(null);
      setAvailabilityStatus(availabilityOptions[0]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const profile = user.employee_profile || {};
    const firstName = profile.first_name || user.first_name || "";
    const lastName = profile.last_name || user.last_name || "";
    const email = user.email || "";

    // Load background image if it exists in the profile
    if (profile.background_image) {
      setBackgroundImage(profile.background_image);
    }

    // Also fetch fresh profile data to ensure we have the latest background image
    refreshProfile();
    const combinedName = `${firstName} ${lastName}`.trim();
    const fallbackName = user.name || (email ? email.split("@")[0] : "");
    const displayName = combinedName || fallbackName || "Your Profile";
    const initialsBase = combinedName || fallbackName || "U";
    const initials = initialsBase
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const avatarImage =
      profile.effective_profile_picture ||
      user.google_profile_picture ||
      profile.avatar_url ||
      null;
    const experienceValue =
      profile.experience ||
      user.experience ||
      profile.experience_years ||
      user.experience_years ||
      "";
    const experience =
      typeof experienceValue === "number"
        ? `${experienceValue}+ years`
        : experienceValue || "5+ years";
    const availability =
      profile.availability || user.availability || availabilityOptions[0];
    const expectedSalary =
      profile.expected_salary || user.expected_salary || "₹15-20 LPA";
    const location =
      profile.location || user.location || "Hyderabad, Telangana";
    const skillsData =
      Array.isArray(profile.skills) && profile.skills.length > 0
        ? profile.skills
        : [
            {
              id: 1,
              name: "React.js",
              belt: "Advanced",
              bgColor: "bg-blue-50",
              textColor: "text-blue-500",
              icon: "react",
            },
            {
              id: 2,
              name: "Node.js",
              belt: "Advanced",
              bgColor: "bg-cyan-50",
              textColor: "text-cyan-500",
              icon: "node",
            },
            {
              id: 3,
              name: "Python",
              belt: "Expert",
              bgColor: "bg-sky-50",
              textColor: "text-sky-500",
              icon: "python",
            },
            {
              id: 4,
              name: "AWS",
              belt: "Expert",
              bgColor: "bg-indigo-50",
              textColor: "text-indigo-500",
              icon: "aws",
            },
            {
              id: 5,
              name: "Docker",
              belt: "Expert",
              bgColor: "bg-blue-50",
              textColor: "text-blue-500",
              icon: "docker",
            },
            {
              id: 6,
              name: "MongoDB",
              belt: "Intermediate",
              bgColor: "bg-cyan-50",
              textColor: "text-cyan-500",
              icon: "database",
            },
          ];

    setEmployee({
      id: user.id || profile.id || 1,
      name: displayName,
      role:
        profile.current_designation ||
        user.current_designation ||
        "Add your role",
      avatar: initials || "U",
      avatarImage,
      email,
      location,
      experience,
      availability,
      expectedSalary,
      skills: skillsData,
    });
    setAvailabilityStatus(availability);

    // Fetch real dashboard stats from backend
    fetchDashboardStats();

    // Initialize empty arrays - will be populated from backend

    setAnnouncements([]);
    setAppliedJobs([]);

    // Fetch real job applications data
    fetchJobApplications();

    // Initialize empty arrays - will be populated from backend
    setLocationJobs([]);
    setPreferredJobs([]);

    // Fetch real job data
    fetchJobRecommendations();

    setLoading(false);
  }, [user]);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Online/Offline status tracking
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastActivity(new Date());
    };
    const handleOffline = () => setIsOnline(false);
    const handleActivity = () => setLastActivity(new Date());

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("mousemove", handleActivity);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
    };
  }, []);

  // Profile completion is calculated in AppContent and passed as prop

  // Function to get missing profile fields for completion guide
  const getMissingFields = () => {
    if (!user || !user.employee_profile) return [];

    const profile = user.employee_profile;
    const missingFields = [];

    const fieldChecks = [
      {
        field: profile.first_name || user.first_name,
        name: "First Name",
        action: "Edit Profile",
        description: "Add your first name",
      },
      {
        field: profile.last_name || user.last_name,
        name: "Last Name",
        action: "Edit Profile",
        description: "Add your last name",
      },
      {
        field: profile.current_designation || profile.current_position,
        name: "Job Title",
        action: "Edit Profile",
        description: "Add your current role/designation",
      },
      {
        field: profile.location,
        name: "Location",
        action: "Edit Profile",
        description: "Add your location",
      },
      {
        field: profile.experience_years || profile.experience,
        name: "Experience",
        action: "Edit Profile",
        description: "Add your years of experience",
      },
      {
        field: profile.bio,
        name: "Bio",
        action: "Edit Profile",
        description: "Write a professional bio",
      },
      {
        field: profile.phone_number || profile.phone,
        name: "Phone Number",
        action: "Edit Profile",
        description: "Add your contact number",
      },
      {
        field: profile.linkedin_url || profile.linkedin_profile,
        name: "LinkedIn",
        action: "Edit Profile",
        description: "Connect your LinkedIn profile",
      },
      {
        field: profile.image_field_picture || profile.effective_profile_picture,
        name: "Profile Picture",
        action: "Upload Photo",
        description: "Add a professional profile picture",
      },
      {
        field: profile.background_image,
        name: "Background Image",
        action: "Customize Background",
        description: "Set a background image for your profile",
      },
    ];

    fieldChecks.forEach((check) => {
      if (
        !check.field ||
        check.field === "" ||
        check.field === "Add your role"
      ) {
        missingFields.push({
          name: check.name,
          action: check.action,
          description: check.description,
        });
      }
    });

    return missingFields;
  };

  // Function to fetch real dashboard stats from backend API
  const fetchDashboardStats = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/employee/dashboard/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRawStats(data.stats || data);
      // Update stats with real data from backend
      setStats({
        applications: data.stats?.applications || 0,
        interviews: data.stats?.interviews || 0,
        offers: data.stats?.offers || 0,
        profileViews: data.stats?.profile_views || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Keep stats at 0 if API fails rather than showing fake data
      setStats({
        applications: 0,
        interviews: 0,
        offers: 0,
        profileViews: 0,
      });
    }
  };

  // Function to fetch real job applications from backend
  const fetchJobApplications = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      const response = await fetch(
        "http://127.0.0.1:8000/api/employee/applications/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Job applications data:", data);

        // Handle different response formats
        let applicationsArray = [];
        if (Array.isArray(data)) {
          applicationsArray = data;
        } else if (data.results && Array.isArray(data.results)) {
          applicationsArray = data.results;
        } else if (data.applications && Array.isArray(data.applications)) {
          applicationsArray = data.applications;
        }

        // Transform to match UI format
        const transformedApplications = applicationsArray.map((app) => ({
          id: app.id,
          title: app.job_title || app.title || "Position Title",
          company: app.company_name || app.company || "Company Name",
          logo: (app.company_name || app.company || "CN")
            .substring(0, 2)
            .toUpperCase(),
          status: app.status || "Applied",
          statusColor: getStatusColor(app.status),
          appliedDate: new Date(app.applied_date || app.created_at),
          salary: app.salary_range || "Salary not disclosed",
          location: app.location || "Location not specified",
          type: app.job_type || "Full-time",
          progress: getProgressByStatus(app.status),
        }));

        setAppliedJobs(transformedApplications);
      }
    } catch (error) {
      console.error("Error fetching job applications:", error);
      setAppliedJobs([]); // Keep empty if API fails
    }
  };

  // Function to fetch job recommendations from backend
  const fetchJobRecommendations = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      // Fetch location-based jobs
      const locationResponse = await fetch(
        "http://127.0.0.1:8000/api/employee/jobs/location-based/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (locationResponse.ok) {
        const locationData = await locationResponse.json();
        console.log("Location jobs data:", locationData);

        let locationJobsArray = [];
        if (Array.isArray(locationData)) {
          locationJobsArray = locationData;
        } else if (
          locationData.results &&
          Array.isArray(locationData.results)
        ) {
          locationJobsArray = locationData.results;
        }

        const transformedLocationJobs = locationJobsArray.map((job) => ({
          id: job.id,
          title: job.title || "Job Title",
          company: job.company || "Company Name",
          logo: (job.company || "CN").substring(0, 2).toUpperCase(),
          location: job.location || "Location not specified",
          distance: job.distance || 0,
          salary: job.salary_range || "Salary not disclosed",
          type: job.job_type || "Full-time",
          posted: new Date(job.posted_date || job.created_at),
          matchScore: job.match_score || 70,
          commute: job.commute_time || "N/A",
        }));

        setLocationJobs(transformedLocationJobs);
      }

      // Fetch preference-based jobs
      const preferencesResponse = await fetch(
        "http://127.0.0.1:8000/api/employee/jobs/recommendations/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (preferencesResponse.ok) {
        const preferencesData = await preferencesResponse.json();
        console.log("Preferred jobs data:", preferencesData);

        let preferredJobsArray = [];
        if (Array.isArray(preferencesData)) {
          preferredJobsArray = preferencesData;
        } else if (
          preferencesData.results &&
          Array.isArray(preferencesData.results)
        ) {
          preferredJobsArray = preferencesData.results;
        }

        const transformedPreferredJobs = preferredJobsArray.map((job) => ({
          id: job.id,
          title: job.title || "Job Title",
          company: job.company || "Company Name",
          logo: (job.company || "CN").substring(0, 2).toUpperCase(),
          matchScore: job.match_score || 80,
          salary: job.salary_range || "Salary not disclosed",
          location: job.location || "Location not specified",
          type: job.job_type || "Full-time",
          skills: job.required_skills
            ? job.required_skills.split(",").map((s) => s.trim())
            : [],
          benefits: job.benefits
            ? job.benefits.split(",").map((b) => b.trim())
            : [],
          posted: new Date(job.posted_date || job.created_at),
          applicants: job.applicant_count || 0,
        }));

        setPreferredJobs(transformedPreferredJobs);
      }
    } catch (error) {
      console.error("Error fetching job recommendations:", error);
      setLocationJobs([]);
      setPreferredJobs([]);
    }
  };

  // Helper functions
  const getStatusColor = (status) => {
    const statusMap = {
      applied: "sky",
      under_review: "blue",
      interview_scheduled: "cyan",
      rejected: "gray",
      accepted: "green",
    };
    return statusMap[status] || "blue";
  };

  const getProgressByStatus = (status) => {
    const progressMap = {
      applied: 25,
      under_review: 50,
      interview_scheduled: 75,
      rejected: 100,
      accepted: 100,
    };
    return progressMap[status] || 25;
  };

  useEffect(() => {
    if (employee?.availability) {
      setAvailabilityStatus(employee.availability);
    }
  }, [employee?.availability]);

  // Handle notifications - for now using real-time SSE, no historical endpoint yet
  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setAnnouncements([]);
        return;
      }

      // Try to fetch notifications from backend (endpoint might not exist yet)
      const response = await fetch(
        "http://127.0.0.1:8000/api/employee/notifications/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Notifications fetched:", data);

        // Transform backend data to match expected format
        const notifications = (data.notifications || []).map(
          (notification) => ({
            id: notification.id,
            user: notification.sender_name || "System",
            avatar: notification.avatar || "🔔",
            time: new Date(notification.created_at),
            message: notification.message,
            type: notification.notification_type || "system",
            priority: notification.priority || "medium",
            unread: !notification.is_read,
            jobId: notification.related_job_id || null,
          })
        );

        // Filter out dismissed notifications
        const filteredNotifications = notifications.filter(
          (notif) => !dismissedNotifications.has(notif.id.toString())
        );

        setAnnouncements(filteredNotifications);
      } else if (response.status === 404) {
        // Notifications endpoint doesn't exist yet - show placeholder message
        console.info(
          "Notifications endpoint not available yet. Using real-time notifications only."
        );
        setAnnouncements([
          {
            id: "welcome-placeholder",
            user: "Koluvu System",
            avatar: "🔔",
            time: new Date(),
            message:
              "Welcome to your dashboard! Real-time notifications will appear here when you receive them.",
            type: "info",
            priority: "low",
            unread: true,
          },
        ]);
      } else {
        console.error("Failed to fetch notifications:", response.status);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Show a friendly message when notifications aren't available
      setAnnouncements([
        {
          id: "error-placeholder",
          user: "System",
          avatar: "ℹ️",
          time: new Date(),
          message:
            "Notifications are temporarily unavailable. They will be restored shortly.",
          type: "info",
          priority: "low",
          unread: true,
        },
      ]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [dismissedNotifications]);

  const handleAvailabilityChange = () => {
    setAvailabilityStatus((current) => {
      const currentIndex = availabilityOptions.indexOf(current);
      const nextValue =
        currentIndex === -1
          ? availabilityOptions[0]
          : availabilityOptions[
              (currentIndex + 1) % availabilityOptions.length
            ];
      setEmployee((prev) =>
        prev ? { ...prev, availability: nextValue } : prev
      );
      return nextValue;
    });
  };

  const handleAnnouncementNavigation = (announcement) => {
    if (announcement.jobId) {
      router.push(`/employee/jobs/${announcement.jobId}`);
    }
  };

  const handleAnnouncementKeyDown = (event, announcement) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleAnnouncementNavigation(announcement);
    }
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const handleViewAll = (type) => {
    setExpandedJobSection(expandedJobSection === type ? null : type);
  };

  const handleJobsOptionsClick = () => {
    setShowJobsOptions(!showJobsOptions);
  };

  // Load dismissed notifications from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem(
      `dismissed-notifications-${user?.id || "anonymous"}`
    );
    if (dismissed) {
      try {
        setDismissedNotifications(new Set(JSON.parse(dismissed)));
      } catch (error) {
        console.error("Failed to parse dismissed notifications:", error);
      }
    }
  }, [user]);

  // Save dismissed notifications to localStorage
  const saveDismissedNotifications = (dismissedSet) => {
    localStorage.setItem(
      `dismissed-notifications-${user?.id || "anonymous"}`,
      JSON.stringify([...dismissedSet])
    );
  };

  // Function to dismiss a notification
  const dismissNotification = async (notificationId, event) => {
    event?.stopPropagation(); // Prevent triggering the click handler

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        // Try to mark notification as read in backend (endpoint might not exist yet)
        const response = await fetch(
          `http://127.0.0.1:8000/api/employee/notifications/${notificationId}/mark-read/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok && response.status !== 404) {
          console.warn(
            "Failed to mark notification as read on server:",
            response.status
          );
        }
      }
    } catch (error) {
      console.warn("Notification backend not available yet:", error.message);
    }

    // Always update local state regardless of backend response
    const newDismissed = new Set([
      ...dismissedNotifications,
      notificationId.toString(),
    ]);
    setDismissedNotifications(newDismissed);
    saveDismissedNotifications(newDismissed);
  };

  // Function to clear all dismissed notifications (for testing/admin)
  const clearAllDismissed = () => {
    setDismissedNotifications(new Set());
    localStorage.removeItem(
      `dismissed-notifications-${user?.id || "anonymous"}`
    );
  };

  const handleBackgroundImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setEditingImage(e.target.result);
        setShowImageEditor(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const refreshProfile = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        "http://127.0.0.1:8000/api/employee/profile/",
        {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        }
      );

      if (response.ok) {
        const profileData = await response.json();
        console.log("Fresh profile data loaded:", profileData);

        // Update background image from fresh profile data
        if (profileData.background_image) {
          setBackgroundImage(profileData.background_image);
        }

        // Update user context with fresh profile data if needed
        if (user && user.employee_profile) {
          const updatedUser = {
            ...user,
            employee_profile: {
              ...user.employee_profile,
              ...profileData,
            },
          };
          // You might want to update the auth context here too
        }
      }
    } catch (err) {
      console.error("Error refreshing profile:", err);
    }
  };

  const handleImageEditorSave = (editedImage) => {
    // Close editor immediately to improve UX
    setShowImageEditor(false);
    setEditingImage(null);

    // If editedImage is a data URL, convert to Blob and upload to backend
    (async () => {
      try {
        // Optimistically set preview while uploading
        setBackgroundImage(editedImage);

        // Convert data URL to blob via fetch
        let blob;
        if (
          typeof editedImage === "string" &&
          editedImage.startsWith("data:")
        ) {
          const res = await fetch(editedImage);
          blob = await res.blob();
        } else if (editedImage instanceof Blob) {
          blob = editedImage;
        } else {
          // Can't handle this format; keep preview only
          return;
        }

        const filename = `background_${Date.now()}.png`;
        const file = new File([blob], filename, {
          type: blob.type || "image/png",
        });
        const formData = new FormData();
        formData.append("background_image", file);

        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(
          "http://127.0.0.1:8000/api/employee/profile/background/upload/",
          {
            method: "POST",
            headers: accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : {},
            body: formData,
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Use server-provided absolute URL when available
          if (data && data.background_image_url) {
            setBackgroundImage(data.background_image_url);
          }

          // Refresh the entire profile to sync with latest data
          await refreshProfile();
        } else {
          console.error("Failed to upload background image", response.status);
        }
      } catch (err) {
        console.error("Error uploading background image:", err);
      }
    })();
  };

  const handleImageEditorCancel = () => {
    setShowImageEditor(false);
    setEditingImage(null);
  };

  const removeBackgroundImage = (e) => {
    e.stopPropagation(); // Prevent triggering the parent's onClick
    setBackgroundImage(null);
    // Here you would typically also update your backend to remove the background image
  };

  const handleBackgroundImageClick = () => {
    fileInputRef.current?.click();
  };

  // Profile editing functions
  const handleEditProfile = () => {
    setEditProfileData({
      name: employee?.name || "",
      role: employee?.role || "",
      location: employee?.location || "",
      experience: employee?.experience || "",
      expectedSalary: employee?.expectedSalary || "",
      skills: employee?.skills || [],
      bio: employee?.bio || "",
    });
    setIsEditingProfile(true);
  };

  const updateEditProfileData = (field, value) => {
    setEditProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        alert("No access token found. Please log in again.");
        return;
      }

      console.log("Saving profile data:", editProfileData);

      // Client-side validation
      if (
        editProfileData.experience &&
        isNaN(parseInt(editProfileData.experience, 10))
      ) {
        alert("Please enter a valid number for years of experience.");
        return;
      }

      if (
        editProfileData.expectedSalary &&
        isNaN(parseFloat(editProfileData.expectedSalary))
      ) {
        alert("Please enter a valid number for expected salary.");
        return;
      }

      const updateData = {
        first_name: editProfileData.name?.split(" ")[0] || "",
        last_name: editProfileData.name?.split(" ").slice(1).join(" ") || "",
        current_designation: editProfileData.role,
        location: editProfileData.location,
        experience_years: editProfileData.experience
          ? Math.max(0, parseInt(editProfileData.experience, 10))
          : 0,
        expected_salary: editProfileData.expectedSalary
          ? Math.max(0, parseFloat(editProfileData.expectedSalary))
          : null,
        bio: editProfileData.bio,
        skills:
          editProfileData.skills
            ?.map((skill) => skill.name || skill)
            .join(", ") || "",
      };

      console.log("Update data being sent:", updateData);

      const response = await fetch(
        "http://127.0.0.1:8000/api/employee/profile/",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Profile update response:", responseData);

        // Update local employee data
        setEmployee((prev) => ({
          ...prev,
          name: editProfileData.name,
          role: editProfileData.role,
          location: editProfileData.location,
          experience: editProfileData.experience,
          expectedSalary: editProfileData.expectedSalary,
          skills: editProfileData.skills,
          bio: editProfileData.bio,
        }));

        setIsEditingProfile(false);
        setShowSuccessMessage(true);

        // Hide success message after 3 seconds
        setTimeout(() => setShowSuccessMessage(false), 3000);

        console.log("Profile updated successfully");
      } else {
        const errorData = await response.text();
        console.error("Failed to update profile:", response.status, errorData);

        // Try to parse the error and show user-friendly message
        try {
          const errorObj = JSON.parse(errorData);
          if (errorObj.details) {
            const errorMessages = Object.entries(errorObj.details)
              .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
              .join("\n");
            alert(`Please fix the following errors:\n${errorMessages}`);
          } else {
            alert(
              `Failed to update profile: ${errorObj.error || "Unknown error"}`
            );
          }
        } catch (e) {
          alert(`Failed to update profile: ${response.status} - ${errorData}`);
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert(`Error saving profile: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditProfileData({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-300 animate-spin"></div>
          </div>
          <h3 className="text-gray-700 text-xl font-semibold mb-2">
            Loading Your Dashboard
          </h3>
          <p className="text-blue-400">Fetching your latest opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {showImageEditor && (
        <ImageEditor
          image={editingImage}
          onSave={handleImageEditorSave}
          onCancel={handleImageEditorCancel}
        />
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out animate-bounce">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="font-medium">
              Profile updated successfully! 🎉
            </span>
          </div>
        </div>
      )}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #60a5fa, #38bdf8);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #3b82f6, #0ea5e9);
        }
      `}</style>

      {/* Header / Greeting Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
              {employee?.avatarImage ? (
                <img
                  src={employee.avatarImage}
                  alt={employee?.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                employee?.avatar || user?.first_name?.charAt(0) || "U"
              )}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back,{" "}
                  {user?.first_name || user?.email?.split("@")[0] || "User"}! 👋
                </h1>
                <button
                  onClick={() => window.location.reload()}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700"
                  title="Refresh Dashboard"
                >
                  🔄
                </button>
              </div>
              <p className="text-gray-600">
                {username ? `@${username} • ` : ""}Here's your summary for
                today.
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <span>🕒</span>
                  <span className="font-medium">
                    {currentTime.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>📅</span>
                  <span>
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium animate-pulse hover:bg-green-200 transition-colors duration-200 ${
                isOnline
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <span
                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              ></span>
              {isOnline
                ? employee?.availabilityStatus || "Available for Hire"
                : "Offline"}
            </div>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 sticky top-24 hover:shadow-xl transition-shadow duration-300">
            <div
              className="h-28 md:h-32 relative cursor-pointer group"
              onClick={handleBackgroundImageClick}
              style={{
                background: backgroundImage
                  ? `url(${backgroundImage}) center/cover no-repeat`
                  : "linear-gradient(to bottom right, var(--tw-gradient-stops))",
                "--tw-gradient-from": "#93c5fd",
                "--tw-gradient-via": "#67e8f9",
                "--tw-gradient-to": "#7dd3fc",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBackgroundImageUpload}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white/90 px-3 py-2 rounded-lg text-sm font-medium text-gray-700">
                    {backgroundImage
                      ? "Click to change background"
                      : "Click to add background"}
                  </div>
                </div>
              </div>
              {/* Removed the floating remove button in favor of Delete Photo inside the editor UI */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-xl ring-4 ring-white overflow-hidden">
                    {employee?.avatarImage ? (
                      <img
                        src={employee.avatarImage}
                        alt={employee?.name || "Profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      employee?.avatar
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 bg-green-300 rounded-full border-4 border-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-14 md:pt-16 px-4 md:px-6 pb-6">
              <div className="text-center mb-6">
                {!isEditingProfile ? (
                  <>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                      {employee?.name}
                    </h2>
                    <p className="text-blue-400 font-semibold text-sm md:text-base mb-3">
                      {employee?.role}
                    </p>
                  </>
                ) : (
                  <div className="space-y-3 mb-3">
                    <input
                      type="text"
                      value={editProfileData.name || ""}
                      onChange={(e) =>
                        updateEditProfileData("name", e.target.value)
                      }
                      placeholder="Full Name"
                      className="w-full text-center text-xl md:text-2xl font-bold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={editProfileData.role || ""}
                      onChange={(e) =>
                        updateEditProfileData("role", e.target.value)
                      }
                      placeholder="Job Title/Role"
                      className="w-full text-center text-blue-400 font-semibold text-sm md:text-base bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <button
                  onClick={handleAvailabilityChange}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-300 to-blue-300 text-white px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Zap className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span>{availabilityStatus}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6">
                {/* Removed Applications, Interviews, Offers, and Profile Views boxes as requested */}
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center text-sm md:text-base">
                  <Target className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-400 flex-shrink-0" />
                  Top Skills
                </h3>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  {employee?.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className={`${skill.bgColor} ${skill.textColor} p-3 md:p-4 rounded-lg text-center hover:shadow-md transition-all duration-200 transform hover:scale-105 cursor-pointer border`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        {skill.icon === "react" && <Code className="w-5 h-5" />}
                        {skill.icon === "node" && (
                          <Layers className="w-5 h-5" />
                        )}
                        {skill.icon === "python" && (
                          <Code className="w-5 h-5" />
                        )}
                        {skill.icon === "aws" && <Cloud className="w-5 h-5" />}
                        {skill.icon === "docker" && <Box className="w-5 h-5" />}
                        {skill.icon === "database" && (
                          <Database className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-xs font-semibold mb-1 truncate">
                        {skill.name}
                      </div>
                      <div className="text-[10px] uppercase tracking-wide opacity-80 truncate">
                        {skill.belt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {!isEditingProfile ? (
                <button
                  onClick={handleEditProfile}
                  className="w-full bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Additional Profile Fields */}
                  <div className="space-y-3 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editProfileData.location || ""}
                        onChange={(e) =>
                          updateEditProfileData("location", e.target.value)
                        }
                        placeholder="City, Country"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        value={editProfileData.bio || ""}
                        onChange={(e) =>
                          updateEditProfileData("bio", e.target.value)
                        }
                        placeholder="Tell us about yourself..."
                        rows={3}
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Experience
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={editProfileData.experience || ""}
                        onChange={(e) =>
                          updateEditProfileData("experience", e.target.value)
                        }
                        placeholder="Years of experience (e.g., 3)"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Salary
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editProfileData.expectedSalary || ""}
                        onChange={(e) =>
                          updateEditProfileData(
                            "expectedSalary",
                            e.target.value
                          )
                        }
                        placeholder="Expected salary (in LPA, e.g., 15.5)"
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills
                      </label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {(editProfileData.skills || []).map((skill, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="text"
                              value={
                                typeof skill === "string"
                                  ? skill
                                  : skill.name || ""
                              }
                              onChange={(e) => {
                                const updatedSkills = [
                                  ...(editProfileData.skills || []),
                                ];
                                updatedSkills[index] = e.target.value;
                                updateEditProfileData("skills", updatedSkills);
                              }}
                              placeholder="Skill name"
                              className="flex-1 bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                              onClick={() => {
                                const updatedSkills = (
                                  editProfileData.skills || []
                                ).filter((_, i) => i !== index);
                                updateEditProfileData("skills", updatedSkills);
                              }}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const updatedSkills = [
                              ...(editProfileData.skills || []),
                              "",
                            ];
                            updateEditProfileData("skills", updatedSkills);
                          }}
                          className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 text-sm transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Skill</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 border-t pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2.5 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="w-full bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white py-2 md:py-2.5 rounded-xl font-semibold text-sm md:text-base transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Activity Status */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Last activity:</span>
                  <span className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isOnline ? "bg-green-400" : "bg-gray-400"
                      }`}
                    ></div>
                    <span>{lastActivity.toLocaleTimeString()}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {/* Overview Cards Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Applications",
                value: stats?.applications || 0,
                icon: <Briefcase className="w-5 h-5 text-blue-600" />,
                bg: "bg-blue-100",
                sub: "Total submitted",
              },
              {
                label: "Interviews",
                value: stats?.interviews || 0,
                icon: <CheckCircle className="w-5 h-5 text-green-600" />,
                bg: "bg-green-100",
                sub: "Scheduled",
              },
              {
                label: "Notifications",
                value: announcements?.length || 0,
                icon: <Bell className="w-5 h-5 text-purple-600" />,
                bg: "bg-purple-100",
                sub: "Unread updates",
              },
              {
                label: "Profile Views",
                value: stats?.profileViews || 0,
                icon: <Eye className="w-5 h-5 text-orange-600" />,
                bg: "bg-orange-100",
                sub: "This month",
              },
            ].map((card, idx) => (
              <div
                key={card.label}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  if (card.label === "Notifications") {
                    // Show notifications panel
                    setShowNotifications(true);
                  } else if (card.label === "Profile Views") {
                    // Show profile analytics (future feature)
                    alert("Profile analytics coming soon!");
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg ${card.bg} group-hover:scale-110 transition-transform duration-200`}
                  >
                    {card.icon}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {card.value}
                    </span>
                    {isOnline && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-medium group-hover:text-gray-800">
                  {card.label}
                </p>
                <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-600">
                  {card.sub}
                </p>
                <div className="mt-2 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Click to view details →
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => navigateToTab("My Applications")}
                className="flex flex-col items-center p-4 text-center hover:bg-blue-50 rounded-lg transition-all duration-300 group hover:scale-105 hover:shadow-md"
              >
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-200 mb-2">
                  <Briefcase className="w-5 h-5 text-blue-600 group-hover:animate-bounce" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                  View Applications
                </span>
                <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {stats.applications} active
                </span>
              </button>

              <button
                onClick={() => {
                  if (profileCompletion < 100) {
                    onShowCompletionGuide && onShowCompletionGuide(true);
                  } else {
                    handleEditProfile();
                  }
                }}
                className="flex flex-col items-center p-4 text-center hover:bg-green-50 rounded-lg transition-all duration-300 group hover:scale-105 hover:shadow-md relative"
              >
                <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 group-hover:scale-110 transition-all duration-200 mb-2">
                  <User className="w-5 h-5 text-green-600 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-200">
                  {profileCompletion < 100
                    ? "Complete Profile"
                    : "Edit Profile"}
                </span>
                <span
                  className={`text-xs mt-1 transition-opacity duration-200 ${
                    profileCompletion < 100
                      ? "text-orange-500 font-semibold opacity-100"
                      : "text-gray-500 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {profileCompletion}% complete
                </span>
                {profileCompletion < 100 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                )}
              </button>

              <button
                onClick={() => navigateToTab("Resume Builder")}
                className="flex flex-col items-center p-4 text-center hover:bg-purple-50 rounded-lg transition-all duration-300 group hover:scale-105 hover:shadow-md"
              >
                <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-200 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600 group-hover:animate-bounce" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors duration-200">
                  Resume Builder
                </span>
                <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Create new resume
                </span>
              </button>

              <button
                onClick={() => navigateToTab("Skill Enhancement")}
                className="flex flex-col items-center p-4 text-center hover:bg-orange-50 rounded-lg transition-all duration-300 group hover:scale-105 hover:shadow-md"
              >
                <div className="p-3 bg-orange-100 rounded-full group-hover:bg-orange-200 group-hover:scale-110 transition-all duration-200 mb-2">
                  <Zap className="w-5 h-5 text-orange-600 group-hover:animate-pulse" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-200">
                  Skill Enhancement
                </span>
                <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Level up skills
                </span>
              </button>
            </div>
          </div>

          <div
            className="bg-white rounded-2xl shadow-lg p-12 mb-24 border border-gray-100"
            style={{ padding: "62px" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Bell className="w-7 h-7 text-blue-500" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Announcements
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearAllDismissed}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                  title="Restore all dismissed notifications"
                >
                  Restore All
                </button>
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition">
                  View All
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notificationsLoading ? (
                <div className="col-span-full text-center text-gray-500 py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    Loading notifications...
                  </div>
                </div>
              ) : announcements.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-8">
                  No notifications available.
                </div>
              ) : (
                announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col gap-2"
                    onClick={() => handleAnnouncementNavigation(announcement)}
                    onKeyDown={(e) =>
                      handleAnnouncementKeyDown(e, announcement)
                    }
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                        {announcement.avatar}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-gray-800 text-sm">
                          {announcement.user}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          {formatTimeAgo(announcement.time)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => dismissNotification(announcement.id, e)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors duration-200 group"
                        title="Dismiss notification"
                      >
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="text-gray-700 text-sm mb-2">
                      {announcement.message}
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          announcement.priority === "high"
                            ? "bg-red-100 text-red-600"
                            : announcement.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {announcement.type}
                      </span>
                      {announcement.unread && (
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 md:mt-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
            <Briefcase className="w-8 h-8 md:w-9 md:h-9 mr-3 text-blue-400 flex-shrink-0" />
            <span>Job Tracks</span>
          </h2>
          <div className="flex gap-3 flex-wrap mt-2">
            <button
              onClick={() => handleViewAll("all")}
              className="px-5 py-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-xl font-semibold text-sm hover:from-blue-500 hover:to-cyan-500 transition"
            >
              View All Jobs
            </button>
            <button
              onClick={() => handleViewAll("applied")}
              className="px-5 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-200 transition"
            >
              Applied Jobs
            </button>
            <button
              onClick={() => handleViewAll("location")}
              className="px-5 py-2 bg-cyan-100 text-cyan-700 rounded-xl font-semibold text-sm hover:bg-cyan-200 transition"
            >
              Location Based
            </button>
            <button
              onClick={() => handleViewAll("preferences")}
              className="px-5 py-2 bg-sky-100 text-sky-700 rounded-xl font-semibold text-sm hover:bg-sky-200 transition"
            >
              Job Preferences
            </button>
          </div>
        </div>

        <div
          className={`grid gap-6 md:gap-8 ${
            expandedJobSection === "applied" || expandedJobSection === "all"
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {/* Applied Jobs */}
          <div
            className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${
              expandedJobSection === "applied" || expandedJobSection === "all"
                ? "col-span-full"
                : "transform hover:-translate-y-1"
            }`}
          >
            <div className="bg-gradient-to-br from-blue-300 to-cyan-400 text-white p-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold mb-1">Applied Jobs</h3>
                  <p className="text-blue-100 text-sm opacity-90">
                    Track your application progress
                  </p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold">
                    {appliedJobs.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-blue-100 text-sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>{stats.interviews} interviews scheduled</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {appliedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => router.push(`/employee/jobs/${job.id}`)}
                  className="group p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/employee/jobs/${job.id}`);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md text-sm flex-shrink-0">
                        {job.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-800 group-hover:text-blue-500 transition-colors text-sm truncate">
                          {job.title}
                        </h4>
                        <p className="text-xs text-gray-600 flex items-center mt-1 truncate">
                          <Building2 className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{job.company}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2 font-medium">
                      <span>Application Progress</span>
                      <span className="font-semibold text-gray-700">
                        {job.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-full bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-3 gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-full font-semibold text-xs whitespace-nowrap ${
                        job.statusColor === "cyan"
                          ? "bg-cyan-100 text-cyan-600 border border-cyan-200"
                          : job.statusColor === "blue"
                          ? "bg-blue-100 text-blue-600 border border-blue-200"
                          : job.statusColor === "gray"
                          ? "bg-gray-100 text-gray-600 border border-gray-200"
                          : "bg-sky-100 text-sky-600 border border-sky-200"
                      }`}
                    >
                      {job.status}
                    </span>
                    <span className="text-gray-700 font-semibold text-sm whitespace-nowrap">
                      {job.salary}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                    <span className="flex-shrink-0">•</span>
                    <span className="truncate">{job.type}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => handleViewAll("applied")}
                className="w-full flex items-center justify-center space-x-2 py-3 text-blue-500 hover:text-blue-600 font-semibold text-sm transition-colors duration-200 hover:bg-blue-50 rounded-xl"
              >
                <span>View All Applied Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Location Based Jobs */}
          <div
            className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${
              expandedJobSection === "location" || expandedJobSection === "all"
                ? "col-span-full"
                : "transform hover:-translate-y-1"
            }`}
          >
            <div className="bg-gradient-to-br from-cyan-300 to-sky-400 text-white p-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    Location Based Jobs
                  </h3>
                  <p className="text-cyan-100 text-sm opacity-90">
                    Opportunities near you
                  </p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold">
                    {locationJobs.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-cyan-100 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                <span>Based in {employee?.location}</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {locationJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => router.push(`/employee/jobs/${job.id}`)}
                  className="p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/employee/jobs/${job.id}`);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-300 to-sky-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md text-sm flex-shrink-0">
                        {job.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-800 group-hover:text-cyan-500 transition-colors text-sm truncate">
                          {job.title}
                        </h4>
                        <p className="text-xs text-gray-600 flex items-center mt-1 truncate">
                          <Building2 className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{job.company}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-cyan-400 to-sky-400 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{job.matchScore}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-gray-700 font-semibold whitespace-nowrap">
                        {job.salary}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <span className="bg-gray-100 px-2 py-1 rounded-lg whitespace-nowrap">
                        {job.distance} km away
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-lg whitespace-nowrap">
                        {job.commute}
                      </span>
                    </div>
                    <span className="text-gray-700 font-semibold whitespace-nowrap">
                      {job.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => handleViewAll("location")}
                className="w-full flex items-center justify-center space-x-2 py-3 text-cyan-500 hover:text-cyan-600 font-semibold text-sm transition-colors duration-200 hover:bg-cyan-50 rounded-xl"
              >
                <span>View All Location Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Job Preferences */}
          <div
            className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${
              expandedJobSection === "preferences" ||
              expandedJobSection === "all"
                ? "col-span-full"
                : "transform hover:-translate-y-1"
            }`}
          >
            <div className="bg-gradient-to-br from-sky-300 to-blue-400 text-white p-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold mb-1">Job Preferences</h3>
                  <p className="text-sky-100 text-sm opacity-90">
                    Based on your profile
                  </p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold">
                    {preferredJobs.length}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-sky-100 text-sm">
                <Target className="w-4 h-4 mr-1" />
                <span>High match opportunities</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {preferredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => router.push(`/employee/jobs/${job.id}`)}
                  className="p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-sky-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/employee/jobs/${job.id}`);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-300 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold shadow-md text-sm flex-shrink-0">
                        {job.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-800 group-hover:text-sky-500 transition-colors text-sm truncate">
                          {job.title}
                        </h4>
                        <p className="text-xs text-gray-600 flex items-center mt-1 truncate">
                          <Building2 className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{job.company}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-sky-400 to-blue-400 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{job.matchScore}%</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-sky-50 text-sky-600 text-xs rounded-lg border border-sky-100 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-gray-700 font-semibold whitespace-nowrap">
                        {job.salary}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-700 font-semibold whitespace-nowrap">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 flex-shrink-0" />
                      <span className="text-gray-700 font-semibold whitespace-nowrap">
                        {job.applicants} applicants
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => handleViewAll("preferences")}
                className="w-full flex items-center justify-center space-x-2 py-3 text-sky-500 hover:text-sky-600 font-semibold text-sm transition-colors duration-200 hover:bg-sky-50 rounded-xl"
              >
                <span>View All Preferred Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lazy load components for different tabs
// Temporarily commented out to debug syntax error
// const ImageEditor = dynamic(
//   () => import("@/components/imageEditor/ImageEditor"),
//   {
//     loading: () => (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
//         <div className="bg-white rounded-lg p-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
//         </div>
//       </div>
//     ),
//   }
// );

const ApplicationsComponent = dynamic(() => import("./application/page"), {
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading applications...</p>
    </div>
  ),
});

const ProfileComponent = dynamic(() => import("./profile/profile"), {
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading profile...</p>
    </div>
  ),
});

const ResumeBuilderComponent = dynamic(() => import("./resume-builder/page"), {
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading resume builder...</p>
    </div>
  ),
});

const ATSComponent = dynamic(() => import("./ats/page"), {
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading ATS...</p>
    </div>
  ),
});

const SkillEnhancementComponent = dynamic(
  () => import("./ats-gap-analysis/page"),
  {
    loading: () => (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading skill enhancement...</p>
      </div>
    ),
  }
);

const InterviewFeedbackComponent = dynamic(() => import("./feedback/page"), {
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading interview feedback...</p>
    </div>
  ),
});

const VerificationComponent = dynamic(() => import("./verification/page"), {
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading verification...</p>
    </div>
  ),
});

const SubscriptionComponent = dynamic(() => import("./subscription/page"), {
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading subscription...</p>
    </div>
  ),
});

const AccountSettingsComponent = ({ user }) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: user?.name || user?.first_name || "",
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    notifications: true,
    newsletter: true,
    twoFactor: false,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (activeTab === "profile") {
      if (formData.username && formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }
      if (formData.username && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username =
          "Username can only contain letters, numbers, and underscores";
      }
    }

    if (activeTab === "password") {
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // API call would go here
      console.log("Form submitted:", formData);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "password", label: "Password", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "security", label: "Security", icon: "🛡️" },
    { id: "danger", label: "Danger Zone", icon: "⚠️" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}

        {activeTab === "password" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Password
            </button>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Email Notifications
                </h3>
                <p className="text-gray-600">
                  Receive notifications about your account activity
                </p>
              </div>
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Preferences
            </button>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Two-Factor Authentication
                </h3>
                <p className="text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
              <input
                type="checkbox"
                name="twoFactor"
                checked={formData.twoFactor}
                onChange={handleInputChange}
                className="h-5 w-5 text-blue-600"
              />
            </div>
          </div>
        )}

        {activeTab === "danger" && (
          <div className="space-y-6">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Delete Account
              </h3>
              <p className="text-red-700 mb-4">This action cannot be undone</p>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

// Main content component
const AppContent = ({ username, forceTab }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(forceTab || "Dashboard");
  const [showCompletionGuide, setShowCompletionGuide] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const { user, loading, isAuthenticated, accessToken } = useAuth();

  // Calculate profile completion percentage
  useEffect(() => {
    if (user && user.employee_profile) {
      const profile = user.employee_profile;

      // Check required profile fields
      const profileFields = [
        profile.first_name || user.first_name,
        profile.last_name || user.last_name,
        profile.current_designation || profile.current_position,
        profile.location,
        profile.experience_years || profile.experience,
        profile.bio,
        profile.phone_number || profile.phone,
        profile.linkedin_url || profile.linkedin_profile,
        profile.image_field_picture || profile.effective_profile_picture,
        profile.background_image,
      ];

      const completedFields = profileFields.filter(
        (field) =>
          field !== null &&
          field !== undefined &&
          field !== "" &&
          field !== "Add your role"
      ).length;

      const percentage = Math.round(
        (completedFields / profileFields.length) * 100
      );
      setProfileCompletion(percentage);
    } else {
      setProfileCompletion(0);
    }
  }, [user]);

  // Authentication and role guard - simplified to avoid redirect loops
  useEffect(() => {
    console.log("Employee dashboard auth check:", {
      loading,
      isAuthenticated,
      user: user
        ? { id: user.id, email: user.email, user_type: user.user_type }
        : null,
      hasEmployeeProfile: !!user?.employee_profile,
    });

    // Wait for auth to finish loading before making decisions
    if (loading) {
      console.log("Auth still loading, waiting...");
      return;
    }

    // If definitely not authenticated after loading is complete
    if (!isAuthenticated && !user) {
      console.log(
        "User not authenticated after loading complete, redirecting to login"
      );
      router.replace("/auth/login/employee");
      return;
    }

    // If user is authenticated but is definitely an employer (not employee)
    if (user && user.user_type === "employer" && !user.employee_profile) {
      console.log("User is employer, redirecting to employer dashboard");
      router.replace("/dashboard/employer");
      return;
    }

    // Allow access for employees or users with employee profiles
    if (user && (user.user_type === "employee" || user.employee_profile)) {
      console.log("Access granted - employee user detected");

      // If no username is provided in the URL, redirect to username route
      if (!username && user.username) {
        const currentTab = searchParams.get("tab");
        const redirectUrl = currentTab
          ? `/dashboard/employee/${user.username}?tab=${currentTab}`
          : `/dashboard/employee/${user.username}`;
        console.log("Redirecting to username route:", redirectUrl);
        router.replace(redirectUrl);
        return;
      }

      return;
    }

    // If we have a user but unclear role, allow access (better than redirect loop)
    if (user) {
      console.log(
        "User found with unclear role, allowing access to avoid redirect loop"
      );
      return;
    }
  }, [loading, isAuthenticated, user, router]);

  // Keep activeTab synced with URL
  useEffect(() => {
    const tabSlug = searchParams.get("tab") ?? "";
    const tabName = slugToTab[tabSlug] || "Dashboard";
    setActiveTab(tabName);
  }, [searchParams]);

  // Function to navigate when sidebar calls setActiveTab
  const navigateToTab = (tabName) => {
    const slug = tabToSlug[tabName] ?? "";
    const href = slug
      ? `/dashboard/employee/${username}?tab=${slug}`
      : `/dashboard/employee/${username}`;
    router.push(href);
    setActiveTab(tabName);
  };

  // Render content based on active tab
  const renderTabContent = () => {
    // Show loading state while checking authentication
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Don't render content if not authenticated (will redirect)
    if (!isAuthenticated) {
      return null;
    }

    switch (activeTab) {
      case "Dashboard":
        return (
          <Dashboard
            username={username}
            setActiveTab={navigateToTab}
            profileCompletion={profileCompletion}
            onShowCompletionGuide={setShowCompletionGuide}
          />
        );
      case "My Applications":
        return <ApplicationsComponent />;
      case "My Profile":
        return <ProfileComponent />;
      case "Resume Builder":
        return <ResumeBuilderComponent />;
      case "ATS":
        return <ATSComponent />;
      case "Skill Enhancement":
        return <SkillEnhancementComponent />;
      case "Interview Feedback":
        return <InterviewFeedbackComponent />;
      case "Verification":
        return <VerificationComponent />;
      case "Subscription":
        return <SubscriptionComponent />;
      case "Account Settings":
        return <AccountSettingsComponent user={user} />;
      default:
        return (
          <Dashboard
            username={username}
            setActiveTab={setActiveTab}
            profileCompletion={profileCompletion}
            onShowCompletionGuide={setShowCompletionGuide}
          />
        );
    }
  };

  // Profile Completion Guide Modal
  const ProfileCompletionGuide = ({ show, onClose }) => {
    // Calculate missing fields inline
    const getMissingFieldsInline = () => {
      if (!user || !user.employee_profile) return [];

      const profile = user.employee_profile;
      const missingFields = [];

      const fieldChecks = [
        {
          field: profile.first_name || user.first_name,
          name: "First Name",
          action: "Edit Profile",
          description: "Add your first name",
        },
        {
          field: profile.last_name || user.last_name,
          name: "Last Name",
          action: "Edit Profile",
          description: "Add your last name",
        },
        {
          field: profile.current_designation || profile.current_position,
          name: "Job Title",
          action: "Edit Profile",
          description: "Add your current role/designation",
        },
        {
          field: profile.location,
          name: "Location",
          action: "Edit Profile",
          description: "Add your location",
        },
        {
          field: profile.experience_years || profile.experience,
          name: "Experience",
          action: "Edit Profile",
          description: "Add your years of experience",
        },
        {
          field: profile.bio,
          name: "Bio",
          action: "Edit Profile",
          description: "Write a professional bio",
        },
        {
          field: profile.phone_number || profile.phone,
          name: "Phone Number",
          action: "Edit Profile",
          description: "Add your contact number",
        },
        {
          field: profile.linkedin_url || profile.linkedin_profile,
          name: "LinkedIn",
          action: "Edit Profile",
          description: "Connect your LinkedIn profile",
        },
        {
          field:
            profile.image_field_picture || profile.effective_profile_picture,
          name: "Profile Picture",
          action: "Upload Photo",
          description: "Add a professional profile picture",
        },
        {
          field: profile.background_image,
          name: "Background Image",
          action: "Customize Background",
          description: "Set a background image for your profile",
        },
      ];

      fieldChecks.forEach((check) => {
        if (
          !check.field ||
          check.field === "" ||
          check.field === "Add your role"
        ) {
          missingFields.push({
            name: check.name,
            action: check.action,
            description: check.description,
          });
        }
      });

      return missingFields;
    };

    const missingFields = getMissingFieldsInline();

    return (
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
            show ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Complete Your Profile
                  </h3>
                  <p className="text-sm text-gray-500">
                    Get noticed by employers with a complete profile
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Profile Completion
                </span>
                <span className="text-sm font-bold text-green-600">
                  {profileCompletion}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Missing Information ({missingFields.length} items)
              </h4>
              {missingFields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{field.name}</h5>
                    <p className="text-sm text-gray-600">{field.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      if (field.action === "Edit Profile") {
                        handleEditProfile();
                      } else if (field.action === "Upload Photo") {
                        document
                          .getElementById("profile-picture-upload")
                          ?.click();
                      } else if (field.action === "Customize Background") {
                        document.getElementById("background-upload")?.click();
                      }
                    }}
                    className="px-3 py-1 text-xs font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-600 hover:text-white transition-all duration-200"
                  >
                    {field.action}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Later
              </button>
              <button
                onClick={() => {
                  onClose();
                  handleEditProfile();
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Complete Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderTabContent()}
      <ProfileCompletionGuide
        show={showCompletionGuide}
        onClose={() => setShowCompletionGuide(false)}
      />
    </>
  );
};

// Wrapper component that provides the QueryClient
const App = ({ username, forceTab }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent username={username} forceTab={forceTab} />
    </QueryClientProvider>
  );
};

export default App;
