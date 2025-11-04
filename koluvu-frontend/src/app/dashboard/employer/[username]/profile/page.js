// src/app/dashboard/employer/[username]/profile/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployerProfile } from "@/hooks/useEmployerProfile";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Briefcase,
  Camera,
  Save,
  Loader,
  AlertCircle,
  CheckCircle,
  Edit3,
  X,
  Linkedin,
  Github,
  Twitter,
  Facebook,
  Instagram,
  User,
} from "lucide-react";

const EmployerProfile = () => {
  const { user, accessToken } = useAuth();
  const { refetch: refreshGlobalProfile } = useEmployerProfile();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false);

  // Get username from URL params
  const urlUsername = params?.username;

  // Get current user's username
  const getCurrentUsername = () => {
    if (user?.username) return user.username;
    if (user?.email) return user.email.split("@")[0];
    return null;
  };

  const [formData, setFormData] = useState({
    company_name: "",
    employer_name: "",
    contact_person: "",
    designation: "",
    email: "",
    phone: "",
    company_location: "",
    website: "",
    industry_type: "",
    company_size: "",
    total_employees: "",
    bio: "",
    employer_introduction: "",
    linkedin_profile_url: "",
    github_profile_url: "",
    twitter_profile_url: "",
    facebook_profile_url: "",
    instagram_profile_url: "",
  });

  // Check if current user can edit this profile
  const canEdit = () => {
    const currentUsername = getCurrentUsername();
    return currentUsername === urlUsername;
  };

  useEffect(() => {
    if (!urlUsername) {
      // Redirect to user's own profile if no username in URL
      const currentUsername = getCurrentUsername();
      if (currentUsername) {
        router.replace(`/dashboard/employer/${currentUsername}/profile`);
      }
      return;
    }

    if (accessToken) {
      fetchProfileData();
    } else {
      setLoading(false);
      setMessage({
        type: "error",
        text: "Authentication required. Please log in again.",
      });
    }
  }, [accessToken, urlUsername, router]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      console.log(
        "Fetching profile data for username:",
        urlUsername,
        "with token:",
        accessToken ? "Present" : "Missing"
      );

      const response = await fetch(`/api/employer/${urlUsername}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Profile fetch response status:", response.status);

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          console.warn("Failed to parse error response as JSON");
        }

        console.error("Profile fetch error:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });

        if (response.status === 403) {
          throw new Error("You don't have permission to view this profile");
        } else if (response.status === 404) {
          throw new Error("Profile not found");
        }

        throw new Error(
          errorData.error || `Failed to fetch profile (${response.status})`
        );
      }

      const data = await response.json();
      setProfileData(data);

      // Populate form data
      setFormData({
        company_name: data.company_name || "",
        employer_name: data.employer_name || "",
        contact_person: data.contact_person || "",
        designation: data.designation || "",
        email: data.user?.email || data.email || "",
        phone: data.phone || "",
        company_location: data.company_location || "",
        website: data.website || "",
        industry_type: data.industry_type || "",
        company_size: data.company_size || "",
        total_employees: data.total_employees || "",
        bio: data.bio || "",
        employer_introduction: data.employer_introduction || "",
        linkedin_profile_url: data.linkedin_profile_url || "",
        github_profile_url: data.github_profile_url || "",
        twitter_profile_url: data.twitter_profile_url || "",
        facebook_profile_url: data.facebook_profile_url || "",
        instagram_profile_url: data.instagram_profile_url || "",
      });

      // If this is user's own profile and company_name or employer_name is missing/incomplete, auto-enable editing
      if (
        canEdit() &&
        (!data.company_name ||
          !data.employer_name ||
          data.company_name.length <= 2 ||
          data.employer_name.length <= 2)
      ) {
        setIsEditing(true);
        setMessage({
          type: "warning",
          text: "Please complete your company and employer information",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to load profile data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!canEdit()) {
      setMessage({
        type: "error",
        text: "You don't have permission to edit this profile",
      });
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      // Validate required fields
      if (!formData.company_name || !formData.employer_name) {
        setMessage({
          type: "error",
          text: "Company name and employer name are required",
        });
        return;
      }

      const changedData = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== (profileData?.[key] || "")) {
          changedData[key] = formData[key];
        }
      });

      const response = await fetch(
        `/api/employer/${urlUsername}/profile/update`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(changedData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const data = await response.json();
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);

      // Refresh profile data
      await fetchProfileData();

      // Update user context with new data
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    if (!canEdit()) {
      setMessage({
        type: "error",
        text: "You don't have permission to upload images to this profile",
      });
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 5MB" });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload an image file" });
      return;
    }

    // Show uploading state
    setUploadingLogo(true);
    setMessage({ type: "info", text: "Uploading company logo..." });

    try {
      // Create a local preview URL for immediate feedback
      const previewUrl = URL.createObjectURL(file);

      // Temporarily update the form data to show the new image immediately
      setFormData((prev) => ({
        ...prev,
        company_logo: previewUrl,
      }));

      const formDataUpload = new FormData();
      formDataUpload.append("company_logo", file);

      const uploadUrl = `/api/employer/${urlUsername}/profile/upload-logo`;

      console.log("Uploading company logo to:", uploadUrl);

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formDataUpload,
      });

      // Clean up the preview URL
      URL.revokeObjectURL(previewUrl);

      if (!response.ok) {
        console.error("Upload failed with status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(
            `Failed to upload company logo (${
              response.status
            }): ${errorText.slice(0, 100)}`
          );
        }
        throw new Error(errorData.error || "Failed to upload company logo");
      }

      const data = await response.json();
      console.log("Company logo upload successful:", data);

      setMessage({
        type: "success",
        text: "Company logo updated successfully!",
      });

      // Force refresh of profile data to get the actual uploaded image URL
      setTimeout(async () => {
        await fetchProfileData();
        // Also refresh global profile for header/sidebar updates
        await refreshGlobalProfile();
        setMessage(null);
        setUploadingLogo(false);
      }, 1500);
    } catch (error) {
      console.error("Error uploading company logo:", error);
      setMessage({ type: "error", text: error.message });

      // Revert to original logo on error
      await fetchProfileData();
      setUploadingLogo(false);
    }

    // Reset file input
    e.target.value = "";
  };

  const handleProfilePictureUpload = async (e) => {
    if (!canEdit()) {
      setMessage({
        type: "error",
        text: "You don't have permission to upload images to this profile",
      });
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 5MB" });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please upload an image file" });
      return;
    }

    // Show uploading state
    setUploadingProfilePicture(true);
    setMessage({ type: "info", text: "Uploading profile picture..." });

    try {
      // Create a local preview URL for immediate feedback
      const previewUrl = URL.createObjectURL(file);

      // Temporarily update the form data to show the new image immediately
      setFormData((prev) => ({
        ...prev,
        profile_picture: previewUrl,
      }));

      const formDataUpload = new FormData();
      formDataUpload.append("profile_picture", file);

      const uploadUrl = `/api/employer/${urlUsername}/profile/upload-picture`;

      console.log("Uploading profile picture to:", uploadUrl);

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formDataUpload,
      });

      // Clean up the preview URL
      URL.revokeObjectURL(previewUrl);

      if (!response.ok) {
        console.error(
          "Profile picture upload failed with status:",
          response.status
        );
        const errorText = await response.text();
        console.error("Error response:", errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(
            `Failed to upload profile picture (${
              response.status
            }): ${errorText.slice(0, 100)}`
          );
        }
        throw new Error(errorData.error || "Failed to upload profile picture");
      }

      const data = await response.json();
      console.log("Profile picture upload successful:", data);

      setMessage({
        type: "success",
        text: "Profile picture updated successfully!",
      });

      // Force refresh of profile data to get the actual uploaded image URL
      setTimeout(async () => {
        await fetchProfileData();
        // Also refresh global profile for header/sidebar updates
        await refreshGlobalProfile();
        setMessage(null);
        setUploadingProfilePicture(false);
      }, 1500);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setMessage({ type: "error", text: error.message });

      // Revert to original picture on error
      await fetchProfileData();
      setUploadingProfilePicture(false);
    }

    // Reset file input
    e.target.value = "";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  // If we have an authentication error and no profile data, show error
  if (!loading && !profileData && message?.type === "error") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">
                  Unable to Load Profile
                </h3>
                <p className="text-red-800 mt-1">{message.text}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = () => {
    const companyName = formData.company_name || "";
    return companyName.substring(0, 2).toUpperCase();
  };

  const getCompanyLogo = () => {
    if (profileData?.company_logo_url) {
      return profileData.company_logo_url;
    }
    if (profileData?.company_logo) {
      // If it's a Django media file, prepend the backend URL and /media/ prefix
      if (profileData.company_logo.startsWith("/media/")) {
        return `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }${profileData.company_logo}`;
      } else if (!profileData.company_logo.startsWith("http")) {
        // If it's a relative path, add /media/ prefix and backend URL
        return `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/media/${profileData.company_logo}`;
      }
      return profileData.company_logo;
    }
    return null;
  };

  const getProfilePicture = () => {
    if (profileData?.profile_picture_url && !profileData?.profile_picture) {
      // Use Google profile picture if available and no custom picture uploaded
      return profileData.profile_picture_url;
    }
    if (profileData?.profile_picture) {
      // If it's a Django media file, prepend the backend URL and /media/ prefix
      if (profileData.profile_picture.startsWith("/media/")) {
        return `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }${profileData.profile_picture}`;
      } else if (!profileData.profile_picture.startsWith("http")) {
        // If it's a relative path, add /media/ prefix and backend URL
        return `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000"
        }/media/${profileData.profile_picture}`;
      }
      return profileData.profile_picture;
    }
    if (profileData?.profile_picture_url) {
      return profileData.profile_picture_url;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {canEdit()
                ? "Company Profile"
                : `${formData.company_name || urlUsername}'s Profile`}
            </h1>
            <p className="text-gray-600 mt-1">
              {canEdit()
                ? "Manage your company information and preferences"
                : `Viewing ${
                    formData.employer_name || urlUsername
                  }'s company profile`}
            </p>
          </div>
          {canEdit() && !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : canEdit() && isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchProfileData();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          ) : null}
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : message.type === "error"
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-yellow-50 text-yellow-800 border border-yellow-200"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        {/* Logo & Profile Picture Section - Two Column Layout */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Logo & Profile Picture
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Company Logo */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Company Logo
              </h3>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-40 h-40 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    {getCompanyLogo() ? (
                      <img
                        src={getCompanyLogo()}
                        alt="Company Logo"
                        className="w-full h-full object-cover"
                        key={`logo-${Date.now()}`}
                      />
                    ) : (
                      <span className="text-5xl font-bold text-white">
                        {getInitials() || "?"}
                      </span>
                    )}
                  </div>
                  {canEdit() && isEditing && (
                    <label
                      htmlFor="logo-upload"
                      className={`absolute bottom-0 right-0 p-3 text-white rounded-full cursor-pointer transition-colors shadow-lg ${
                        uploadingLogo
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {uploadingLogo ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-gray-900 font-medium text-lg">
                    {formData.company_name || "Company Name"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {formData.industry_type || "Industry Type"}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Square format recommended for best display
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Picture */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Profile Picture
              </h3>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg">
                    {getProfilePicture() ? (
                      <img
                        src={getProfilePicture()}
                        alt="Profile Picture"
                        className="w-full h-full object-cover"
                        key={`profile-${Date.now()}`}
                      />
                    ) : (
                      <span className="text-5xl font-bold text-white">
                        {formData.employer_name
                          ? formData.employer_name.charAt(0).toUpperCase()
                          : urlUsername?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                  {canEdit() && isEditing && (
                    <label
                      htmlFor="profile-picture-upload"
                      className={`absolute bottom-0 right-0 p-3 text-white rounded-full cursor-pointer transition-colors shadow-lg ${
                        uploadingProfilePicture
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {uploadingProfilePicture ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                      <input
                        id="profile-picture-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        disabled={uploadingProfilePicture}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-gray-900 font-medium text-lg">
                    {formData.employer_name || urlUsername}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {formData.designation || "Designation"}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Appears in sidebar, header, and profile pages
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Profile Completion
              </span>
              <span className="text-sm text-gray-600">
                {profileData?.profile_completion_percentage || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${profileData?.profile_completion_percentage || 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Company Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              {canEdit() && isEditing ? (
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter company name"
                  required
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-900">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {formData.company_name || "Not specified"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employer Name <span className="text-red-500">*</span>
              </label>
              {canEdit() && isEditing ? (
                <input
                  type="text"
                  name="employer_name"
                  value={formData.employer_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter employer name"
                  required
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-900">
                  <User className="w-4 h-4 text-gray-400" />
                  {formData.employer_name || "Not specified"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              {canEdit() && isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-900">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {profileData?.user?.email || user?.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              {canEdit() && isEditing ? (
                <input
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contact person name"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-900">
                  <User className="w-4 h-4 text-gray-400" />
                  {formData.contact_person || "Not specified"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              {canEdit() && isEditing ? (
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your designation"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-900">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  {formData.designation || "Not specified"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {canEdit() && isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 234 567 8900"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-900">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {formData.phone || "Not specified"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Location
              </label>
              {canEdit() && isEditing ? (
                <input
                  type="text"
                  name="company_location"
                  value={formData.company_location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="City, Country"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-900">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {formData.company_location || "Not specified"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              {canEdit() && isEditing ? (
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://company.com"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-900">
                  <Globe className="w-4 h-4 text-gray-400" />
                  {formData.website ? (
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {formData.website}
                    </a>
                  ) : (
                    "Not specified"
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry Type
              </label>
              {canEdit() && isEditing ? (
                <select
                  name="industry_type"
                  value={formData.industry_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className="flex items-center gap-2 text-gray-900">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  {formData.industry_type || "Not specified"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size
              </label>
              {canEdit() && isEditing ? (
                <select
                  name="company_size"
                  value={formData.company_size}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              ) : (
                <div className="flex items-center gap-2 text-gray-900">
                  <Users className="w-4 h-4 text-gray-400" />
                  {formData.company_size || "Not specified"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Employees
              </label>
              {canEdit() && isEditing ? (
                <input
                  type="number"
                  name="total_employees"
                  value={formData.total_employees}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Number of employees"
                />
              ) : (
                <div className="flex items-center gap-2 text-gray-900">
                  <Users className="w-4 h-4 text-gray-400" />
                  {formData.total_employees || "Not specified"}
                </div>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Bio
            </label>
            {canEdit() && isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tell us about your company..."
              />
            ) : (
              <p className="text-gray-900">
                {formData.bio || "No bio provided yet"}
              </p>
            )}
          </div>

          {/* Employer Introduction */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employer Introduction
            </label>
            {canEdit() && isEditing ? (
              <textarea
                name="employer_introduction"
                value={formData.employer_introduction}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Brief introduction about yourself..."
              />
            ) : (
              <p className="text-gray-900">
                {formData.employer_introduction ||
                  "No introduction provided yet"}
              </p>
            )}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Social Media Links
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile
              </label>
              {canEdit() && isEditing ? (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <input
                    type="url"
                    name="linkedin_profile_url"
                    value={formData.linkedin_profile_url}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  {formData.linkedin_profile_url ? (
                    <a
                      href={formData.linkedin_profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {formData.linkedin_profile_url}
                    </a>
                  ) : (
                    <span className="text-gray-500">Not specified</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Profile
              </label>
              {canEdit() && isEditing ? (
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-gray-900 flex-shrink-0" />
                  <input
                    type="url"
                    name="github_profile_url"
                    value={formData.github_profile_url}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/yourcompany"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-gray-900" />
                  {formData.github_profile_url ? (
                    <a
                      href={formData.github_profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {formData.github_profile_url}
                    </a>
                  ) : (
                    <span className="text-gray-500">Not specified</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter Profile
              </label>
              {canEdit() && isEditing ? (
                <div className="flex items-center gap-2">
                  <Twitter className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <input
                    type="url"
                    name="twitter_profile_url"
                    value={formData.twitter_profile_url}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://twitter.com/yourcompany"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  {formData.twitter_profile_url ? (
                    <a
                      href={formData.twitter_profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {formData.twitter_profile_url}
                    </a>
                  ) : (
                    <span className="text-gray-500">Not specified</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook Page
              </label>
              {canEdit() && isEditing ? (
                <div className="flex items-center gap-2">
                  <Facebook className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <input
                    type="url"
                    name="facebook_profile_url"
                    value={formData.facebook_profile_url}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://facebook.com/yourcompany"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Facebook className="w-5 h-5 text-blue-600" />
                  {formData.facebook_profile_url ? (
                    <a
                      href={formData.facebook_profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {formData.facebook_profile_url}
                    </a>
                  ) : (
                    <span className="text-gray-500">Not specified</span>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Profile
              </label>
              {canEdit() && isEditing ? (
                <div className="flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-pink-600 flex-shrink-0" />
                  <input
                    type="url"
                    name="instagram_profile_url"
                    value={formData.instagram_profile_url}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://instagram.com/yourcompany"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Instagram className="w-5 h-5 text-pink-600" />
                  {formData.instagram_profile_url ? (
                    <a
                      href={formData.instagram_profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {formData.instagram_profile_url}
                    </a>
                  ) : (
                    <span className="text-gray-500">Not specified</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile;
