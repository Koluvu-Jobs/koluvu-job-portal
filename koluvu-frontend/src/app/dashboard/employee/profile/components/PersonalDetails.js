// src/app/main/dashboard/employee/profile/components/PersonalDetails.js

import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const PersonalDetails = ({ 
    isEditing, 
    isDarkMode, 
    expandedSections, 
    toggleSection, 
    profileData, 
    editData, 
    handleNestedInputChange,
    formatDate
}) => {
    return (
        <div className="space-y-6">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Personal Details
                    </h3>
                    <button onClick={() => toggleSection('personalDetails')}
                        className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}>
                        {expandedSections.personalDetails ? (
                            <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        ) : (
                            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        )}
                    </button>
                </div>

                {expandedSections.personalDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Date of Birth</p>
                            {isEditing ? (
                                <input 
                                    type="date"
                                    value={editData.personalDetails.dob}
                                    onChange={(e) => handleNestedInputChange('personalDetails', 'dob', e.target.value)}
                                    className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                />
                            ) : (
                                <p className={`font-medium text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {formatDate(profileData.personalDetails.dob)}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Nationality</p>
                            {isEditing ? (
                                <input 
                                    type="text"
                                    value={editData.personalDetails.nationality}
                                    onChange={(e) => handleNestedInputChange('personalDetails', 'nationality', e.target.value)}
                                    className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                />
                            ) : (
                                <p className={`font-medium text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {profileData.personalDetails.nationality}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Marital Status</p>
                            {isEditing ? (
                                <input 
                                    type="text"
                                    value={editData.personalDetails.maritalStatus}
                                    onChange={(e) => handleNestedInputChange('personalDetails', 'maritalStatus', e.target.value)}
                                    className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                />
                            ) : (
                                <p className={`font-medium text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {profileData.personalDetails.maritalStatus}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Address</p>
                            {isEditing ? (
                                <textarea 
                                    value={editData.personalDetails.address}
                                    onChange={(e) => handleNestedInputChange('personalDetails', 'address', e.target.value)}
                                    className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                    rows="2"
                                />
                            ) : (
                                <p className={`font-medium text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {profileData.personalDetails.address}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonalDetails;
