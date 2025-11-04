// src/app/resume-builder/components/LanguageSection.jsx
import React from 'react';

const LanguageSection = ({ formData, handleInputChange }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Languages Known</h2>
            <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter languages separated by commas (e.g., English, Hindi, Spanish)"
            />
        </div>
    );
};

export default LanguageSection;
