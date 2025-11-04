// src/app/resume-builder/components/PersonalDetailsSection.jsx
import React from 'react';

const PersonalDetailsSection = ({ formData, handleInputChange }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Personal Details</h2>
            <textarea
                name="personalDetails"
                value={formData.personalDetails}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Provide details like Date of Birth, Nationality, Marital Status, Father's Name etc."
            />
        </div>
    );
};

export default PersonalDetailsSection;
