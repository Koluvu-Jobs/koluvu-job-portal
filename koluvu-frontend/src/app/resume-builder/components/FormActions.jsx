import React from "react";

export default function FormActions({ setActiveTab, activeTab, onShowDrafts }) {
  return (
    <div className="flex gap-4 mt-4">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setActiveTab("builder")}
        disabled={activeTab === "builder"}
      >
        Builder
      </button>
      <button
        className="px-4 py-2 bg-green-600 text-white rounded"
        onClick={() => setActiveTab("preview")}
        disabled={activeTab === "preview"}
      >
        Preview
      </button>
      <button
        className="px-4 py-2 bg-gray-500 text-white rounded"
        onClick={onShowDrafts}
      >
        Saved Drafts
      </button>
    </div>
  );
}
