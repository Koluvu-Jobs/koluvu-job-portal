// src/app/main/dashboard/employee/profile/components/KeySkills.js

import React from 'react';
import { ChevronUp, ChevronDown, PlusCircle, X } from 'lucide-react';

const KeySkills = ({ 
    isEditing, 
    isDarkMode, 
    expandedSections, 
    toggleSection, 
    profileData, 
    editData, 
    handleInputChange,
    handleAddArrayItem,
    handleRemoveArrayItem
}) => {
    return (
        <div className="space-y-6">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Key Skills
                    </h3>
                    <button onClick={() => toggleSection('keySkills')}
                        className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}>
                        {expandedSections.keySkills ? (
                            <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        ) : (
                            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        )}
                    </button>
                </div>
                {expandedSections.keySkills && (
                    isEditing ? (
                        <div className="flex flex-wrap gap-3">
                            {editData.keySkills.map((skill, index) => (
                                <div key={index} className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                                    isDarkMode ? 'bg-blue-700/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                                } shadow-sm`}>
                                    <input 
                                        type="text" 
                                        value={skill}
                                        onChange={(e) => {
                                            const newSkills = [...editData.keySkills];
                                            newSkills[index] = e.target.value;
                                            handleInputChange('keySkills', newSkills);
                                        }}
                                        className={`bg-transparent border-none outline-none w-auto ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}
                                    />
                                    <button 
                                        onClick={() => handleRemoveArrayItem('keySkills', index)}
                                        className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            <button 
                                onClick={() => handleAddArrayItem('keySkills', '')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                                    isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                } transition-colors shadow-sm`}
                            >
                                <PlusCircle className="w-4 h-4" />
                                <span>Add Skill</span>
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {profileData.keySkills.map((skill, index) => (
                                <span key={index} className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    isDarkMode ? 'bg-blue-700/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                                } shadow-sm`}>{skill}</span>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default KeySkills;
