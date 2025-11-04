import React from "react";
import CharacterCounter from "./CharacterCounter";

const PROJECT_DESCRIPTION_LIMIT = 350;

export default function ProjectSection({
  formData,
  handleInputChange,
  handleAddProject,
  handleRemoveProject,
}) {
  const projects = formData.projects || [];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Projects</h2>
      {projects.map((p, i) => (
        <div key={i} className="mb-4 border p-4 rounded">
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              className="w-full px-3 py-2 border rounded"
              value={p.title || ""}
              onChange={(e) => handleInputChange(i, "title", e.target.value)}
              placeholder="Project title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded"
              value={p.description || ""}
              onChange={(e) =>
                handleInputChange(i, "description", e.target.value)
              }
              maxLength={PROJECT_DESCRIPTION_LIMIT}
              placeholder="Short description of the project"
            />
            <CharacterCounter
              current={(p.description || "").length}
              limit={PROJECT_DESCRIPTION_LIMIT}
              className="mt-2"
            />
          </div>
          <div className="mt-2 flex justify-end">
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded"
              onClick={() => handleRemoveProject(i)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleAddProject}
        >
          Add Project
        </button>
      </div>
    </div>
  );
}
