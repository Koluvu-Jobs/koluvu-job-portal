import React, { useState } from "react";
import {
  Save,
  Briefcase,
  MapPin,
  DollarSign,
  Building,
  Clock,
  Zap,
} from "lucide-react";

const JobPreferencesSettings = ({ settings, onChange, onSave, isSaving }) => {
  const [localSettings, setLocalSettings] = useState({
    job_alert_frequency: settings?.job_alert_frequency || "daily",
    preferred_job_types: settings?.preferred_job_types || [],
    preferred_locations: settings?.preferred_locations || "",
    remote_work_preference: settings?.remote_work_preference || "hybrid",
    salary_range_min: settings?.salary_range_min || "",
    salary_range_max: settings?.salary_range_max || "",
    industry_preferences: settings?.industry_preferences || "",
    company_size_preference: settings?.company_size_preference || "any",
    auto_apply_enabled: settings?.auto_apply_enabled || false,
    auto_apply_criteria: settings?.auto_apply_criteria || "",
  });

  const handleInputChange = (field, value) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    onChange("job-preferences", updatedSettings);
  };

  const handleJobTypeChange = (jobType, checked) => {
    const currentTypes = Array.isArray(localSettings.preferred_job_types)
      ? localSettings.preferred_job_types
      : [];

    const updatedTypes = checked
      ? [...currentTypes, jobType]
      : currentTypes.filter((type) => type !== jobType);

    handleInputChange("preferred_job_types", updatedTypes);
  };

  const handleSave = async () => {
    await onSave(localSettings, "job-preferences");
  };

  const jobAlertFrequencies = [
    { value: "immediate", label: "Immediate (as they are posted)" },
    { value: "daily", label: "Daily digest" },
    { value: "weekly", label: "Weekly digest" },
    { value: "never", label: "Never (disabled)" },
  ];

  const jobTypes = [
    { value: "full_time", label: "Full-time" },
    { value: "part_time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
    { value: "internship", label: "Internship" },
    { value: "temporary", label: "Temporary" },
  ];

  const remoteWorkOptions = [
    { value: "remote", label: "Fully Remote" },
    { value: "hybrid", label: "Hybrid" },
    { value: "onsite", label: "On-site Only" },
    { value: "any", label: "Any" },
  ];

  const companySizes = [
    { value: "startup", label: "Startup (1-50 employees)" },
    { value: "small", label: "Small (51-200 employees)" },
    { value: "medium", label: "Medium (201-1000 employees)" },
    { value: "large", label: "Large (1000+ employees)" },
    { value: "any", label: "Any size" },
  ];

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900">Job Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure your job search preferences and alert settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Job Alert Settings */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">
            <Bell className="w-5 h-5 inline mr-2" />
            Job Alert Settings
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alert Frequency
              </label>
              <select
                value={localSettings.job_alert_frequency}
                onChange={(e) =>
                  handleInputChange("job_alert_frequency", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {jobAlertFrequencies.map((freq) => (
                  <option key={freq.value} value={freq.value}>
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Job Type Preferences */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">
            <Briefcase className="w-5 h-5 inline mr-2" />
            Preferred Job Types
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {jobTypes.map((type) => {
              const currentTypes = Array.isArray(
                localSettings.preferred_job_types
              )
                ? localSettings.preferred_job_types
                : [];
              const isChecked = currentTypes.includes(type.value);

              return (
                <div key={type.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`job-type-${type.value}`}
                    checked={isChecked}
                    onChange={(e) =>
                      handleJobTypeChange(type.value, e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`job-type-${type.value}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {type.label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location Preferences */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">
            <MapPin className="w-5 h-5 inline mr-2" />
            Location Preferences
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Locations (comma-separated)
              </label>
              <input
                type="text"
                value={localSettings.preferred_locations}
                onChange={(e) =>
                  handleInputChange("preferred_locations", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New York, San Francisco, Remote..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remote Work Preference
              </label>
              <select
                value={localSettings.remote_work_preference}
                onChange={(e) =>
                  handleInputChange("remote_work_preference", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {remoteWorkOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Salary Expectations */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">
            <DollarSign className="w-5 h-5 inline mr-2" />
            Salary Expectations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Salary (per year)
              </label>
              <input
                type="number"
                value={localSettings.salary_range_min}
                onChange={(e) =>
                  handleInputChange("salary_range_min", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50000"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Salary (per year)
              </label>
              <input
                type="number"
                value={localSettings.salary_range_max}
                onChange={(e) =>
                  handleInputChange("salary_range_max", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100000"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Industry & Company Preferences */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">
            <Building className="w-5 h-5 inline mr-2" />
            Industry & Company Preferences
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Industries (comma-separated)
              </label>
              <input
                type="text"
                value={localSettings.industry_preferences}
                onChange={(e) =>
                  handleInputChange("industry_preferences", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Technology, Healthcare, Finance..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size Preference
              </label>
              <select
                value={localSettings.company_size_preference}
                onChange={(e) =>
                  handleInputChange("company_size_preference", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {companySizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Auto-Apply Settings */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">
            <Zap className="w-5 h-5 inline mr-2" />
            Auto-Apply Settings
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">
                  Enable Auto-Apply
                </h5>
                <p className="text-sm text-gray-500">
                  Automatically apply to jobs matching your criteria
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.auto_apply_enabled}
                  onChange={(e) =>
                    handleInputChange("auto_apply_enabled", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {localSettings.auto_apply_enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-Apply Criteria
                </label>
                <textarea
                  value={localSettings.auto_apply_criteria}
                  onChange={(e) =>
                    handleInputChange("auto_apply_criteria", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe specific criteria for auto-applying to jobs..."
                />
              </div>
            )}
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
            {isSaving ? "Saving..." : "Save Job Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPreferencesSettings;
