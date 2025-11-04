// Modern Employee Profile Page - Real Backend Integration

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
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

// Modern Profile Section Components
const ProfileSection = ({ title, icon: Icon, children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
  >
    <div className="p-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Icon className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const QuickLink = ({ title, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-orange-50 text-orange-600 border-l-4 border-orange-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`}
  >
    {title}
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
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
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
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors resize-none"
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
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
        />
        <button
          onClick={() => onRemove(index)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}
    <button
      onClick={onAdd}
      className="flex items-center space-x-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
    >
      <Plus className="w-4 h-4" />
      <span>{addButtonText}</span>
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
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : "bg-blue-500"
        } text-white`}
      >
        <div className="flex items-center space-x-2">
          {type === "success" && <CheckCircle className="w-5 h-5" />}
          {type === "error" && <AlertTriangle className="w-5 h-5" />}
          <span>{message}</span>
          <button onClick={onClose} className="ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
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
    { id: "unique-strengths", title: "Unique Strengths & Traits", icon: Star },
    { id: "key-achievements", title: "Key Achievements", icon: Award },
    { id: "professional-mission", title: "My Professional Mission", icon: Zap },
    { id: "key-skills", title: "Key Skills", icon: Code },
    { id: "experience", title: "Experience Details", icon: Briefcase },
    { id: "internship", title: "Internship Experience", icon: Building2 },
    { id: "education", title: "Education Qualification", icon: GraduationCap },
    { id: "technical", title: "Technical Qualification", icon: Code },
    { id: "projects", title: "Project Details", icon: BookOpen },
    { id: "research", title: "Research Details", icon: Brain },
    { id: "social-links", title: "Social Media Links", icon: Globe },
    { id: "personal", title: "Personal Details", icon: User },
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

      // Prepare data for API
      const updateData = {
        department: profileData.department,
        phone_number: profileData.mobileNo,
        location: profileData.location,
        current_salary: profileData.currentCTC,
        current_designation: profileData.designation,
        notice_period: profileData.noticePeriod,
        expected_salary: profileData.expectedCTC,
        bio: profileData.careerObjective,
        professional_mission: profileData.professionalMission,
        strengths: profileData.uniqueStrengths.join(", "),
        achievements: profileData.keyAchievements.join(", "),
        skills: profileData.keySkills.join(", "),
        github_url: profileData.socialLinks.github,
        linkedin_url: profileData.socialLinks.linkedin,
        twitter_url: profileData.socialLinks.twitter,
        website_url: profileData.socialLinks.portfolio,
        date_of_birth: profileData.personalDetails.dob,
        nationality: profileData.personalDetails.nationality,
        marital_status: profileData.personalDetails.maritalStatus,
        address: profileData.personalDetails.address,
      };

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

      if (!response.ok) {
        throw new Error(`Save failed: ${response.status}`);
      }

      setOriginalData(JSON.parse(JSON.stringify(profileData)));
      showNotification("Profile saved successfully!", "success");

      // Redirect back to dashboard after short delay
      setTimeout(() => {
        router.push(`/dashboard/employee/${username}`);
      }, 2000);
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

      case "social-links":
        return (
          <ProfileSection title="Social Media Links" icon={Globe}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="md:col-span-2">
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
            </div>
          </ProfileSection>
        );

      default:
        return (
          <ProfileSection title="Coming Soon" icon={Eye}>
            <div className="text-center py-12">
              <Eye className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Section Under Development
              </h3>
              <p className="text-gray-500">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Loading Profile
          </h3>
          <p className="text-gray-600">
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

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600 mt-1">
                Update your professional information and save changes
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Details Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Basic Details
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Quick Links Sidebar */}
          <div className="lg:col-span-1">
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
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">
                  Job Suggestions
                </h3>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 text-sm">
                    Job suggestions will appear here based on your profile
                  </p>
                  <button className="mt-4 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                    View All Jobs
                  </button>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">
                    Important Security Note
                  </h4>
                  <p className="text-red-800 text-sm">
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
