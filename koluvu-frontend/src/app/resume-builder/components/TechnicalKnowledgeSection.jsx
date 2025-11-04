// src/app/resume-builder/components/TechnicalKnowledgeSection.jsx

'use client';

export default function TechnicalKnowledgeSection({
  formData,
  handleInputChange
}) {
  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Technical Knowledge</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Technical Knowledge (Separate with commas) <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          name="technicalKnowledge"
          value={formData.technicalKnowledge}
          onChange={handleInputChange}
          required
          placeholder="Data Structures, Algorithms, OOP Concepts, Database Management, System Design"
          rows={4}
        />
        <p className="mt-1 text-sm text-gray-500">
          List your technical knowledge areas and concepts you're familiar with.
        </p>
      </div>
    </div>
  );
}
