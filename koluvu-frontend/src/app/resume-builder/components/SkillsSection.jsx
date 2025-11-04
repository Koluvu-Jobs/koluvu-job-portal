import React from "react";
import CharacterCounter from "./CharacterCounter";

const SKILL_CATEGORY_LIMIT = 100; // Per category skills

const SkillsSection = ({
  formData,
  handleInputChange,
  handleAddSkillCategory,
  handleRemoveSkillCategory,
}) => {
  // Initialize skill categories if not present
  const skillCategories = formData.skillCategories || [
    { category: "", skills: "" },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-purple-100 p-2 rounded-lg mr-3">
          <svg
            className="w-6 h-6 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </span>
        Skills & Competencies
      </h2>

      <div className="space-y-6">
        {skillCategories.map((category, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 relative bg-white"
          >
            {skillCategories.length > 1 && (
              <button
                onClick={() => handleRemoveSkillCategory(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                title="Remove this skill category"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category / Subheading{" "}
                <span className="text-purple-600 text-xs">
                  (e.g., Technical Skills, Soft Skills, Languages)
                </span>
              </label>
              <input
                type="text"
                value={category.category || ""}
                onChange={(e) =>
                  handleInputChange(index, "category", e.target.value)
                }
                placeholder="e.g., Programming Languages, Design Tools, Soft Skills"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills{" "}
                <span className="text-purple-600 text-xs">
                  (Separate with commas)
                </span>
              </label>
              <textarea
                value={category.skills || ""}
                onChange={(e) =>
                  handleInputChange(index, "skills", e.target.value)
                }
                rows={3}
                maxLength={SKILL_CATEGORY_LIMIT}
                placeholder="JavaScript, React, Node.js, Python, Django, PostgreSQL"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors resize-none"
              />
              <CharacterCounter
                current={(category.skills || "").length}
                limit={SKILL_CATEGORY_LIMIT}
                className="mt-2"
              />
              <p className="mt-2 text-xs text-gray-500">
                Skills in this category:{" "}
                {category.skills
                  ? category.skills.split(",").filter((s) => s.trim()).length
                  : 0}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddSkillCategory}
        className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center shadow-sm"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add Skill Category
      </button>

      <div className="mt-6 p-4 bg-purple-50 border-l-4 border-purple-500 rounded-lg">
        <div className="flex gap-3">
          <span className="text-purple-500 text-xl">💡</span>
          <div className="flex-1">
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              <strong className="text-gray-900">
                How to organize your skills:
              </strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>
                <strong>Technical Skills:</strong> JavaScript, React, Python,
                SQL, Git
              </li>
              <li>
                <strong>Design Tools:</strong> Figma, Adobe XD, Photoshop,
                Illustrator
              </li>
              <li>
                <strong>Soft Skills:</strong> Leadership, Communication, Problem
                Solving
              </li>
              <li>
                <strong>Languages:</strong> English (Native), Spanish (Fluent),
                French (Basic)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
