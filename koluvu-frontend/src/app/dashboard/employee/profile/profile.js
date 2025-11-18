// Modern Employee Profile Page - Responsive Design

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Award,
  Target,
  Star,
  Plus,
  Trash2,
  Edit3,
  Eye,
  AlertTriangle,
  CheckCircle,
  Loader,
  Building2,
  GraduationCap,
  Code,
  BookOpen,
  Github,
  Linkedin,
  Globe,
  Twitter,
  Heart,
  Brain,
  Lightbulb,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Menu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

// Modern Profile Section Components
const ProfileSection = ({ title, icon: Icon, children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
  >
    <div className="p-4 sm:p-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </div>
);

const QuickLink = ({ title, active, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-3 py-3 sm:px-4 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
      active
        ? "bg-orange-50 text-orange-600 border-l-4 border-orange-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`}
  >
    <Icon className="w-4 h-4 flex-shrink-0" />
    <span className="flex-1">{title}</span>
  </button>
);

const InputField = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors text-sm sm:text-base"
    />
  </div>
);

const TextAreaField = ({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none text-sm sm:text-base"
    />
  </div>
);

const ListManager = ({
  items,
  onAdd,
  onRemove,
  onUpdate,
  placeholder,
  addButtonText,
}) => (
  <div className="space-y-3">
    {items.map((item, index) => (
      <div key={index} className="flex items-center space-x-2">
        <input
          type="text"
          value={item}
          onChange={(e) => onUpdate(index, e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm sm:text-base"
        />
        <button
          onClick={() => onRemove(index)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}
    <button
      onClick={onAdd}
      className="flex items-center space-x-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors w-full justify-center sm:justify-start"
    >
      <Plus className="w-4 h-4" />
      <span className="text-sm">{addButtonText}</span>
    </button>
  </div>
);

const NotificationAlert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-4 right-4 left-4 sm:left-auto z-50 p-4 rounded-lg shadow-lg ${
          type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : "bg-blue-500"
        } text-white`}
      >
        <div className="flex items-center space-x-2">
          {type === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {type === "error" && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          <span className="flex-1 text-sm sm:text-base">{message}</span>
          <button onClick={onClose} className="ml-2 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const MobileSidebar = ({ isOpen, onClose, quickLinks, activeSection, setActiveSection }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-80 bg-white z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
              <button onClick={onClose} className="p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-1">
              {quickLinks.map((link) => (
                <QuickLink
                  key={link.id}
                  title={link.title}
                  active={activeSection === link.id}
                  onClick={() => {
                    setActiveSection(link.id);
                    onClose();
                  }}
                  icon={link.icon}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Profile = ({
  isDarkMode = false,
  initialEditMode = true,
  username,
  activeTabFromUrl,
}) => {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("career-objective");
  const [notification, setNotification] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    // Basic details
    department: "",
    mobileNo: "",
    location: "",
    currentCTC: "",
    designation: "",
    email: "",
    noticePeriod: "",
    expectedCTC: "",

    // Profile sections
    careerObjective: "",
    uniqueStrengths: [],
    keyAchievements: [],
    professionalMission: "",
    keySkills: [],
    experience: [],
    internship: [],
    education: [],
    technicalQualifications: [],
    projects: [],
    research: [],
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
      portfolio: "",
    },
    personalDetails: {
      dob: "",
      nationality: "",
      maritalStatus: "",
      address: "",
    },
  });

  const [originalData, setOriginalData] = useState(null);

  // Quick links configuration
  const quickLinks = [
    { id: "career-objective", title: "Career Objective", icon: Target },
    { id: "unique-strengths", title: "Unique Strengths", icon: Star },
    { id: "key-achievements", title: "Key Achievements", icon: Award },
    { id: "professional-mission", title: "Professional Mission", icon: Zap },
    { id: "key-skills", title: "Key Skills", icon: Code },
    { id: "experience", title: "Experience", icon: Briefcase },
    { id: "internship", title: "Internship", icon: Building2 },
    { id: "education", title: "Education", icon: GraduationCap },
    { id: "technical", title: "Technical", icon: Code },
    { id: "projects", title: "Projects", icon: BookOpen },
    { id: "research", title: "Research", icon: Brain },
    { id: "social-links", title: "Social Links", icon: Globe },
    { id: "personal", title: "Personal", icon: User },
  ];

  // Fetch profile data from backend
  useEffect(() => {
    fetchProfileData();
  }, [user, accessToken]);

  const fetchProfileData = async () => {
    if (!user || !accessToken) return;

    try {
      setLoading(true);

      // Fetch main profile data
      const profileResponse = await fetch(
        "http://127.0.0.1:8000/api/employee/dashboard/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!profileResponse.ok) {
        throw new Error(`Profile API error: ${profileResponse.status}`);
      }

      const profileApiData = await profileResponse.json();
      console.log("Profile API Data:", profileApiData);

      // Transform and set profile data
      const transformedData = {
        department: profileApiData.user?.department || "Not specified",
        mobileNo: profileApiData.user?.phone_number || "Not provided",
        location: profileApiData.user?.location || "Not specified",
        currentCTC: profileApiData.user?.current_salary || "Not specified",
        designation:
          profileApiData.user?.current_designation || "Not specified",
        email: profileApiData.user?.email || "Not provided",
        noticePeriod: profileApiData.user?.notice_period || "Immediate",
        expectedCTC: profileApiData.user?.expected_salary || "Not specified",
        careerObjective: profileApiData.user?.bio || "",
        professionalMission: profileApiData.user?.professional_mission || "",
        uniqueStrengths: profileApiData.user?.strengths
          ? profileApiData.user.strengths
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        keyAchievements: profileApiData.user?.achievements
          ? profileApiData.user.achievements
              .split(",")
              .map((a) => a.trim())
              .filter(Boolean)
          : [],
        keySkills: profileApiData.user?.skills
          ? profileApiData.user.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        socialLinks: {
          github: profileApiData.user?.github_url || "",
          linkedin: profileApiData.user?.linkedin_url || "",
          twitter: profileApiData.user?.twitter_url || "",
          portfolio: profileApiData.user?.website_url || "",
        },
        personalDetails: {
          dob: profileApiData.user?.date_of_birth || "",
          nationality: profileApiData.user?.nationality || "",
          maritalStatus: profileApiData.user?.marital_status || "",
          address: profileApiData.user?.address || "",
        },
        experience: [],
        internship: [],
        education: [],
        technicalQualifications: [],
        projects: [],
        research: [],
      };

      // Fetch additional profile sections
      await fetchAdditionalData(transformedData);

      setProfileData(transformedData);
      setOriginalData(JSON.parse(JSON.stringify(transformedData)));
    } catch (error) {
      console.error("Error fetching profile data:", error);
      showNotification("Failed to load profile data", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdditionalData = async (baseData) => {
    const endpoints = [
      { url: "education", key: "education" },
      { url: "experience", key: "experience" },
      { url: "skills", key: "keySkills" },
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/employee/${endpoint.url}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(`${endpoint.key} API response:`, data);

          // Handle different response formats
          let arrayData = [];
          if (Array.isArray(data)) {
            arrayData = data;
          } else if (data.results && Array.isArray(data.results)) {
            arrayData = data.results;
          } else if (data.data && Array.isArray(data.data)) {
            arrayData = data.data;
          }

          // Transform data based on endpoint
          if (endpoint.key === "education") {
            baseData.education = arrayData.map((item) => ({
              degree: item.degree || "",
              institution: item.institution || "",
              year: item.end_date || "",
              grade: item.grade || "",
            }));
          } else if (endpoint.key === "experience") {
            baseData.experience = arrayData.map((item) => ({
              company: item.company || "",
              title: item.title || "",
              startDate: item.start_date || "",
              endDate: item.end_date || "",
              description: item.description || "",
            }));
          } else if (endpoint.key === "keySkills") {
            if (arrayData.length > 0) {
              baseData.keySkills = arrayData.map(
                (skill) => skill.name || skill
              );
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching ${endpoint.key}:`, error);
      }
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Helper to convert placeholder text to empty values
      const sanitize = (v) => {
        if (typeof v === "string") {
          const trimmed = v.trim();
          if (trimmed === "Not specified" || trimmed === "Not provided") return "";
          // Keep 'Immediate' for noticePeriod as it's a valid semantic value
          return trimmed;
        }
        return v;
      };

      // Format date to YYYY-MM-DD expected by backend
      const formatDateForBackend = (val) => {
        if (!val) return "";
        if (typeof val !== "string") return "";
        const s = val.trim();
        if (!s) return "";

        // Already in YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

        // Common dd-mm-yyyy or dd/mm/yyyy -> convert
        const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (dmy) {
          const day = dmy[1].padStart(2, "0");
          const month = dmy[2].padStart(2, "0");
          const year = dmy[3];
          return `${year}-${month}-${day}`;
        }

        // Try Date parsing fallback
        const parsed = new Date(s);
        if (!isNaN(parsed.getTime())) {
          // Use local date components to avoid timezone shift issues
          const yyyy = parsed.getFullYear();
          const mm = String(parsed.getMonth() + 1).padStart(2, "0");
          const dd = String(parsed.getDate()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd}`;
        }

        // Not parseable - return empty so backend treats it as not provided
        return "";
      };

      // Prepare data for API (sanitize placeholder strings that some fields use)
      const dobFormatted = formatDateForBackend(
        sanitize(profileData.personalDetails.dob)
      );

      const updateData = {
        department: sanitize(profileData.department),
        phone_number: sanitize(profileData.mobileNo),
        location: sanitize(profileData.location),
        current_salary: sanitize(profileData.currentCTC),
        current_designation: sanitize(profileData.designation),
        notice_period: sanitize(profileData.noticePeriod),
        expected_salary: sanitize(profileData.expectedCTC),
        bio: sanitize(profileData.careerObjective),
        professional_mission: sanitize(profileData.professionalMission),
        strengths: profileData.uniqueStrengths.join(", "),
        achievements: profileData.keyAchievements.join(", "),
        skills: profileData.keySkills.join(", "),
        github_url: sanitize(profileData.socialLinks.github),
        linkedin_url: sanitize(profileData.socialLinks.linkedin),
        twitter_url: sanitize(profileData.socialLinks.twitter),
        website_url: sanitize(profileData.socialLinks.portfolio),
        nationality: sanitize(profileData.personalDetails.nationality),
        marital_status: sanitize(profileData.personalDetails.maritalStatus),
        address: sanitize(profileData.personalDetails.address),
      };

      // Only include date_of_birth if we have a valid formatted value
      if (dobFormatted) {
        updateData.date_of_birth = dobFormatted;
      }

      // Prefer using the backend URL from env when available; keep localhost as fallback
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ||
        "http://127.0.0.1:8000";

  // Debug: log payload being sent (exclude full tokens)
  console.log("Profile update payload:", updateData);

  const response = await fetch(`${backendUrl}/api/employee/profile/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        // Read raw body first to preserve content for logging
        let rawBody = "";
        try {
          rawBody = await response.text();
        } catch (e) {
          rawBody = "";
        }

        // Try to parse JSON from the raw body
        let errBody = null;
        try {
          errBody = rawBody ? JSON.parse(rawBody) : null;
        } catch (e) {
          errBody = null;
        }

        console.error(
          "Save failed response:",
          response.status,
          "raw:",
          rawBody,
          "parsed:",
          errBody
        );

        // Build a friendly details string. Prefer parsed object, else raw text.
        let detailsStr = "";
        if (errBody && typeof errBody === "object") {
          try {
            detailsStr = JSON.stringify(errBody);
          } catch (e) {
            detailsStr = String(errBody);
          }
        } else if (rawBody && rawBody.length > 0) {
          detailsStr = rawBody;
        }

        if (detailsStr) {
          showNotification(`Failed to save profile: ${detailsStr}`, "error");
        } else {
          showNotification(
            `Failed to save profile (status ${response.status}). Please try again.`,
            "error"
          );
        }

        return;
      }

      // Success - attempt to read response body for verification
      try {
        const text = await response.text();
        let parsed = null;
        try {
          parsed = text ? JSON.parse(text) : null;
        } catch (e) {
          parsed = null;
        }
        console.log("Profile update response:", response.status, "body:", parsed || text);
      } catch (e) {
        console.log("Profile update succeeded (no readable body)");
      }

      // Refresh the profile from backend to ensure UI shows persisted values
      try {
        await fetchProfileData();
      } catch (e) {
        console.warn("Failed to refetch profile after save:", e);
      }

      setOriginalData(JSON.parse(JSON.stringify(profileData)));
      showNotification("Profile saved successfully!", "success");

      // Redirect back to dashboard after short delay
      setTimeout(() => {
        router.push(`/dashboard/employee/${username}`);
      }, 1200);
    } catch (error) {
      console.error("Error saving profile:", error);
      showNotification("Failed to save profile. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setProfileData(JSON.parse(JSON.stringify(originalData)));
    }
    router.push(`/dashboard/employee/${username}`);
  };

  const updateProfileData = (key, value) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  };

  const updateNestedData = (section, key, value) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const updateListData = (key, newItems) => {
    setProfileData((prev) => ({ ...prev, [key]: newItems }));
  };

  const addListItem = (key, defaultValue = "") => {
    updateListData(key, [...profileData[key], defaultValue]);
  };

  const removeListItem = (key, index) => {
    const newItems = profileData[key].filter((_, i) => i !== index);
    updateListData(key, newItems);
  };

  const updateListItem = (key, index, value) => {
    const newItems = [...profileData[key]];
    newItems[index] = value;
    updateListData(key, newItems);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "career-objective":
        return (
          <ProfileSection title="Career Objective" icon={Target}>
            <TextAreaField
              label="Career Objective"
              value={profileData.careerObjective}
              onChange={(value) => updateProfileData("careerObjective", value)}
              placeholder="Software professional with expertise in technology solutions..."
              rows={4}
            />
          </ProfileSection>
        );

      case "unique-strengths":
        return (
          <ProfileSection title="Unique Strengths & Traits" icon={Star}>
            <ListManager
              items={profileData.uniqueStrengths}
              onAdd={() => addListItem("uniqueStrengths")}
              onRemove={(index) => removeListItem("uniqueStrengths", index)}
              onUpdate={(index, value) =>
                updateListItem("uniqueStrengths", index, value)
              }
              placeholder="Problem-solving mindset with creative solutions"
              addButtonText="Add Strength"
            />
          </ProfileSection>
        );

      case "key-achievements":
        return (
          <ProfileSection title="Key Achievements" icon={Award}>
            <ListManager
              items={profileData.keyAchievements}
              onAdd={() => addListItem("keyAchievements")}
              onRemove={(index) => removeListItem("keyAchievements", index)}
              onUpdate={(index, value) =>
                updateListItem("keyAchievements", index, value)
              }
              placeholder="Led a team of 5 developers to deliver a project 2 weeks ahead of schedule..."
              addButtonText="Add Achievement"
            />
          </ProfileSection>
        );

      case "professional-mission":
        return (
          <ProfileSection title="My Professional Mission" icon={Zap}>
            <TextAreaField
              label="Professional Mission"
              value={profileData.professionalMission}
              onChange={(value) =>
                updateProfileData("professionalMission", value)
              }
              placeholder="To leverage technology and innovation to create meaningful solutions that positively impact businesses and communities while continuously growing as a professional and leader..."
              rows={6}
            />
          </ProfileSection>
        );

      case "key-skills":
        return (
          <ProfileSection title="Key Skills" icon={Code}>
            <ListManager
              items={profileData.keySkills}
              onAdd={() => addListItem("keySkills")}
              onRemove={(index) => removeListItem("keySkills", index)}
              onUpdate={(index, value) =>
                updateListItem("keySkills", index, value)
              }
              placeholder="React.js, Node.js, Python, AWS..."
              addButtonText="Add Skill"
            />
          </ProfileSection>
        );

      case "experience":
        return (
          <ProfileSection title="Experience" icon={Briefcase}>
            {profileData.experience.map((exp, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded-lg bg-gray-50">
                <InputField
                  label="Company"
                  value={exp.company}
                  onChange={(value) => {
                    const updated = [...profileData.experience];
                    updated[idx].company = value;
                    updateListData("experience", updated);
                  }}
                  placeholder="Company Name"
                />
                <InputField
                  label="Title"
                  value={exp.title}
                  onChange={(value) => {
                    const updated = [...profileData.experience];
                    updated[idx].title = value;
                    updateListData("experience", updated);
                  }}
                  placeholder="Job Title"
                />
                <InputField
                  label="Start Date"
                  value={exp.startDate}
                  onChange={(value) => {
                    const updated = [...profileData.experience];
                    updated[idx].startDate = value;
                    updateListData("experience", updated);
                  }}
                  type="date"
                />
                <InputField
                  label="End Date"
                  value={exp.endDate}
                  onChange={(value) => {
                    const updated = [...profileData.experience];
                    updated[idx].endDate = value;
                    updateListData("experience", updated);
                  }}
                  type="date"
                />
                <TextAreaField
                  label="Description"
                  value={exp.description}
                  onChange={(value) => {
                    const updated = [...profileData.experience];
                    updated[idx].description = value;
                    updateListData("experience", updated);
                  }}
                  placeholder="Describe your role and achievements..."
                  rows={3}
                />
                <button
                  onClick={() => removeListItem("experience", idx)}
                  className="mt-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove Experience
                </button>
              </div>
            ))}
            <button
              onClick={() => addListItem("experience", { company: "", title: "", startDate: "", endDate: "", description: "" })}
              className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg w-full"
            >
              Add Experience
            </button>
          </ProfileSection>
        );

      case "internship":
        return (
          <ProfileSection title="Internship" icon={Building2}>
            {profileData.internship.map((intern, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded-lg bg-gray-50">
                <InputField
                  label="Company"
                  value={intern.company || ""}
                  onChange={(value) => {
                    const updated = [...profileData.internship];
                    updated[idx].company = value;
                    updateListData("internship", updated);
                  }}
                  placeholder="Company Name"
                />
                <InputField
                  label="Role"
                  value={intern.role || ""}
                  onChange={(value) => {
                    const updated = [...profileData.internship];
                    updated[idx].role = value;
                    updateListData("internship", updated);
                  }}
                  placeholder="Internship Role"
                />
                <InputField
                  label="Start Date"
                  value={intern.startDate || ""}
                  onChange={(value) => {
                    const updated = [...profileData.internship];
                    updated[idx].startDate = value;
                    updateListData("internship", updated);
                  }}
                  type="date"
                />
                <InputField
                  label="End Date"
                  value={intern.endDate || ""}
                  onChange={(value) => {
                    const updated = [...profileData.internship];
                    updated[idx].endDate = value;
                    updateListData("internship", updated);
                  }}
                  type="date"
                />
                <TextAreaField
                  label="Description"
                  value={intern.description || ""}
                  onChange={(value) => {
                    const updated = [...profileData.internship];
                    updated[idx].description = value;
                    updateListData("internship", updated);
                  }}
                  placeholder="Describe your internship experience..."
                  rows={3}
                />
                <button
                  onClick={() => removeListItem("internship", idx)}
                  className="mt-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove Internship
                </button>
              </div>
            ))}
            <button
              onClick={() => addListItem("internship", { company: "", role: "", startDate: "", endDate: "", description: "" })}
              className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg w-full"
            >
              Add Internship
            </button>
          </ProfileSection>
        );

      case "education":
        return (
          <ProfileSection title="Education" icon={GraduationCap}>
            {profileData.education.map((edu, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded-lg bg-gray-50">
                <InputField
                  label="Degree"
                  value={edu.degree}
                  onChange={(value) => {
                    const updated = [...profileData.education];
                    updated[idx].degree = value;
                    updateListData("education", updated);
                  }}
                  placeholder="Degree Name"
                />
                <InputField
                  label="Institution"
                  value={edu.institution}
                  onChange={(value) => {
                    const updated = [...profileData.education];
                    updated[idx].institution = value;
                    updateListData("education", updated);
                  }}
                  placeholder="Institution Name"
                />
                <InputField
                  label="Year"
                  value={edu.year}
                  onChange={(value) => {
                    const updated = [...profileData.education];
                    updated[idx].year = value;
                    updateListData("education", updated);
                  }}
                  placeholder="Year of Completion"
                  type="text"
                />
                <InputField
                  label="Grade"
                  value={edu.grade}
                  onChange={(value) => {
                    const updated = [...profileData.education];
                    updated[idx].grade = value;
                    updateListData("education", updated);
                  }}
                  placeholder="Grade/Percentage"
                />
                <button
                  onClick={() => removeListItem("education", idx)}
                  className="mt-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove Education
                </button>
              </div>
            ))}
            <button
              onClick={() => addListItem("education", { degree: "", institution: "", year: "", grade: "" })}
              className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg w-full"
            >
              Add Education
            </button>
          </ProfileSection>
        );

      case "technical":
        return (
          <ProfileSection title="Technical Qualifications" icon={Code}>
            {profileData.technicalQualifications.map((tech, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded-lg bg-gray-50">
                <InputField
                  label="Certification/Skill"
                  value={tech.name || ""}
                  onChange={(value) => {
                    const updated = [...profileData.technicalQualifications];
                    updated[idx].name = value;
                    updateListData("technicalQualifications", updated);
                  }}
                  placeholder="Certification or Skill Name"
                />
                <InputField
                  label="Details"
                  value={tech.details || ""}
                  onChange={(value) => {
                    const updated = [...profileData.technicalQualifications];
                    updated[idx].details = value;
                    updateListData("technicalQualifications", updated);
                  }}
                  placeholder="Details about the certification or skill"
                />
                <button
                  onClick={() => removeListItem("technicalQualifications", idx)}
                  className="mt-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove Technical Qualification
                </button>
              </div>
            ))}
            <button
              onClick={() => addListItem("technicalQualifications", { name: "", details: "" })}
              className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg w-full"
            >
              Add Technical Qualification
            </button>
          </ProfileSection>
        );

      case "projects":
        return (
          <ProfileSection title="Projects" icon={BookOpen}>
            {profileData.projects.map((proj, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded-lg bg-gray-50">
                <InputField
                  label="Project Title"
                  value={proj.title || ""}
                  onChange={(value) => {
                    const updated = [...profileData.projects];
                    updated[idx].title = value;
                    updateListData("projects", updated);
                  }}
                  placeholder="Project Title"
                />
                <InputField
                  label="Year"
                  value={proj.year || ""}
                  onChange={(value) => {
                    const updated = [...profileData.projects];
                    updated[idx].year = value;
                    updateListData("projects", updated);
                  }}
                  placeholder="Year"
                  type="text"
                />
                <TextAreaField
                  label="Description"
                  value={proj.description || ""}
                  onChange={(value) => {
                    const updated = [...profileData.projects];
                    updated[idx].description = value;
                    updateListData("projects", updated);
                  }}
                  placeholder="Describe the project..."
                  rows={3}
                />
                <button
                  onClick={() => removeListItem("projects", idx)}
                  className="mt-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove Project
                </button>
              </div>
            ))}
            <button
              onClick={() => addListItem("projects", { title: "", year: "", description: "" })}
              className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg w-full"
            >
              Add Project
            </button>
          </ProfileSection>
        );

      case "research":
        return (
          <ProfileSection title="Research" icon={Brain}>
            {profileData.research.map((res, idx) => (
              <div key={idx} className="mb-4 p-4 border rounded-lg bg-gray-50">
                <InputField
                  label="Research Title"
                  value={res.title || ""}
                  onChange={(value) => {
                    const updated = [...profileData.research];
                    updated[idx].title = value;
                    updateListData("research", updated);
                  }}
                  placeholder="Research Title"
                />
                <InputField
                  label="Year"
                  value={res.year || ""}
                  onChange={(value) => {
                    const updated = [...profileData.research];
                    updated[idx].year = value;
                    updateListData("research", updated);
                  }}
                  placeholder="Year"
                  type="text"
                />
                <TextAreaField
                  label="Description"
                  value={res.description || ""}
                  onChange={(value) => {
                    const updated = [...profileData.research];
                    updated[idx].description = value;
                    updateListData("research", updated);
                  }}
                  placeholder="Describe the research..."
                  rows={3}
                />
                <button
                  onClick={() => removeListItem("research", idx)}
                  className="mt-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove Research
                </button>
              </div>
            ))}
            <button
              onClick={() => addListItem("research", { title: "", year: "", description: "" })}
              className="px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg w-full"
            >
              Add Research
            </button>
          </ProfileSection>
        );

      case "social-links":
        return (
          <ProfileSection title="Social Media Links" icon={Globe}>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <InputField
                label="GitHub Profile"
                value={profileData.socialLinks.github}
                onChange={(value) =>
                  updateNestedData("socialLinks", "github", value)
                }
                placeholder="https://github.com/username"
              />
              <InputField
                label="LinkedIn Profile"
                value={profileData.socialLinks.linkedin}
                onChange={(value) =>
                  updateNestedData("socialLinks", "linkedin", value)
                }
                placeholder="https://linkedin.com/in/username"
              />
              <InputField
                label="Twitter Profile"
                value={profileData.socialLinks.twitter}
                onChange={(value) =>
                  updateNestedData("socialLinks", "twitter", value)
                }
                placeholder="https://twitter.com/username"
              />
              <InputField
                label="Portfolio Website"
                value={profileData.socialLinks.portfolio}
                onChange={(value) =>
                  updateNestedData("socialLinks", "portfolio", value)
                }
                placeholder="https://yourportfolio.com"
              />
            </div>
          </ProfileSection>
        );

      case "personal":
        return (
          <ProfileSection title="Personal Details" icon={User}>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <InputField
                label="Date of Birth"
                type="date"
                value={profileData.personalDetails.dob}
                onChange={(value) =>
                  updateNestedData("personalDetails", "dob", value)
                }
              />
              <InputField
                label="Nationality"
                value={profileData.personalDetails.nationality}
                onChange={(value) =>
                  updateNestedData("personalDetails", "nationality", value)
                }
                placeholder="Indian"
              />
              <InputField
                label="Marital Status"
                value={profileData.personalDetails.maritalStatus}
                onChange={(value) =>
                  updateNestedData("personalDetails", "maritalStatus", value)
                }
                placeholder="Single/Married"
              />
              <TextAreaField
                label="Address"
                value={profileData.personalDetails.address}
                onChange={(value) =>
                  updateNestedData("personalDetails", "address", value)
                }
                placeholder="Full address..."
                rows={3}
              />
            </div>
          </ProfileSection>
        );

      default:
        return (
          <ProfileSection title="Coming Soon" icon={Eye}>
            <div className="text-center py-8 sm:py-12">
              <Eye className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                Section Under Development
              </h3>
              <p className="text-gray-500 text-sm sm:text-base">
                This section is currently being developed and will be available
                soon.
              </p>
            </div>
          </ProfileSection>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader className="w-8 h-8 sm:w-12 sm:h-12 animate-spin text-orange-600 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            Loading Profile
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            Fetching your professional information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notifications */}
      {notification && (
        <NotificationAlert
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        quickLinks={quickLinks}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4">
            {/* Title and Mobile Menu */}
            <div className="flex items-center justify-between sm:justify-start">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Edit Profile</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Update your professional information
                </p>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 lg:hidden border border-gray-300 rounded-lg text-gray-700"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm sm:text-base flex-1 sm:flex-none justify-center"
              >
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Details Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Basic Details
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <InputField
                label="Department"
                value={profileData.department}
                onChange={(value) => updateProfileData("department", value)}
                placeholder="Not specified"
              />
              <InputField
                label="Mobile Number"
                value={profileData.mobileNo}
                onChange={(value) => updateProfileData("mobileNo", value)}
                placeholder="Not provided"
                type="tel"
              />
              <InputField
                label="Location"
                value={profileData.location}
                onChange={(value) => updateProfileData("location", value)}
                placeholder="Not specified"
              />
              <InputField
                label="Current CTC"
                value={profileData.currentCTC}
                onChange={(value) => updateProfileData("currentCTC", value)}
                placeholder="Not specified"
              />
              <InputField
                label="Designation"
                value={profileData.designation}
                onChange={(value) => updateProfileData("designation", value)}
                placeholder="Not specified"
                required
              />
              <InputField
                label="Email"
                value={profileData.email}
                onChange={(value) => updateProfileData("email", value)}
                placeholder="Not provided"
                type="email"
              />
              <InputField
                label="Notice Period"
                value={profileData.noticePeriod}
                onChange={(value) => updateProfileData("noticePeriod", value)}
                placeholder="Immediate"
              />
              <InputField
                label="Expected CTC"
                value={profileData.expectedCTC}
                onChange={(value) => updateProfileData("expectedCTC", value)}
                placeholder="Not specified"
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Quick Links Sidebar - Hidden on mobile, shown with menu button */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-32">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Links
                </h3>
              </div>
              <div className="p-4 space-y-1">
                {quickLinks.map((link) => (
                  <QuickLink
                    key={link.id}
                    title={link.title}
                    active={activeSection === link.id}
                    onClick={() => setActiveSection(link.id)}
                    icon={link.icon}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Main Profile Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderSection()}
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Job Suggestions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 sm:p-6 border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Job Suggestions
                </h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="text-center py-6 sm:py-8">
                  <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 text-sm sm:text-base">
                    Job suggestions will appear here based on your profile
                  </p>
                  <button className="mt-4 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors text-sm sm:text-base">
                    View All Jobs
                  </button>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-2 text-sm sm:text-base">
                    Important Security Note
                  </h4>
                  <p className="text-red-800 text-xs sm:text-sm">
                    Client-side JavaScript protection for screenshotting and
                    content downloading is limited. For robust and foolproof
                    protection, server-side measures and digital rights
                    management solutions are recommended.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;