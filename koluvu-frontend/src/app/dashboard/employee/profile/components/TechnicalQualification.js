// src/app/main/dashboard/employee/profile/components/TechnicalQualification.js

import React from 'react';
import { ChevronUp, ChevronDown, UploadCloud, PlusCircle, BookOpen } from 'lucide-react';

const TechnicalQualification = ({ 
    isEditing, 
    isDarkMode, 
    expandedSections, 
    toggleSection, 
    profileData, 
    editData, 
    handleArrayChange,
    handleAddArrayItem,
    handleRemoveArrayItem,
    handleCertificateUpload,
    formatDate
}) => {
    return (
        <div className="space-y-6">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Technical Qualification
                    </h3>
                    <button onClick={() => toggleSection('technicalQualifications')}
                        className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}>
                        {expandedSections.technicalQualifications ? (
                            <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        ) : (
                            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        )}
                    </button>
                </div>

                {expandedSections.technicalQualifications && (
                    <div className="space-y-6">
                        {(isEditing ? editData.technicalQualifications : profileData.technicalQualifications).map((techQual, index) => (
                            <div key={index} className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                {isEditing ? (
                                    <>
                                        <input 
                                            type="text"
                                            value={editData.technicalQualifications[index].course}
                                            onChange={(e) => handleArrayChange('technicalQualifications', index, 'course', e.target.value)}
                                            className={`w-full p-2 mb-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                            placeholder="Course"
                                        />
                                        <input 
                                            type="text"
                                            value={editData.technicalQualifications[index].provider}
                                            onChange={(e) => handleArrayChange('technicalQualifications', index, 'provider', e.target.value)}
                                            className={`w-full p-2 mb-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                            placeholder="Provider"
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                            <input 
                                                type="text"
                                                value={editData.technicalQualifications[index].duration}
                                                onChange={(e) => handleArrayChange('technicalQualifications', index, 'duration', e.target.value)}
                                                className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                                placeholder="Duration"
                                            />
                                            <input 
                                                type="date"
                                                value={editData.technicalQualifications[index].completedOn}
                                                onChange={(e) => handleArrayChange('technicalQualifications', index, 'completedOn', e.target.value)}
                                                className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                            />
                                        </div>
                                        <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <button 
                                                onClick={() => handleCertificateUpload('technicalQualifications', index)}
                                                className={`flex items-center space-x-2 text-sm px-3 py-1 rounded-md ${
                                                    isDarkMode ? 'text-teal-400 hover:text-teal-300 bg-gray-600' : 'text-teal-600 hover:text-teal-800 bg-gray-200'
                                                } transition-colors`}
                                            >
                                                <UploadCloud className="w-4 h-4" />
                                                <span>{techQual.certificate ? 'Change Certificate' : 'Upload Certificate'}</span>
                                            </button>
                                            {techQual.certificate && (
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{techQual.certificate}</span>
                                            )}
                                            <button 
                                                onClick={() => handleRemoveArrayItem('technicalQualifications', index)}
                                                className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded-md transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{techQual.course}</h4>
                                        <p className={`text-md ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{techQual.provider}</p>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                                            <BookOpen className="inline-block w-4 h-4 mr-1 text-gray-500" />
                                            {techQual.duration} | Completed: {formatDate(techQual.completedOn)}
                                        </p>
                                        {techQual.certificate && (
                                            <div className="mt-2 flex items-center">
                                                <FileText className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{techQual.certificate}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <button 
                                onClick={() => handleAddArrayItem('technicalQualifications', {
                                    course: '',
                                    provider: '',
                                    duration: '',
                                    completedOn: '',
                                    certificate: null
                                })}
                                className={`mt-4 flex items-center space-x-2 px-5 py-2 rounded-lg font-medium transition-colors ${
                                    isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
                                } shadow-md`}
                            >
                                <PlusCircle className="w-5 h-5" />
                                <span>Add Qualification</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicalQualification;
