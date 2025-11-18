"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBuilding,
  faPhone,
  faMapMarkerAlt,
  faGlobe,
  faCertificate,
  faStar,
  faUpload,
  faCheck,
  faExclamationTriangle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

const ProfileSetupPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    organization_name: "",
    contact_person: "",
    phone: "",
    address: "",
    website: "",
    certification_number: "",
    specialization: "",
    logo: null,
    logoPreview: null,
    // Additional fields for enhanced profile
    qualifications: "",
    experience_years: "",
    founded_year: "",
    team_size: "",
    description: "",
    linkedin_url: "",
    facebook_url: "",
    twitter_url: "",
    youtube_url: "",
  });
  const [errors, setErrors] = useState({});

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const backendBase =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const token = localStorage.getItem("access_token");

      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${backendBase}/api/training/profile/`, {
        method: "GET",
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData((prev) => ({
          ...prev,
          organization_name: data.organization_name || "",
          contact_person: data.contact_person || "",
          phone: data.phone || "",
          address: data.address || "",
          website: data.website || "",
          certification_number: data.certification_number || "",
          specialization: data.specialization || "",
          description: data.description || "",
          qualifications: data.qualifications || "",
          experience_years: data.experience_years || "",
          founded_year: data.founded_year || "",
          team_size: data.team_size || "",
          linkedin_url: data.linkedin_url || "",
          facebook_url: data.facebook_url || "",
          twitter_url: data.twitter_url || "",
          youtube_url: data.youtube_url || "",
        }));
      } else if (response.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access your profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Profile might not exist yet, which is fine
      toast({
        title: "Note",
        description: "Starting with a fresh profile setup.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          logo: "Please upload an image file (JPG, PNG, etc.)",
        }));
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          logo: "File size must be less than 5MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          logo: file,
          logoPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);

      // Clear logo error
      if (errors.logo) {
        setErrors((prev) => ({
          ...prev,
          logo: "",
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.organization_name.trim()) {
      newErrors.organization_name = "Organization name is required";
    }
    if (!profileData.contact_person.trim()) {
      newErrors.contact_person = "Contact person name is required";
    }
    if (!profileData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[\d\s\-\+\(\)]{10,}$/.test(profileData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!profileData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!profileData.website.trim()) {
      newErrors.website = "Website is required";
    } else if (
      !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
        profileData.website
      )
    ) {
      newErrors.website = "Please enter a valid website URL";
    }

    // Validate optional URL fields
    const urlFields = [
      "linkedin_url",
      "facebook_url",
      "twitter_url",
      "youtube_url",
    ];
    urlFields.forEach((field) => {
      if (profileData[field] && profileData[field].trim()) {
        if (
          !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
            profileData[field]
          )
        ) {
          newErrors[field] = "Please enter a valid URL";
        }
      }
    });

    // Validate numeric fields
    if (
      profileData.experience_years &&
      (isNaN(profileData.experience_years) || profileData.experience_years < 0)
    ) {
      newErrors.experience_years = "Please enter a valid number of years";
    }
    if (
      profileData.founded_year &&
      (isNaN(profileData.founded_year) ||
        profileData.founded_year < 1900 ||
        profileData.founded_year > new Date().getFullYear())
    ) {
      newErrors.founded_year = "Please enter a valid year";
    }
    if (
      profileData.team_size &&
      (isNaN(profileData.team_size) || profileData.team_size < 1)
    ) {
      newErrors.team_size = "Please enter a valid team size";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const backendBase =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      const token = localStorage.getItem("access_token");

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save your profile.",
          variant: "destructive",
        });
        return;
      }

      // Create FormData for multipart request (for file upload)
      const formData = new FormData();
      formData.append(
        "organization_name",
        profileData.organization_name.trim()
      );
      formData.append("contact_person", profileData.contact_person.trim());
      formData.append("phone", profileData.phone.trim());
      formData.append("address", profileData.address.trim());
      formData.append("website", profileData.website.trim() || "");
      formData.append(
        "certification_number",
        profileData.certification_number.trim() || ""
      );
      formData.append(
        "specialization",
        profileData.specialization.trim() || ""
      );
      formData.append("description", profileData.description.trim() || "");
      formData.append(
        "qualifications",
        profileData.qualifications.trim() || ""
      );
      formData.append("experience_years", profileData.experience_years || "");
      formData.append("founded_year", profileData.founded_year || "");
      formData.append("team_size", profileData.team_size || "");
      formData.append("linkedin_url", profileData.linkedin_url.trim() || "");
      formData.append("facebook_url", profileData.facebook_url.trim() || "");
      formData.append("twitter_url", profileData.twitter_url.trim() || "");
      formData.append("youtube_url", profileData.youtube_url.trim() || "");

      if (profileData.logo) {
        formData.append("logo", profileData.logo);
      }

      const response = await fetch(`${backendBase}/api/training/profile/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData((prev) => ({
          ...prev,
          organization_name: data.organization_name,
          contact_person: data.contact_person,
          phone: data.phone,
          address: data.address,
          website: data.website,
          certification_number: data.certification_number,
          specialization: data.specialization,
          description: data.description,
          qualifications: data.qualifications,
          experience_years: data.experience_years,
          founded_year: data.founded_year,
          team_size: data.team_size,
          linkedin_url: data.linkedin_url,
          facebook_url: data.facebook_url,
          twitter_url: data.twitter_url,
          youtube_url: data.youtube_url,
        }));

        toast({
          title: "Success!",
          description: "Your profile has been updated successfully.",
          variant: "default",
        });
      } else if (response.status === 400) {
        const errData = await response.json();
        const formattedErrors = {};

        if (typeof errData === "object") {
          Object.entries(errData).forEach(([key, value]) => {
            formattedErrors[key] = Array.isArray(value) ? value[0] : value;
          });
        }

        setErrors(formattedErrors);
        toast({
          title: "Validation Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
      } else if (response.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please log in to update your profile.",
          variant: "destructive",
        });
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faSpinner}
            className="text-4xl text-blue-600 animate-spin mb-4"
          />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Setup</h1>
        <p className="text-gray-600">
          Create or update your training provider profile with your organization
          details, qualifications, and certificates.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Organization Information Section */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
            <CardTitle className="flex items-center gap-3 text-xl">
              <FontAwesomeIcon icon={faBuilding} className="text-blue-600" />
              Organization Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="organization_name"
                  className="flex items-center gap-2 font-semibold text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className="w-4 h-4 text-blue-600"
                  />
                  Organization Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="organization_name"
                  name="organization_name"
                  type="text"
                  value={profileData.organization_name}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech Academy Institute"
                  className={`${
                    errors.organization_name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.organization_name && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="w-3 h-3"
                    />
                    {errors.organization_name}
                  </p>
                )}
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <Label
                  htmlFor="contact_person"
                  className="flex items-center gap-2 font-semibold text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="w-4 h-4 text-blue-600"
                  />
                  Contact Person <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  type="text"
                  value={profileData.contact_person}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
                  className={`${
                    errors.contact_person ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.contact_person && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="w-3 h-3"
                    />
                    {errors.contact_person}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="flex items-center gap-2 font-semibold text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="w-4 h-4 text-blue-600"
                  />
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +1 (555) 123-4567"
                  className={`${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="w-3 h-3"
                    />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label
                  htmlFor="website"
                  className="flex items-center gap-2 font-semibold text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="w-4 h-4 text-blue-600"
                  />
                  Website <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={profileData.website}
                  onChange={handleInputChange}
                  placeholder="e.g., https://www.example.com"
                  className={`${
                    errors.website ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.website && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="w-3 h-3"
                    />
                    {errors.website}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="flex items-center gap-2 font-semibold text-gray-700"
              >
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="w-4 h-4 text-blue-600"
                />
                Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                placeholder="e.g., 123 Main Street, Suite 100, City, State 12345"
                rows={3}
                className={`${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="w-3 h-3"
                  />
                  {errors.address}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Qualifications Section */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-gray-200">
            <CardTitle className="flex items-center gap-3 text-xl">
              <FontAwesomeIcon
                icon={faCertificate}
                className="text-purple-600"
              />
              Qualifications & Specializations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specialization */}
              <div className="space-y-2">
                <Label
                  htmlFor="specialization"
                  className="flex items-center gap-2 font-semibold text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faStar}
                    className="w-4 h-4 text-purple-600"
                  />
                  Area of Specialization (Optional)
                </Label>
                <Input
                  id="specialization"
                  name="specialization"
                  type="text"
                  value={profileData.specialization}
                  onChange={handleInputChange}
                  placeholder="e.g., Web Development, Data Science, AI/ML"
                  className="border-gray-300"
                />
              </div>

              {/* Certification Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="certification_number"
                  className="flex items-center gap-2 font-semibold text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="w-4 h-4 text-purple-600"
                  />
                  Certification Number (Optional)
                </Label>
                <Input
                  id="certification_number"
                  name="certification_number"
                  type="text"
                  value={profileData.certification_number}
                  onChange={handleInputChange}
                  placeholder="e.g., CERT-2024-12345"
                  className="border-gray-300"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Details Section */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-gray-200">
            <CardTitle className="flex items-center gap-3 text-xl">
              <FontAwesomeIcon icon={faBuilding} className="text-indigo-600" />
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="flex items-center gap-2 font-semibold text-gray-700"
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className="w-4 h-4 text-indigo-600"
                />
                Organization Description (Optional)
              </Label>
              <Textarea
                id="description"
                name="description"
                value={profileData.description}
                onChange={handleInputChange}
                placeholder="Tell us about your organization, its mission, and training approach..."
                rows={4}
                className="border-gray-300"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Experience Years */}
              <div className="space-y-2">
                <Label
                  htmlFor="experience_years"
                  className="flex items-center gap-2 font-semibold text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faStar}
                    className="w-4 h-4 text-indigo-600"
                  />
                  Years of Experience
                </Label>
                <Input
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  min="0"
                  max="100"
                  value={profileData.experience_years}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  className="border-gray-300"
                />
              </div>

              {/* Founded Year */}
              <div className="space-y-2">
                <Label
                  htmlFor="founded_year"
                  className="flex items-center gap-2 font-semibold text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faBuilding}
                    className="w-4 h-4 text-indigo-600"
                  />
                  Founded Year
                </Label>
                <Input
                  id="founded_year"
                  name="founded_year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={profileData.founded_year}
                  onChange={handleInputChange}
                  placeholder="e.g., 2010"
                  className="border-gray-300"
                />
              </div>

              {/* Team Size */}
              <div className="space-y-2">
                <Label
                  htmlFor="team_size"
                  className="flex items-center gap-2 font-semibold text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="w-4 h-4 text-indigo-600"
                  />
                  Team Size
                </Label>
                <Input
                  id="team_size"
                  name="team_size"
                  type="number"
                  min="1"
                  value={profileData.team_size}
                  onChange={handleInputChange}
                  placeholder="e.g., 25"
                  className="border-gray-300"
                />
              </div>
            </div>

            {/* Qualifications */}
            <div className="space-y-2">
              <Label
                htmlFor="qualifications"
                className="flex items-center gap-2 font-semibold text-gray-700"
              >
                <FontAwesomeIcon
                  icon={faCertificate}
                  className="w-4 h-4 text-indigo-600"
                />
                Key Qualifications & Certifications (Optional)
              </Label>
              <Textarea
                id="qualifications"
                name="qualifications"
                value={profileData.qualifications}
                onChange={handleInputChange}
                placeholder="List your key qualifications, certifications, and achievements..."
                rows={4}
                className="border-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Section */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100 border-b border-gray-200">
            <CardTitle className="flex items-center gap-3 text-xl">
              <FontAwesomeIcon icon={faGlobe} className="text-pink-600" />
              Social Media & Online Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LinkedIn */}
              <div className="space-y-2">
                <Label
                  htmlFor="linkedin_url"
                  className="flex items-center gap-2 font-semibold text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="w-4 h-4 text-pink-600"
                  />
                  LinkedIn Profile/Company Page
                </Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  type="url"
                  value={profileData.linkedin_url}
                  onChange={handleInputChange}
                  placeholder="https://www.linkedin.com/company/..."
                  className="border-gray-300"
                />
              </div>

              {/* Facebook */}
              <div className="space-y-2">
                <Label
                  htmlFor="facebook_url"
                  className="flex items-center gap-2 font-semibold text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="w-4 h-4 text-pink-600"
                  />
                  Facebook Page
                </Label>
                <Input
                  id="facebook_url"
                  name="facebook_url"
                  type="url"
                  value={profileData.facebook_url}
                  onChange={handleInputChange}
                  placeholder="https://www.facebook.com/..."
                  className="border-gray-300"
                />
              </div>

              {/* Twitter */}
              <div className="space-y-2">
                <Label
                  htmlFor="twitter_url"
                  className="flex items-center gap-2 font-semibold text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="w-4 h-4 text-pink-600"
                  />
                  Twitter/X Profile
                </Label>
                <Input
                  id="twitter_url"
                  name="twitter_url"
                  type="url"
                  value={profileData.twitter_url}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/..."
                  className="border-gray-300"
                />
              </div>

              {/* YouTube */}
              <div className="space-y-2">
                <Label
                  htmlFor="youtube_url"
                  className="flex items-center gap-2 font-semibold text-gray-700"
                >
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="w-4 h-4 text-pink-600"
                  />
                  YouTube Channel
                </Label>
                <Input
                  id="youtube_url"
                  name="youtube_url"
                  type="url"
                  value={profileData.youtube_url}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/..."
                  className="border-gray-300"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo Section */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
            <CardTitle className="flex items-center gap-3 text-xl">
              <FontAwesomeIcon icon={faUpload} className="text-green-600" />
              Organization Logo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-6">
              {/* Logo Preview */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {profileData.logoPreview ? (
                    <img
                      src={profileData.logoPreview}
                      alt="Logo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FontAwesomeIcon
                        icon={faUpload}
                        className="text-3xl mb-2 block"
                      />
                      <p className="text-xs">No logo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Input */}
              <div className="flex-1 space-y-3">
                <Label htmlFor="logo" className="font-semibold text-gray-700">
                  Upload Logo (Optional)
                </Label>
                <Input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border-gray-300 cursor-pointer"
                />
                <p className="text-sm text-gray-500">
                  Accepted formats: JPG, PNG, GIF (Max size: 5MB)
                </p>
                {errors.logo && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className="w-3 h-3"
                    />
                    {errors.logo}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fetchProfile()}
            disabled={saving}
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center gap-2"
          >
            {saving ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Success Banner */}
      {!loading &&
        !errors.organization_name &&
        profileData.organization_name && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <FontAwesomeIcon
              icon={faCheck}
              className="text-green-600 text-lg mt-1 flex-shrink-0"
            />
            <div>
              <h3 className="font-semibold text-green-900">Profile Complete</h3>
              <p className="text-green-800 text-sm mt-1">
                Your organization information is set up. You can now start
                creating training programs.
              </p>
            </div>
          </div>
        )}
    </div>
  );
};

export default ProfileSetupPage;
