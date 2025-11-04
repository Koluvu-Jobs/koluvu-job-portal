import React from "react";
import CharacterCounter from "./CharacterCounter";

const INTERNSHIP_DESCRIPTION_LIMIT = 350;

export default function InternshipSection({
  formData,
  handleInputChange,
  handleAddInternship,
  handleRemoveInternship,
}) {
  const internships = formData.internships || [];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Internships</h2>
      {internships.map((it, i) => (
        <div key={i} className="mb-4 border p-4 rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            <input
              className="px-3 py-2 border rounded"
              value={it.position || ""}
              onChange={(e) => handleInputChange(i, "position", e.target.value)}
              placeholder="Position"
            />
            <input
              className="px-3 py-2 border rounded"
              value={it.company || ""}
              onChange={(e) => handleInputChange(i, "company", e.target.value)}
              placeholder="Company"
            />
          </div>
          <div className="mb-2">
            <input
              className="w-full px-3 py-2 border rounded"
              value={it.duration || ""}
              onChange={(e) => handleInputChange(i, "duration", e.target.value)}
              placeholder="Duration (e.g., Jun 2022 - Aug 2022)"
            />
          </div>
          <div>
            <textarea
              className="w-full px-3 py-2 border rounded"
              value={it.description || ""}
              onChange={(e) =>
                handleInputChange(i, "description", e.target.value)
              }
              maxLength={INTERNSHIP_DESCRIPTION_LIMIT}
              placeholder="Brief description of responsibilities and achievements"
            />
            <CharacterCounter
              current={(it.description || "").length}
              limit={INTERNSHIP_DESCRIPTION_LIMIT}
              className="mt-2"
            />
          </div>
          <div className="mt-2 flex justify-end">
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded"
              onClick={() => handleRemoveInternship(i)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleAddInternship}
        >
          Add Internship
        </button>
      </div>
    </div>
  );
}
