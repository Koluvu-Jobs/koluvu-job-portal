// src/app/resume-builder/components/TechnicalQualificationSection.jsx
import React from 'react';

const TechnicalQualificationSection = ({ formData, handleInputChange }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Technical Qualification</h2>
            <textarea
                name="technicalQualifications"
                value={formData.technicalQualifications}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List your technical qualifications, certifications, or courses. (e.g., AWS Certified Developer, Data Science with Python)"
                rows={3}
            />
        </div>
    );
};

export default TechnicalQualificationSection;
