import React from "react";

export default function FormActions({
  setActiveTab,
  activeTab,
  onShowDrafts,
  onSave,
  saveStatus = "idle",
}) {
  const statusBadge = () => {
    if (saveStatus === "saving")
      return (
        <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded">
          Saving...
        </span>
      );
    if (saveStatus === "saved")
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
          Saved
        </span>
      );
    if (saveStatus === "error")
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded">Error</span>
      );
    return null;
  };

  return (
    <div className="flex items-center gap-4 mt-4">
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
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded"
        onClick={onSave}
      >
        Save
      </button>
      <div className="ml-2">{statusBadge()}</div>
    </div>
  );
}
