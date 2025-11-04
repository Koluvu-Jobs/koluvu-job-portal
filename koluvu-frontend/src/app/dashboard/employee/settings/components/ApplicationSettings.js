import React, { useState } from "react";
import { Save, FileText, Eye, Clock, Bell } from "lucide-react";

const ApplicationSettings = ({ settings, onChange, onSave, isSaving }) => {
  const [localSettings, setLocalSettings] = useState({
    track_application_views: settings?.track_application_views ?? true,
    show_application_history: settings?.show_application_history ?? true,
    auto_withdraw_applications: settings?.auto_withdraw_applications ?? false,
    application_follow_up_reminders:
      settings?.application_follow_up_reminders ?? true,
  });

  const handleInputChange = (field, value) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    onChange("applications", updatedSettings);
  };

  const handleSave = async () => {
    await onSave(localSettings, "applications");
  };

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
          Application Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage how you track and handle job applications.
        </p>
      </div>

      <div className="space-y-8">
        {/* Application Tracking */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Application Tracking
          </h4>

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">
                  Track Application Views
                </h5>
                <p className="text-sm text-gray-500">
                  See when employers view your applications
                </p>
              </div>
              <ToggleSwitch
                checked={localSettings.track_application_views}
                onChange={(e) =>
                  handleInputChange("track_application_views", e.target.checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">
                  Show Application History
                </h5>
                <p className="text-sm text-gray-500">
                  Display your complete application history in your profile
                </p>
              </div>
              <ToggleSwitch
                checked={localSettings.show_application_history}
                onChange={(e) =>
                  handleInputChange(
                    "show_application_history",
                    e.target.checked
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Application Management */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Application Management
          </h4>

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">
                  Auto-withdraw Old Applications
                </h5>
                <p className="text-sm text-gray-500">
                  Automatically withdraw applications after 30 days of no
                  response
                </p>
              </div>
              <ToggleSwitch
                checked={localSettings.auto_withdraw_applications}
                onChange={(e) =>
                  handleInputChange(
                    "auto_withdraw_applications",
                    e.target.checked
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">
                  Follow-up Reminders
                </h5>
                <p className="text-sm text-gray-500">
                  Get reminders to follow up on applications after a week
                </p>
              </div>
              <ToggleSwitch
                checked={localSettings.application_follow_up_reminders}
                onChange={(e) =>
                  handleInputChange(
                    "application_follow_up_reminders",
                    e.target.checked
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Application Statistics */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Application Statistics
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">Applications Viewed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">0</div>
              <div className="text-sm text-gray-600">Pending Responses</div>
            </div>
          </div>
        </div>

        {/* Application Tips */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <FileText className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-green-800">
                Application Tips
              </h5>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>
                  • Keep track of your applications to avoid duplicate
                  submissions
                </li>
                <li>
                  • Follow up on applications after 1-2 weeks if you haven't
                  heard back
                </li>
                <li>
                  • Customize your resume and cover letter for each application
                </li>
                <li>
                  • Review application requirements carefully before applying
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Settings Summary */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Current Settings Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Eye
                className={`w-4 h-4 ${
                  localSettings.track_application_views
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <span>
                Application Tracking:{" "}
                {localSettings.track_application_views ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText
                className={`w-4 h-4 ${
                  localSettings.show_application_history
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <span>
                History Visible:{" "}
                {localSettings.show_application_history ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock
                className={`w-4 h-4 ${
                  localSettings.auto_withdraw_applications
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <span>
                Auto-withdraw:{" "}
                {localSettings.auto_withdraw_applications
                  ? "Enabled"
                  : "Disabled"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Bell
                className={`w-4 h-4 ${
                  localSettings.application_follow_up_reminders
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <span>
                Follow-up Reminders:{" "}
                {localSettings.application_follow_up_reminders
                  ? "Enabled"
                  : "Disabled"}
              </span>
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
            {isSaving ? "Saving..." : "Save Application Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSettings;
