// src/app/main/dashboard/employee/profile/components/EducationQualification.js

import React from 'react';
import { ChevronUp, ChevronDown, UploadCloud, PlusCircle, Award } from 'lucide-react';

const EducationQualification = ({ 
    isEditing, 
    isDarkMode, 
    expandedSections, 
    toggleSection, 
    profileData, 
    editData, 
    handleArrayChange,
    handleAddArrayItem,
    handleRemoveArrayItem,
    handleCertificateUpload
}) => {
    return (
        <div className="space-y-6">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Education Qualification
                    </h3>
                    <button onClick={() => toggleSection('education')}
                        className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}>
                        {expandedSections.education ? (
                            <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        ) : (
                            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        )}
                    </button>
                </div>

                {expandedSections.education && (
                    <div className="space-y-6">
                        {(isEditing ? editData.education : profileData.education).map((edu, index) => (
                            <div key={index} className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                {isEditing ? (
                                    <>
                                        <input 
                                            type="text"
                                            value={editData.education[index].degree}
                                            onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                                            className={`w-full p-2 mb-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                            placeholder="Degree"
                                        />
                                        <input 
                                            type="text"
                                            value={editData.education[index].university}
                                            onChange={(e) => handleArrayChange('education', index, 'university', e.target.value)}
                                            className={`w-full p-2 mb-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                            placeholder="University"
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                            <input 
                                                type="text"
                                                value={editData.education[index].year}
                                                onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                                                className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                                placeholder="Year"
                                            />
                                            <input 
                                                type="text"
                                                value={editData.education[index].score}
                                                onChange={(e) => handleArrayChange('education', index, 'score', e.target.value)}
                                                className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                                placeholder="Score"
                                            />
                                        </div>
                                        <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <button 
                                                onClick={() => handleCertificateUpload('education', index)}
                                                className={`flex items-center space-x-2 text-sm px-3 py-1 rounded-md ${
                                                    isDarkMode ? 'text-teal-400 hover:text-teal-300 bg-gray-600' : 'text-teal-600 hover:text-teal-800 bg-gray-200'
                                                } transition-colors`}
                                            >
                                                <UploadCloud className="w-4 h-4" />
                                                <span>{edu.certificate ? 'Change Certificate' : 'Upload Certificate'}</span>
                                            </button>
                                            {edu.certificate && (
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{edu.certificate}</span>
                                            )}
                                            <button 
                                                onClick={() => handleRemoveArrayItem('education', index)}
                                                className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded-md transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{edu.degree}</h4>
                                        <p className={`text-md ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{edu.university}</p>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                                            <Award className="inline-block w-4 h-4 mr-1 text-gray-500" />
                                            {edu.year} | {edu.score}
                                        </p>
                                        {edu.certificate && (
                                            <div className="mt-2 flex items-center">
                                                <FileText className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{edu.certificate}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <button 
                                onClick={() => handleAddArrayItem('education', {
                                    degree: '',
                                    university: '',
                                    year: '',
                                    score: '',
                                    certificate: null
                                })}
                                className={`mt-4 flex items-center space-x-2 px-5 py-2 rounded-lg font-medium transition-colors ${
                                    isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
                                } shadow-md`}
                            >
                                <PlusCircle className="w-5 h-5" />
                                <span>Add Education</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EducationQualification;
