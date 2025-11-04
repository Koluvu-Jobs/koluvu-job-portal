// src/app/dashboard/employee/components/DynamicProfile.js
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Edit3,
  Save,
  X,
  User,
  Award,
  BookOpen,
  Github,
  Linkedin,
  Globe,
  Camera,
} from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

const DynamicProfile = () => {
  const { userData, loading, error, updateUser, refetch } = useUserData();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (userData?.user) {
      setEditForm({
        first_name: userData.user.first_name || "",
        last_name: userData.user.last_name || "",
        phone_number: userData.user.phone_number || "",
        location: userData.user.location || "",
        bio: userData.user.bio || "",
        current_designation: userData.user.current_designation || "",
        linkedin_url: userData.user.linkedin_url || "",
      });
    }
  }, [userData]);

  const handleSave = async () => {
    try {
      await updateUser(editForm);
      setIsEditing(false);
      refetch(); // Refresh data to sync across all components
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original data
    if (userData?.user) {
      setEditForm({
        first_name: userData.user.first_name || "",
        last_name: userData.user.last_name || "",
        phone_number: userData.user.phone_number || "",
        location: userData.user.location || "",
        bio: userData.user.bio || "",
        current_designation: userData.user.current_designation || "",
        linkedin_url: userData.user.linkedin_url || "",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading profile</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={refetch}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const user = userData?.user;
  if (!user) return null;

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Picture and Basic Info */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start space-x-6">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 group">
              {user.google_profile_picture ? (
                <img
                  src={user.google_profile_picture}
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                  {user.first_name?.[0]}
                  {user.last_name?.[0]}
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            {userData.social_account && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Google
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.first_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, first_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">
                    {user.first_name || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, last_name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">
                    {user.last_name || "Not specified"}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{user.email}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.phone_number}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone_number: e.target.value })
                    }
                    placeholder="Phone number"
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-gray-900">
                    {user.phone_number || "Not specified"}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    placeholder="Location"
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-gray-900">
                    {user.location || "Not specified"}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-gray-500" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.current_designation}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        current_designation: e.target.value,
                      })
                    }
                    placeholder="Current position"
                    className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="text-gray-900">
                    {user.current_designation || "Not specified"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            About Me
          </label>
          {isEditing ? (
            <textarea
              value={editForm.bio}
              onChange={(e) =>
                setEditForm({ ...editForm, bio: e.target.value })
              }
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">
              {user.bio || "No bio provided yet."}
            </p>
          )}
        </div>

        {/* Social Links */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn Profile
          </label>
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Linkedin className="w-4 h-4 text-blue-600" />
              <input
                type="url"
                value={editForm.linkedin_url}
                onChange={(e) =>
                  setEditForm({ ...editForm, linkedin_url: e.target.value })
                }
                placeholder="https://linkedin.com/in/yourprofile"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Linkedin className="w-4 h-4 text-blue-600" />
              {user.linkedin_url ? (
                <a
                  href={user.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {user.linkedin_url}
                </a>
              ) : (
                <span className="text-gray-500">Not specified</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Completion */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-blue-900">
            Profile Completion
          </h3>
          <span className="text-2xl font-bold text-blue-600">
            {userData.profile_completion || 0}%
          </span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${userData.profile_completion || 0}%` }}
          />
        </div>
        <p className="text-blue-800 text-sm mt-2">
          Complete your profile to get better job recommendations and increase
          your visibility to employers.
        </p>
      </div>
    </div>
  );
};

export default DynamicProfile;
