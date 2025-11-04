// src/app/resume-builder/components/SummarySection.jsx

'use client';

export default function SummarySection({
  formData,
  handleInputChange,
  handleGenerateSummary,
  isGeneratingSummary
}) {
  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Professional Summary</h2>
      <div>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
          placeholder={`Results-driven professional with 5+ years of experience in [your field]. Proven track record of [key achievement]. Skilled in [top skills]. Passionate about [relevant interest].`}
          rows={6}
        />
        <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <p className="text-sm text-gray-500">
            Write 3-5 sentences highlighting your professional background and key strengths
          </p>
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={isGeneratingSummary}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isGeneratingSummary ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
      </div>
    </div>
  );
}
