import React from "react";

const SavedDraftsModal = ({ isOpen, onClose, onLoad }) => {
  const [savedDrafts, setSavedDrafts] = React.useState([]);

  React.useEffect(() => {
    // Load saved drafts from localStorage
    if (typeof window !== "undefined") {
      const drafts = [];
      const autosave = localStorage.getItem("resumeBuilder.autosave");

      if (autosave) {
        try {
          const data = JSON.parse(autosave);
          drafts.push({
            id: "autosave",
            name: "Auto-saved Draft",
            timestamp: data.timestamp || new Date().toISOString(),
            data: data,
          });
        } catch (e) {
          console.error("Error loading autosave:", e);
        }
      }

      // Load any manually saved drafts
      const savedKeys = Object.keys(localStorage).filter((key) =>
        key.startsWith("resumeBuilder.draft.")
      );

      savedKeys.forEach((key) => {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          drafts.push({
            id: key,
            name: data.name || "Unnamed Draft",
            timestamp: data.timestamp || new Date().toISOString(),
            data: data,
          });
        } catch (e) {
          console.error("Error loading draft:", e);
        }
      });

      setSavedDrafts(drafts);
    }
  }, [isOpen]);

  const handleLoadDraft = (draft) => {
    if (onLoad) {
      onLoad(draft.data);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleDeleteDraft = (draftId) => {
    if (typeof window !== "undefined") {
      if (window.confirm("Are you sure you want to delete this draft?")) {
        localStorage.removeItem(draftId);
        setSavedDrafts((prev) => prev.filter((d) => d.id !== draftId));
      }
    }
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return "Unknown date";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Saved Drafts</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {savedDrafts.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-500 text-lg">No saved drafts found</p>
              <p className="text-gray-400 text-sm mt-2">
                Your progress will be automatically saved as you work
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {savedDrafts.map((draft) => (
                <div
                  key={draft.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {draft.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Last saved: {formatDate(draft.timestamp)}
                      </p>
                      {draft.data.personalInfo?.fullName && (
                        <p className="text-sm text-gray-600 mt-1">
                          {draft.data.personalInfo.fullName}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleLoadDraft(draft)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Load
                      </button>
                      {draft.id !== "autosave" && (
                        <button
                          onClick={() => handleDeleteDraft(draft.id)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedDraftsModal;
