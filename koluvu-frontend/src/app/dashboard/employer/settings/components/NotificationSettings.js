// src/pages/Dashboard/Employer/Settings/components/NotificationSettings.js

import React, { useState } from "react";
import { Bell, Mail, Smartphone, Save, Clock, Volume2 } from "lucide-react";

const NotificationSettings = ({ settings, onChange, onSave, isSaving }) => {
  const [localSettings, setLocalSettings] = useState({
    notify_new_applications: settings?.notify_new_applications || [
      "email",
      "in_app",
    ],
    notify_interview_scheduled: settings?.notify_interview_scheduled || [
      "email",
      "in_app",
    ],
    notify_candidate_messages: settings?.notify_candidate_messages || [
      "email",
      "in_app",
    ],
    notification_frequency: settings?.notification_frequency || "instant",
    enable_quiet_hours: settings?.enable_quiet_hours || false,
    quiet_hours_start: settings?.quiet_hours_start || "22:00",
    quiet_hours_end: settings?.quiet_hours_end || "08:00",
  });

  const handleChange = (key, value) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
    onChange(key, value);
  };

  const handleNotificationTypeChange = (eventType, method, checked) => {
    setLocalSettings((prev) => {
      const current = prev[eventType] || [];
      const updated = checked
        ? [...current, method]
        : current.filter((m) => m !== method);

      const newSettings = { ...prev, [eventType]: updated };
      onChange(eventType, updated);
      return newSettings;
    });
  };

  const notificationEvents = [
    {
      key: "notify_new_applications",
      label: "New Applications",
      description: "When someone applies to your jobs",
    },
    {
      key: "notify_interview_scheduled",
      label: "Interview Scheduled",
      description: "When interviews are scheduled or updated",
    },
    {
      key: "notify_candidate_messages",
      label: "Candidate Messages",
      description: "When candidates send you messages",
    },
  ];

  const notificationMethods = [
    { key: "email", label: "Email", icon: Mail },
    { key: "in_app", label: "In-App", icon: Bell },
    { key: "push", label: "Push", icon: Smartphone },
  ];

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Notification Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure how and when you receive notifications.
        </p>
      </div>

      <div className="space-y-6">
        {/* Notification Events */}
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Notification Types
          </h4>
          <div className="space-y-4">
            {notificationEvents.map((event) => (
              <div
                key={event.key}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="mb-3">
                  <h5 className="text-sm font-medium text-gray-900">
                    {event.label}
                  </h5>
                  <p className="text-sm text-gray-500">{event.description}</p>
                </div>
                <div className="flex space-x-6">
                  {notificationMethods.map((method) => {
                    const Icon = method.icon;
                    const isEnabled =
                      localSettings[event.key]?.includes(method.key) || false;

                    return (
                      <label key={method.key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={(e) =>
                            handleNotificationTypeChange(
                              event.key,
                              method.key,
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Icon className="ml-2 mr-1 h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {method.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequency Settings */}
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Notification Frequency
          </h4>
          <div className="space-y-2">
            {[
              {
                value: "instant",
                label: "Instant",
                description: "Get notified immediately",
              },
              {
                value: "hourly",
                label: "Hourly Digest",
                description: "Combine notifications into hourly summaries",
              },
              {
                value: "daily",
                label: "Daily Digest",
                description: "One notification summary per day",
              },
            ].map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="notification_frequency"
                  value={option.value}
                  checked={
                    localSettings.notification_frequency === option.value
                  }
                  onChange={(e) =>
                    handleChange("notification_frequency", e.target.value)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-900">
                    {option.label}
                  </span>
                  <p className="text-sm text-gray-500">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div>
          <h4 className="text-base font-medium text-gray-900 mb-4">
            Quiet Hours
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Enable quiet hours
                </span>
                <p className="text-sm text-gray-500">
                  Pause notifications during specified hours
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.enable_quiet_hours}
                  onChange={(e) =>
                    handleChange("enable_quiet_hours", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {localSettings.enable_quiet_hours && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start time
                  </label>
                  <input
                    type="time"
                    value={localSettings.quiet_hours_start}
                    onChange={(e) =>
                      handleChange("quiet_hours_start", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End time
                  </label>
                  <input
                    type="time"
                    value={localSettings.quiet_hours_end}
                    onChange={(e) =>
                      handleChange("quiet_hours_end", e.target.value)
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => onSave(localSettings)}
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
              Save Notification Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
