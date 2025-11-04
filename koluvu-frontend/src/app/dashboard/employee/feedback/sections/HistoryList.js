// koluvu-app/src/app/dashboard/employee/feedback/sections/HistoryList.js

"use client";

import { AlertCircle } from "lucide-react";

export default function HistoryList({ submissions }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Submission History</h2>

      {submissions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            No interview feedback submissions yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {s.companyName}
                  </h3>
                  <p className="text-gray-600">
                    {s.position} - {s.department}
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full font-bold">
                  {s.status === "pending" ? "Pending Review" : "Reviewed"}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                  <strong>Interview Date:</strong>
                  <br />
                  {new Date(s.interviewDate).toLocaleDateString()}
                </div>
                <div>
                  <strong>Mode:</strong>
                  <br />
                  {s.interviewMode}
                </div>
                <div>
                  <strong>HR Contact:</strong>
                  <br />
                  {s.hrName}
                </div>
                <div>
                  <strong>Submitted:</strong>
                  <br />
                  {new Date(s.submittedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
