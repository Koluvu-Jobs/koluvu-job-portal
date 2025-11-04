import React, { useState } from "react";
import {
  Save,
  Shield,
  Eye,
  Download,
  Phone,
  Users,
  Database,
} from "lucide-react";

const PrivacySettings = ({ settings, onChange, onSave, isSaving }) => {
  const [localSettings, setLocalSettings] = useState({
    profile_visibility: settings?.profile_visibility || "public",
    show_profile_publicly: settings?.show_profile_publicly ?? true,
    allow_profile_download: settings?.allow_profile_download ?? false,
    show_salary_expectations: settings?.show_salary_expectations ?? true,
    show_contact_info: settings?.show_contact_info ?? false,
    allow_recruiter_contact: settings?.allow_recruiter_contact ?? true,
    data_sharing_consent: settings?.data_sharing_consent ?? false,
  });

  const handleInputChange = (field, value) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    onChange("privacy", updatedSettings);
  };

  const handleSave = async () => {
    await onSave(localSettings, "privacy");
  };

  const profileVisibilityOptions = [
    {
      value: "public",
      label: "Public",
      description: "Visible to all employers and recruiters",
    },
    {
      value: "limited",
      label: "Limited",
      description: "Visible only to verified employers",
    },
    {
      value: "private",
      label: "Private",
      description: "Hidden from search results",
    },
  ];

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <label
      className={`relative inline-flex items-center cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Privacy & Security Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Control your profile visibility and data sharing preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Visibility */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Profile Visibility
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Who can view your profile?
              </label>
              <div className="space-y-3">
                {profileVisibilityOptions.map((option) => (
                  <div key={option.value} className="flex items-start">
                    <input
                      type="radio"
                      id={`visibility-${option.value}`}
                      name="profile_visibility"
                      value={option.value}
                      checked={
                        localSettings.profile_visibility === option.value
                      }
                      onChange={(e) =>
                        handleInputChange("profile_visibility", e.target.value)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                    />
                    <div className="ml-3">
                      <label
                        htmlFor={`visibility-${option.value}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        {option.label}
                      </label>
                      <p className="text-sm text-gray-500">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium text-gray-900">
                    Show Profile in Search Results
                  </h5>
                  <p className="text-sm text-gray-500">
                    Allow employers to find your profile through search
                  </p>
                </div>
                <ToggleSwitch
                  checked={localSettings.show_profile_publicly}
                  onChange={(e) =>
                    handleInputChange("show_profile_publicly", e.target.checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-medium text-gray-900">
                    Allow Profile Download
                  </h5>
                  <p className="text-sm text-gray-500">
                    Let employers download your profile as PDF
                  </p>
                </div>
                <ToggleSwitch
                  checked={localSettings.allow_profile_download}
                  onChange={(e) =>
                    handleInputChange(
                      "allow_profile_download",
                      e.target.checked
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Information Sharing */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Information Sharing
          </h4>

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">
                  Show Salary Expectations
                </h5>
                <p className="text-sm text-gray-500">
                  Display your salary range on your profile
                </p>
              </div>
              <ToggleSwitch
                checked={localSettings.show_salary_expectations}
                onChange={(e) =>
                  handleInputChange(
                    "show_salary_expectations",
                    e.target.checked
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">
                  Show Contact Information
                </h5>
                <p className="text-sm text-gray-500">
                  Display your phone number and email to employers
                </p>
              </div>
              <ToggleSwitch
                checked={localSettings.show_contact_info}
                onChange={(e) =>
                  handleInputChange("show_contact_info", e.target.checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">
                  Allow Recruiter Contact
                </h5>
                <p className="text-sm text-gray-500">
                  Let recruiters contact you directly through the platform
                </p>
              </div>
              <ToggleSwitch
                checked={localSettings.allow_recruiter_contact}
                onChange={(e) =>
                  handleInputChange("allow_recruiter_contact", e.target.checked)
                }
              />
            </div>
          </div>
        </div>

        {/* Data & Analytics */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Data & Analytics
          </h4>

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">
                  Data Sharing for Analytics
                </h5>
                <p className="text-sm text-gray-500">
                  Share anonymized data to help improve our service
                </p>
              </div>
              <ToggleSwitch
                checked={localSettings.data_sharing_consent}
                onChange={(e) =>
                  handleInputChange("data_sharing_consent", e.target.checked)
                }
              />
            </div>
          </div>
        </div>

        {/* Privacy Summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Privacy Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Eye
                  className={`w-4 h-4 ${
                    localSettings.profile_visibility === "public"
                      ? "text-green-600"
                      : localSettings.profile_visibility === "limited"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                />
                <span className="capitalize">
                  Profile: {localSettings.profile_visibility}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Download
                  className={`w-4 h-4 ${
                    localSettings.allow_profile_download
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span>
                  Download:{" "}
                  {localSettings.allow_profile_download ? "Allowed" : "Blocked"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone
                  className={`w-4 h-4 ${
                    localSettings.show_contact_info
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span>
                  Contact Info:{" "}
                  {localSettings.show_contact_info ? "Visible" : "Hidden"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Users
                  className={`w-4 h-4 ${
                    localSettings.allow_recruiter_contact
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span>
                  Recruiter Contact:{" "}
                  {localSettings.allow_recruiter_contact
                    ? "Allowed"
                    : "Blocked"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Database
                  className={`w-4 h-4 ${
                    localSettings.data_sharing_consent
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
                <span>
                  Data Sharing:{" "}
                  {localSettings.data_sharing_consent ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-yellow-800">
                Privacy Notice
              </h5>
              <p className="text-sm text-yellow-700 mt-1">
                Your privacy is important to us. Making your profile private may
                limit job opportunities, but you'll maintain complete control
                over who can see your information. You can change these settings
                at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Save
              className={`w-4 h-4 mr-2 ${isSaving ? "animate-spin" : ""}`}
            />
            {isSaving ? "Saving..." : "Save Privacy Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
