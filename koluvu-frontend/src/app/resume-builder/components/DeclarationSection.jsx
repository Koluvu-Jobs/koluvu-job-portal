// src/app/resume-builder/components/DeclarationSection.jsx
import React from 'react';

const DeclarationSection = ({ formData, handleInputChange }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Declaration</h2>
            <textarea
                name="declaration"
                value={formData.declaration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="I hereby declare that the information given above is true and correct to the best of my knowledge and belief."
            />
        </div>
    );
};

export default DeclarationSection;
