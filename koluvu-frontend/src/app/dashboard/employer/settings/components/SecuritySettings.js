// src/pages/Dashboard/Employer/Settings/components/SecuritySettings.js

import React from "react";
import { Shield, Save } from "lucide-react";

const SecuritySettings = ({ settings, onChange, onSave, isSaving }) => {
  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account security and authentication preferences.
        </p>
      </div>

      <div className="text-center py-12">
        <Shield className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Security Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Two-factor authentication, login settings, and security preferences
          will be available here.
        </p>
      </div>
    </div>
  );
};

export default SecuritySettings;
