// koluvu-app/src/app/dashboard/employee/feedback/sections/DashboardSection.js

"use client";
import { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";

export default function DashboardSection({ onGoToFeedback }) {
  const [hasAttendedInterview, setHasAttendedInterview] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Interview Status Dashboard
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-bold mb-3">Have you attended an interview?</h3>
        <div className="flex gap-4">
          <button
            onClick={() => setHasAttendedInterview(true)}
            className="px-6 py-2 rounded bg-green-500 text-white"
          >
            Yes
          </button>
          <button
            onClick={() => setHasAttendedInterview(false)}
            className="px-6 py-2 rounded bg-red-500 text-white"
          >
            No
          </button>
        </div>
      </div>

      {hasAttendedInterview ? (
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center mb-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-bold text-blue-800">
              Interview Feedback Required
            </h3>
          </div>
          <button
            onClick={onGoToFeedback}
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            Submit Details
          </button>
        </div>
      ) : (
        <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 flex items-center">
          <Clock className="w-5 h-5 text-amber-600 mr-2" />
          <p>No Interview Yet</p>
        </div>
      )}
    </div>
  );
}
