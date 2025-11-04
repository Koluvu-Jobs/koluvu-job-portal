// src/app/main/dashboard/employee/profile/components/CareerObjective.js

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const CareerObjective = ({ 
    isEditing, 
    isDarkMode, 
    expandedSections, 
    toggleSection, 
    profileData, 
    editData, 
    handleInputChange 
}) => {
    return (
        <div className="space-y-6">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Career Objective
                    </h3>
                    <button onClick={() => toggleSection('careerObjective')}
                        className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}>
                        {expandedSections.careerObjective ? (
                            <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        ) : (
                            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        )}
                    </button>
                </div>
                {expandedSections.careerObjective && (
                    isEditing ? (
                        <textarea 
                            value={editData.careerObjective}
                            onChange={(e) => handleInputChange('careerObjective', e.target.value)}
                            className={`w-full p-3 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                            rows="5"
                        />
                    ) : (
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{profileData.careerObjective}</p>
                    )
                )}
            </div>
        </div>
    );
};

export default CareerObjective;
