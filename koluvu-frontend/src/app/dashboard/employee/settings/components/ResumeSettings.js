import React, { useState } from "react";
import { Save, FileText, Eye, Download, Layout, RefreshCw } from "lucide-react";

const ResumeSettings = ({ settings, onChange, onSave, isSaving }) => {
  const [localSettings, setLocalSettings] = useState({
    default_resume_template: settings?.default_resume_template || "modern",
    auto_update_resume: settings?.auto_update_resume ?? false,
    allow_resume_download: settings?.allow_resume_download ?? true,
    resume_visibility: settings?.resume_visibility || "public",
  });

  const handleInputChange = (field, value) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    onChange("resume", updatedSettings);
  };

  const handleSave = async () => {
    await onSave(localSettings, "resume");
  };

  const resumeTemplates = [
    {
      value: "modern",
      label: "Modern",
      description: "Clean and contemporary design",
    },
    {
      value: "professional",
      label: "Professional",
      description: "Traditional business format",
    },
    {
      value: "creative",
      label: "Creative",
      description: "Unique design for creative roles",
    },
    {
      value: "minimal",
      label: "Minimal",
      description: "Simple and clean layout",
    },
    {
      value: "technical",
      label: "Technical",
      description: "Optimized for tech roles",
    },
  ];

  const visibilityOptions = [
    {
      value: "public",
      label: "Public",
      description: "Visible to all employers",
    },
    {
      value: "limited",
      label: "Limited",
      description: "Visible to verified employers only",
    },
    {
      value: "private",
      label: "Private",
      description: "Only visible when you apply",
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
        <h3 className="text-lg font-medium text-gray-900">Resume Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your resume templates, visibility, and automatic updates.
        </p>
      </div>

      <div className="space-y-8">
        {/* Resume Template */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Layout className="w-5 h-5 mr-2" />
            Resume Template
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose your default resume template
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumeTemplates.map((template) => (
                  <div key={template.value} className="relative">
                    <input
                      type="radio"
                      id={`template-${template.value}`}
                      name="default_resume_template"
                      value={template.value}
                      checked={
                        localSettings.default_resume_template === template.value
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "default_resume_template",
                          e.target.value
                        )
                      }
                      className="sr-only peer"
                    />
                    <label
                      htmlFor={`template-${template.value}`}
                      className="block p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-50"
                    >
                      <div className="text-center">
                        <div className="w-16 h-20 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="font-medium text-gray-900">
                          {template.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {template.description}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resume Visibility */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Resume Visibility
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Who can view your resume?
              </label>
              <div className="space-y-3">
                {visibilityOptions.map((option) => (
                  <div key={option.value} className="flex items-start">
                    <input
                      type="radio"
                      id={`visibility-${option.value}`}
                      name="resume_visibility"
                      value={option.value}
                      checked={localSettings.resume_visibility === option.value}
                      onChange={(e) =>
                        handleInputChange("resume_visibility", e.target.value)
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
          </div>
        </div>

        {/* Resume Management */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Resume Management
          </h4>

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">
                  Auto-update Resume
                </h5>
                <p className="text-sm text-gray-500">
                  Automatically update your resume when you change profile
                  information
                </p>
              </div>
              <ToggleSwitch
                checked={localSettings.auto_update_resume}
                onChange={(e) =>
                  handleInputChange("auto_update_resume", e.target.checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-medium text-gray-900">
                  Allow Resume Download
                </h5>
                <p className="text-sm text-gray-500">
                  Let employers download your resume as PDF
                </p>
              </div>
              <ToggleSwitch
                checked={localSettings.allow_resume_download}
                onChange={(e) =>
                  handleInputChange("allow_resume_download", e.target.checked)
                }
              />
            </div>
          </div>
        </div>

        {/* Resume Actions */}
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Resume Actions
          </h4>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
              <div>
                <h5 className="text-sm font-medium text-gray-900">
                  Current Resume
                </h5>
                <p className="text-sm text-gray-500">Last updated: Never</p>
              </div>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Tips */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <FileText className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-green-800">
                Resume Tips
              </h5>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>
                  • Keep your resume updated with your latest skills and
                  experiences
                </li>
                <li>• Choose a template that matches your industry and role</li>
                <li>
                  • Use keywords from job descriptions to improve ATS
                  compatibility
                </li>
                <li>• Keep your resume concise - ideally 1-2 pages</li>
                <li>• Proofread for grammar and spelling errors</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Settings Summary */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <Layout className="w-5 h-5 mr-2" />
            Current Settings Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Layout className="w-4 h-4 text-blue-600" />
              <span>
                Template:{" "}
                {
                  resumeTemplates.find(
                    (t) => t.value === localSettings.default_resume_template
                  )?.label
                }
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye
                className={`w-4 h-4 ${
                  localSettings.resume_visibility === "public"
                    ? "text-green-600"
                    : localSettings.resume_visibility === "limited"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              />
              <span className="capitalize">
                Visibility: {localSettings.resume_visibility}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw
                className={`w-4 h-4 ${
                  localSettings.auto_update_resume
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <span>
                Auto-update:{" "}
                {localSettings.auto_update_resume ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Download
                className={`w-4 h-4 ${
                  localSettings.allow_resume_download
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <span>
                Download:{" "}
                {localSettings.allow_resume_download ? "Allowed" : "Blocked"}
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
            {isSaving ? "Saving..." : "Save Resume Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeSettings;
