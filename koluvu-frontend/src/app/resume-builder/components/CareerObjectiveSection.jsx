import React from "react";
import CharacterCounter from "./CharacterCounter";

const SUMMARY_LIMIT = 600;

const CareerObjectiveSection = ({ formData, handleInputChange }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-green-100 p-2 rounded-lg mr-3">
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        Professional Summary / Career Objective
      </h2>

      <div>
        <label
          htmlFor="summary"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Write a compelling summary of your professional background, skills,
          and career goals
        </label>
        <textarea
          id="summary"
          value={formData.summary || ""}
          onChange={handleInputChange}
          rows={6}
          maxLength={SUMMARY_LIMIT}
          placeholder="Write 3-5 sentences highlighting your experience, key skills, and what you bring to the role. Focus on your most relevant accomplishments and career objectives."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-colors resize-none"
        />
        <CharacterCounter
          current={(formData.summary || "").length}
          limit={SUMMARY_LIMIT}
          className="mt-2"
        />
      </div>

      <div className="mt-6 p-3 bg-gray-50 border-l-4 border-green-500 rounded">
        <div className="flex gap-3">
          <span className="text-green-500 text-lg">💡</span>
          <div className="flex-1">
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="text-gray-900">Writing guide:</strong> Lead
              with experience • Highlight key achievements • Keep it under 200
              words
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerObjectiveSection;
