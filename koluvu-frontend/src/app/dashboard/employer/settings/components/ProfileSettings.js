// src/pages/Dashboard/Employer/Settings/components/ProfileSettings.js

import React, { useState } from "react";
import {
  User,
  Building2,
  Globe,
  Eye,
  EyeOff,
  Save,
  Camera,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Users,
} from "lucide-react";

const ProfileSettings = ({ settings, onChange, onSave, isSaving }) => {
  const [localSettings, setLocalSettings] = useState({
    auto_update_from_linkedin: settings?.auto_update_from_linkedin || true,
    auto_update_from_google: settings?.auto_update_from_google || true,
    auto_sync_company_info: settings?.auto_sync_company_info || true,
    profile_visibility: settings?.profile_visibility || "public",
    show_contact_info: settings?.show_contact_info || true,
    show_company_size: settings?.show_company_size || true,
    show_website: settings?.show_website || true,
    show_social_media: settings?.show_social_media || true,
    allow_profile_search: settings?.allow_profile_search || true,
  });

  const handleChange = (key, value) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    onChange(key, value);
  };

  const handleSave = () => {
    onSave(localSettings);
  };

  const visibilityOptions = [
    { value: "public", label: "Public", description: "Visible to everyone" },
    { value: "private", label: "Private", description: "Only visible to you" },
    {
      value: "connections",
      label: "Connections Only",
      description: "Visible to your connections",
    },
    {
      value: "verified",
      label: "Verified Users Only",
      description: "Only verified users can see",
    },
  ];

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900">Profile Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal and company profile information and visibility.
        </p>
      </div>

      {/* Auto-sync Settings */}
      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Auto-sync Settings
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Auto-update from LinkedIn
                  </label>
                  <p className="text-sm text-gray-500">
                    Automatically sync profile data from LinkedIn
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.auto_update_from_linkedin}
                  onChange={(e) =>
                    handleChange("auto_update_from_linkedin", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Auto-update from Google
                  </label>
                  <p className="text-sm text-gray-500">
                    Automatically sync profile data from Google account
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.auto_update_from_google}
                  onChange={(e) =>
                    handleChange("auto_update_from_google", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">
                    Auto-sync company info
                  </label>
                  <p className="text-sm text-gray-500">
                    Keep company information synchronized across platforms
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.auto_sync_company_info}
                  onChange={(e) =>
                    handleChange("auto_sync_company_info", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Profile Visibility */}
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Profile Visibility
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Visibility Level
              </label>
              <div className="space-y-2">
                {visibilityOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="profile_visibility"
                      value={option.value}
                      checked={
                        localSettings.profile_visibility === option.value
                      }
                      onChange={(e) =>
                        handleChange("profile_visibility", e.target.value)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <span className="text-sm font-medium text-gray-900">
                        {option.label}
                      </span>
                      <p className="text-sm text-gray-500">
                        {option.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Information Display Settings */}
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Information Display
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    Show contact info
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.show_contact_info}
                    onChange={(e) =>
                      handleChange("show_contact_info", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    Show company size
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.show_company_size}
                    onChange={(e) =>
                      handleChange("show_company_size", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">Show website</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.show_website}
                    onChange={(e) =>
                      handleChange("show_website", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Camera className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    Show social media
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.show_social_media}
                    onChange={(e) =>
                      handleChange("show_social_media", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Search Settings */}
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Search Settings
          </h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Eye className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Allow profile search
                </label>
                <p className="text-sm text-gray-500">
                  Let people find your profile through search
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.allow_profile_search}
                onChange={(e) =>
                  handleChange("allow_profile_search", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Profile Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
