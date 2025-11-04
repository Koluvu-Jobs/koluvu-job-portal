import React, { useState } from "react";
import {
  Save,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Calendar,
  Newspaper,
  Target,
} from "lucide-react";

const NotificationSettings = ({ settings, onChange, onSave, isSaving }) => {
  const [localSettings, setLocalSettings] = useState({
    email_notifications: settings?.email_notifications ?? true,
    push_notifications: settings?.push_notifications ?? true,
    sms_notifications: settings?.sms_notifications ?? false,
    job_match_notifications: settings?.job_match_notifications ?? true,
    application_status_notifications:
      settings?.application_status_notifications ?? true,
    interview_reminders: settings?.interview_reminders ?? true,
    newsletter_subscription: settings?.newsletter_subscription ?? false,
    marketing_emails: settings?.marketing_emails ?? false,
    weekly_job_digest: settings?.weekly_job_digest ?? true,
  });

  const handleInputChange = (field, value) => {
    const updatedSettings = { ...localSettings, [field]: value };
    setLocalSettings(updatedSettings);
    onChange("notifications", updatedSettings);
  };

  const handleSave = async () => {
    await onSave(localSettings, "notifications");
  };

  const notificationCategories = [
    {
      title: "Job-Related Notifications",
      icon: Bell,
      settings: [
        {
          key: "job_match_notifications",
          label: "Job Match Alerts",
          description:
            "Get notified when jobs matching your preferences are posted",
          icon: Bell,
        },
        {
          key: "application_status_notifications",
          label: "Application Status Updates",
          description: "Receive updates when your application status changes",
          icon: MessageSquare,
        },
        {
          key: "interview_reminders",
          label: "Interview Reminders",
          description: "Get reminders about upcoming interviews",
          icon: Calendar,
        },
        {
          key: "weekly_job_digest",
          label: "Weekly Job Digest",
          description: "Receive a weekly summary of new job opportunities",
          icon: Newspaper,
        },
      ],
    },
    {
      title: "Communication Channels",
      icon: MessageSquare,
      settings: [
        {
          key: "email_notifications",
          label: "Email Notifications",
          description: "Receive notifications via email",
          icon: Mail,
        },
        {
          key: "push_notifications",
          label: "Push Notifications",
          description: "Receive browser push notifications",
          icon: Bell,
        },
        {
          key: "sms_notifications",
          label: "SMS Notifications",
          description: "Receive text message notifications (charges may apply)",
          icon: Smartphone,
        },
      ],
    },
    {
      title: "Marketing & Promotions",
      icon: Target,
      settings: [
        {
          key: "newsletter_subscription",
          label: "Newsletter Subscription",
          description:
            "Receive our newsletter with career tips and industry insights",
          icon: Newspaper,
        },
        {
          key: "marketing_emails",
          label: "Promotional Emails",
          description:
            "Receive emails about new features, promotions, and events",
          icon: Target,
        },
      ],
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
          Notification Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage how and when you receive notifications about your job search
          activity.
        </p>
      </div>

      <div className="space-y-8">
        {notificationCategories.map((category, categoryIndex) => {
          const CategoryIcon = category.icon;

          return (
            <div key={categoryIndex}>
              <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                <CategoryIcon className="w-5 h-5 mr-2" />
                {category.title}
              </h4>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-4">
                  {category.settings.map((setting) => {
                    const SettingIcon = setting.icon;
                    const isEnabled = localSettings[setting.key];

                    // Special logic for dependent settings
                    const isDisabled =
                      (setting.key === "weekly_job_digest" &&
                        !localSettings.email_notifications) ||
                      (setting.key === "newsletter_subscription" &&
                        !localSettings.email_notifications) ||
                      (setting.key === "marketing_emails" &&
                        !localSettings.email_notifications);

                    return (
                      <div
                        key={setting.key}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-start space-x-3 flex-1">
                          <SettingIcon
                            className={`w-5 h-5 mt-0.5 ${
                              isEnabled && !isDisabled
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h5
                                className={`text-sm font-medium ${
                                  isDisabled ? "text-gray-400" : "text-gray-900"
                                }`}
                              >
                                {setting.label}
                              </h5>
                              {isDisabled && (
                                <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                                  Requires Email
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-sm ${
                                isDisabled ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {setting.description}
                            </p>
                          </div>
                        </div>

                        <ToggleSwitch
                          checked={isEnabled}
                          disabled={isDisabled}
                          onChange={(e) =>
                            handleInputChange(setting.key, e.target.checked)
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Notification Summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-600" />
            Notification Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Mail
                className={`w-4 h-4 ${
                  localSettings.email_notifications
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <span
                className={
                  localSettings.email_notifications
                    ? "text-green-700"
                    : "text-gray-500"
                }
              >
                Email:{" "}
                {localSettings.email_notifications ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Bell
                className={`w-4 h-4 ${
                  localSettings.push_notifications
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <span
                className={
                  localSettings.push_notifications
                    ? "text-green-700"
                    : "text-gray-500"
                }
              >
                Push:{" "}
                {localSettings.push_notifications ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone
                className={`w-4 h-4 ${
                  localSettings.sms_notifications
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <span
                className={
                  localSettings.sms_notifications
                    ? "text-green-700"
                    : "text-gray-500"
                }
              >
                SMS: {localSettings.sms_notifications ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-yellow-800">
                Important Notice
              </h5>
              <p className="text-sm text-yellow-700 mt-1">
                Disabling certain notifications may cause you to miss important
                updates about job opportunities and application status changes.
                We recommend keeping job-related notifications enabled for the
                best experience.
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
            {isSaving ? "Saving..." : "Save Notification Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
