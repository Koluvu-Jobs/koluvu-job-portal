// src/app/main/dashboard/employee/profile/components/AdditionalInformation.js

import React from 'react';
import { ChevronUp, ChevronDown, PlusCircle, X, Award, Flag, Smile, Lightbulb } from 'lucide-react';

const AdditionalInformation = ({ 
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
                        Additional Information
                    </h3>
                    <button onClick={() => toggleSection('additionalInfo')}
                        className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}>
                        {expandedSections.additionalInfo ? (
                            <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        ) : (
                            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        )}
                    </button>
                </div>

                {expandedSections.additionalInfo && (
                    <div className="space-y-6">
                        <div>
                            <h4 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Strengths</h4>
                            {isEditing ? (
                                <div className="flex flex-wrap gap-3">
                                    {editData.strengths.map((strength, index) => (
                                        <div key={index} className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                                            isDarkMode ? 'bg-purple-700/30 text-purple-300' : 'bg-purple-100 text-purple-700'
                                        } shadow-sm`}>
                                            <input 
                                                type="text" 
                                                value={strength}
                                                onChange={(e) => {
                                                    const newStrengths = [...editData.strengths];
                                                    newStrengths[index] = e.target.value;
                                                    handleInputChange('strengths', newStrengths);
                                                }}
                                                className={`bg-transparent border-none outline-none w-auto ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}
                                            />
                                            <button 
                                                onClick={() => handleRemoveArrayItem('strengths', index)}
                                                className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => handleAddArrayItem('strengths', '')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                                            isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        } transition-colors shadow-sm`}
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        <span>Add Strength</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {profileData.strengths.map((strength, index) => (
                                        <span key={index} className={`px-4 py-2 rounded-full text-sm font-medium ${
                                            isDarkMode ? 'bg-purple-700/30 text-purple-300' : 'bg-purple-100 text-purple-700'
                                        } shadow-sm`}>{strength}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <h4 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Achievements</h4>
                            {isEditing ? (
                                <ul className="list-disc list-inside space-y-2">
                                    {editData.achievements.map((achievement, index) => (
                                        <li key={index} className="flex items-center">
                                            <input 
                                                type="text" 
                                                value={achievement}
                                                onChange={(e) => {
                                                    const newAchievements = [...editData.achievements];
                                                    newAchievements[index] = e.target.value;
                                                    handleInputChange('achievements', newAchievements);
                                                }}
                                                className={`bg-transparent border-none outline-none w-full ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                                            />
                                            <button 
                                                onClick={() => handleRemoveArrayItem('achievements', index)}
                                                className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </li>
                                    ))}
                                    <button 
                                        onClick={() => handleAddArrayItem('achievements', '')}
                                        className={`mt-2 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                                            isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        } transition-colors shadow-sm`}
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        <span>Add Achievement</span>
                                    </button>
                                </ul>
                            ) : (
                                <ul className="list-disc list-inside space-y-2">
                                    {profileData.achievements.map((achievement, index) => (
                                        <li key={index} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            <Award className="inline-block w-4 h-4 mr-1 text-gray-500" />
                                            {achievement}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div>
                            <h4 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Language Known</h4>
                            {isEditing ? (
                                <div className="flex flex-wrap gap-3">
                                    {editData.languages.map((language, index) => (
                                        <div key={index} className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                                            isDarkMode ? 'bg-yellow-700/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                                        } shadow-sm`}>
                                            <input 
                                                type="text" 
                                                value={language}
                                                onChange={(e) => {
                                                    const newLanguages = [...editData.languages];
                                                    newLanguages[index] = e.target.value;
                                                    handleInputChange('languages', newLanguages);
                                                }}
                                                className={`bg-transparent border-none outline-none w-auto ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}
                                            />
                                            <button 
                                                onClick={() => handleRemoveArrayItem('languages', index)}
                                                className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => handleAddArrayItem('languages', '')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                                            isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        } transition-colors shadow-sm`}
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        <span>Add Language</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {profileData.languages.map((language, index) => (
                                        <span key={index} className={`px-4 py-2 rounded-full text-sm font-medium ${
                                            isDarkMode ? 'bg-yellow-700/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                                        } shadow-sm`}>{language}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <h4 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Hobbies</h4>
                            {isEditing ? (
                                <div className="flex flex-wrap gap-3">
                                    {editData.hobbies.map((hobby, index) => (
                                        <div key={index} className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                                            isDarkMode ? 'bg-pink-700/30 text-pink-300' : 'bg-pink-100 text-pink-700'
                                        } shadow-sm`}>
                                            <input 
                                                type="text" 
                                                value={hobby}
                                                onChange={(e) => {
                                                    const newHobbies = [...editData.hobbies];
                                                    newHobbies[index] = e.target.value;
                                                    handleInputChange('hobbies', newHobbies);
                                                }}
                                                className={`bg-transparent border-none outline-none w-auto ${isDarkMode ? 'text-pink-300' : 'text-pink-700'}`}
                                            />
                                            <button 
                                                onClick={() => handleRemoveArrayItem('hobbies', index)}
                                                className="ml-2 text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        onClick={() => handleAddArrayItem('hobbies', '')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                                            isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        } transition-colors shadow-sm`}
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        <span>Add Hobby</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {profileData.hobbies.map((hobby, index) => (
                                        <span key={index} className={`px-4 py-2 rounded-full text-sm font-medium ${
                                            isDarkMode ? 'bg-pink-700/30 text-pink-300' : 'bg-pink-100 text-pink-700'
                                        } shadow-sm`}>{hobby}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdditionalInformation;
