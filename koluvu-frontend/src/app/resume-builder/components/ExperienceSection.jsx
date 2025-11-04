import React from "react";
import CharacterCounter from "./CharacterCounter";

const EXPERIENCE_DESCRIPTION_LIMIT = 400;

const ExperienceSection = ({
  formData,
  handleInputChange,
  handleAddExperience,
  handleRemoveExperience,
}) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-orange-100 p-2 rounded-lg mr-3">
          <svg
            className="w-6 h-6 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z"
            />
          </svg>
        </span>
        Work Experience
      </h2>

      <div className="space-y-6">
        {formData.experiences.map((experience, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 relative"
          >
            {formData.experiences.length > 1 && (
              <button
                onClick={() => handleRemoveExperience(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                title="Remove this experience"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title/Designation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={experience.designation}
                  onChange={(e) =>
                    handleInputChange(index, "designation", e.target.value)
                  }
                  placeholder="Software Engineer"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={experience.companyName}
                  onChange={(e) =>
                    handleInputChange(index, "companyName", e.target.value)
                  }
                  placeholder="Tech Company Inc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="text"
                  value={experience.startDate}
                  onChange={(e) =>
                    handleInputChange(index, "startDate", e.target.value)
                  }
                  placeholder="Jan 2022"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="text"
                  value={experience.endDate}
                  onChange={(e) =>
                    handleInputChange(index, "endDate", e.target.value)
                  }
                  placeholder="Present"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Responsibilities & Achievements
              </label>
              <textarea
                value={experience.responsibilities}
                onChange={(e) =>
                  handleInputChange(index, "responsibilities", e.target.value)
                }
                rows={4}
                maxLength={EXPERIENCE_DESCRIPTION_LIMIT}
                placeholder="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver projects on time&#10;• Improved system performance by 30% through code optimization"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              />
              <CharacterCounter
                current={(experience.responsibilities || "").length}
                limit={EXPERIENCE_DESCRIPTION_LIMIT}
                className="mt-2"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddExperience}
        className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add Another Experience
      </button>
    </section>
  );
};

export default ExperienceSection;
