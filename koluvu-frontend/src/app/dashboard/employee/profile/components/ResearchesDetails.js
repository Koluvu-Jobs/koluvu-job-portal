// src/app/main/dashboard/employee/profile/components/ResearchesDetails.js

import React from 'react';
import { ChevronUp, ChevronDown, UploadCloud, PlusCircle, BookOpen, Globe, FileText } from 'lucide-react';

const ResearchesDetails = ({ 
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
                        Any Researches Details
                    </h3>
                    <button onClick={() => toggleSection('researches')}
                        className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}>
                        {expandedSections.researches ? (
                            <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        ) : (
                            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        )}
                    </button>
                </div>

                {expandedSections.researches && (
                    <div className="space-y-6">
                        {(isEditing ? editData.researches : profileData.researches).map((research, index) => (
                            <div key={index} className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                {isEditing ? (
                                    <>
                                        <input 
                                            type="text"
                                            value={editData.researches[index].title}
                                            onChange={(e) => handleArrayChange('researches', index, 'title', e.target.value)}
                                            className={`w-full p-2 mb-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                            placeholder="Research Title"
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                            <input 
                                                type="text"
                                                value={editData.researches[index].journal}
                                                onChange={(e) => handleArrayChange('researches', index, 'journal', e.target.value)}
                                                className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                                placeholder="Journal"
                                            />
                                            <input 
                                                type="text"
                                                value={editData.researches[index].year}
                                                onChange={(e) => handleArrayChange('researches', index, 'year', e.target.value)}
                                                className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                                placeholder="Year"
                                            />
                                        </div>
                                        <textarea 
                                            value={editData.researches[index].description}
                                            onChange={(e) => handleArrayChange('researches', index, 'description', e.target.value)}
                                            className={`w-full p-2 mb-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                            rows="3"
                                            placeholder="Description"
                                        />
                                        <input 
                                            type="url"
                                            value={editData.researches[index].link}
                                            onChange={(e) => handleArrayChange('researches', index, 'link', e.target.value)}
                                            className={`w-full p-2 mb-2 rounded-md ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                            placeholder="Research Link"
                                        />
                                        <div className="mt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <button 
                                                onClick={() => handleCertificateUpload('researches', index)}
                                                className={`flex items-center space-x-2 text-sm px-3 py-1 rounded-md ${
                                                    isDarkMode ? 'text-teal-400 hover:text-teal-300 bg-gray-600' : 'text-teal-600 hover:text-teal-800 bg-gray-200'
                                                } transition-colors`}
                                            >
                                                <UploadCloud className="w-4 h-4" />
                                                <span>{research.certificate ? 'Change Certificate/Proof' : 'Upload Certificate/Proof'}</span>
                                            </button>
                                            {research.certificate && (
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{research.certificate}</span>
                                            )}
                                            <button 
                                                onClick={() => handleRemoveArrayItem('researches', index)}
                                                className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded-md transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{research.title}</h4>
                                        <p className={`text-md ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                                            <BookOpen className="inline-block w-4 h-4 mr-1 text-gray-500" />
                                            {research.journal}({research.year})
                                        </p>
                                        <p className={`mt-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{research.description}</p>
                                        {research.link && (
                                            <a 
                                                href={research.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center space-x-1 mt-2 text-sm ${
                                                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                                                } transition-colors`}
                                            >
                                                <Globe className="w-4 h-4" />
                                                <span>View Research</span>
                                            </a>
                                        )}
                                        {research.certificate && (
                                            <div className="mt-2 flex items-center">
                                                <FileText className={`w-4 h-4 mr-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{research.certificate}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <button 
                                onClick={() => handleAddArrayItem('researches', {
                                    title: '',
                                    journal: '',
                                    year: '',
                                    description: '',
                                    link: '',
                                    certificate: null
                                })}
                                className={`mt-4 flex items-center space-x-2 px-5 py-2 rounded-lg font-medium transition-colors ${
                                    isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
                                } shadow-md`}
                            >
                                <PlusCircle className="w-5 h-5" />
                                <span>Add Research</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResearchesDetails;
