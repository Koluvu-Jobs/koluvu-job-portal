// src/pages/Dashboard/Employer/Settings/components/IntegrationSettings.js

import React from "react";
import { Link, Save } from "lucide-react";

const IntegrationSettings = ({ settings, onChange, onSave, isSaving }) => {
  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          Integration Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Connect with third-party services and applications.
        </p>
      </div>

      <div className="text-center py-12">
        <Link className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Integration Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          LinkedIn, email, calendar, and ATS integrations will be available
          here.
        </p>
      </div>
    </div>
  );
};

export default IntegrationSettings;
