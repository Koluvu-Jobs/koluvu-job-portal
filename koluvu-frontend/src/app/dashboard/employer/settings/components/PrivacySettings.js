// src/pages/Dashboard/Employer/Settings/components/PrivacySettings.js

import React from "react";
import { Eye, Save } from "lucide-react";

const PrivacySettings = ({ settings, onChange, onSave, isSaving }) => {
  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Control your data sharing and privacy preferences.
        </p>
      </div>

      <div className="text-center py-12">
        <Eye className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Privacy Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Data sharing, candidate data retention, and privacy controls will be
          available here.
        </p>
      </div>
    </div>
  );
};

export default PrivacySettings;
