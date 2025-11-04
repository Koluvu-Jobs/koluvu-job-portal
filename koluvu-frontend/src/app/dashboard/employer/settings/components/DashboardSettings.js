// src/pages/Dashboard/Employer/Settings/components/DashboardSettings.js

import React from "react";
import { Layout, Save } from "lucide-react";

const DashboardSettings = ({ settings, onChange, onSave, isSaving }) => {
  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Dashboard Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Customize your dashboard appearance and layout preferences.
        </p>
      </div>

      <div className="text-center py-12">
        <Layout className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Dashboard Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Theme, language, layout, and dashboard customization options will be
          available here.
        </p>
      </div>
    </div>
  );
};

export default DashboardSettings;
