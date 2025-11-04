import React from 'react';

const EducationSection = ({ formData, handleInputChange, handleAddEducation, handleRemoveEducation }) => {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-indigo-100 p-2 rounded-lg mr-3">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          </svg>
        </span>
        Education
      </h2>

      <div className="space-y-6">
        {formData.educations.map((education, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 relative">
            {formData.educations.length > 1 && (
              <button
                onClick={() => handleRemoveEducation(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                title="Remove this education"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree/Program <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={education.degree}
                  onChange={(e) => handleInputChange(index, 'degree', e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution/College
                </label>
                <input
                  type="text"
                  value={education.college}
                  onChange={(e) => handleInputChange(index, 'college', e.target.value)}
                  placeholder="University of Technology"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University (if different)
                </label>
                <input
                  type="text"
                  value={education.university}
                  onChange={(e) => handleInputChange(index, 'university', e.target.value)}
                  placeholder="State University"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CGPA/Percentage
                </label>
                <input
                  type="text"
                  value={education.cgpa}
                  onChange={(e) => handleInputChange(index, 'cgpa', e.target.value)}
                  placeholder="8.5 CGPA or 85%"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="text"
                  value={education.startDate}
                  onChange={(e) => handleInputChange(index, 'startDate', e.target.value)}
                  placeholder="2020"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date/Graduation Year
                </label>
                <input
                  type="text"
                  value={education.endDate}
                  onChange={(e) => handleInputChange(index, 'endDate', e.target.value)}
                  placeholder="2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddEducation}
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Another Education
      </button>
    </section>
  );
};

export default EducationSection;