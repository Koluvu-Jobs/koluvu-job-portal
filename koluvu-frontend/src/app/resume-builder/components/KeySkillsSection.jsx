// src/app/resume-builder/components/KeySkillsSection.jsx
import React from 'react';

const KeySkillsSection = ({ formData, handleInputChange }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Key Skills</h2>
            <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js, AWS)"
                rows={3}
            />
        </div>
    );
};

export default KeySkillsSection;
