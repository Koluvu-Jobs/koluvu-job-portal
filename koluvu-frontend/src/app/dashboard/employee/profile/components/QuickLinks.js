// src/app/main/dashboard/employee/profile/components/QuickLinks.js

import React from 'react';
import { 
    User, 
    Code, 
    BriefcaseBusiness, 
    Briefcase, 
    GraduationCap, 
    FileText, 
    BookOpen, 
    Lightbulb, 
    Share2 
} from 'lucide-react';

const QuickLinks = ({ activeTab, setActiveTab, isDarkMode }) => {
    return (
        <nav className="space-y-3">
            <button onClick={() => setActiveTab('careerObjective')}
                className={`group w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                    activeTab === 'careerObjective'
                        ? isDarkMode
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-100 text-blue-700 shadow-md'
                        : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}>
                <User className={`w-5 h-5 mr-2 ${activeTab === 'careerObjective' ? (isDarkMode ? 'text-white' : 'text-blue-700') : (isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500')}`} />
                Career Objective
            </button>
            <button onClick={() => setActiveTab('keySkills')}
                className={`group w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                    activeTab === 'keySkills'
                        ? isDarkMode
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-100 text-blue-700 shadow-md'
                        : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}>
                <Code className={`w-5 h-5 mr-2 ${activeTab === 'keySkills' ? (isDarkMode ? 'text-white' : 'text-blue-700') : (isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500')}`} />
                Key Skills
            </button>
            <button onClick={() => setActiveTab('experience')}
                className={`group w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                    activeTab === 'experience'
                        ? isDarkMode
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-100 text-blue-700 shadow-md'
                        : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}>
                <BriefcaseBusiness className={`w-5 h-5 mr-2 ${activeTab === 'experience' ? (isDarkMode ? 'text-white' : 'text-blue-700') : (isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500')}`} />
                Experience Details
            </button>
            <button onClick={() => setActiveTab('internshipExperience')}
                className={`group w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                    activeTab === 'internshipExperience'
                        ? isDarkMode
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-100 text-blue-700 shadow-md'
                        : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}>
                <Briefcase className={`w-5 h-5 mr-2 ${activeTab === 'internshipExperience' ? (isDarkMode ? 'text-white' : 'text-blue-700') : (isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500')}`} />
                Internship Experience
            </button>
            <button onClick={() => setActiveTab('education')}
                className={`group w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                    activeTab === 'education'
                        ? isDarkMode
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-100 text-blue-700 shadow-md'
                        : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}>
                <GraduationCap className={`w-5 h-5 mr-2 ${activeTab === 'education' ? (isDarkMode ? 'text-white' : 'text-blue-700') : (isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500')}`} />
                Education Qualification
            </button>
            <button onClick={() => setActiveTab('technicalQualifications')}
                className={`group w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                    activeTab === 'technicalQualifications'
                        ? isDarkMode
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-100 text-blue-700 shadow-md'
                        : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}>
                <Code className={`w-5 h-5 mr-2 ${activeTab === 'technicalQualifications' ? (isDarkMode ? 'text-white' : 'text-blue-700') : (isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500')}`} />
                Technical Qualification
            </button>
            <button onClick={() => setActiveTab('projects')}
                className={`group w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                    activeTab === 'projects'
                        ? isDarkMode
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-100 text-blue-700 shadow-md'
                        : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}>
                <FileText className={`w-5 h-5 mr-2 ${activeTab === 'projects' ? (isDarkMode ? 'text-white' : 'text-blue-700') : (isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500')}`} />
                Project Details
            </button>
            <button onClick={() => setActiveTab('researches')}
                className={`group w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                    activeTab === 'researches'
                        ? isDarkMode
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-100 text-blue-700 shadow-md'
                        : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}>
                <BookOpen className={`w-5 h-5 mr-2 ${activeTab === 'researches' ? (isDarkMode ? 'text-white' : 'text-blue-700') : (isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500')}`} />
                Any Researches Details
            </button>
            <button onClick={() => setActiveTab('additionalInfo')}
                className={`group w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                    activeTab === 'additionalInfo'
                        ? isDarkMode
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-100 text-blue-700 shadow-md'
                        : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}>
                <Lightbulb className={`w-5 h-5 mr-2 ${activeTab === 'additionalInfo' ? (isDarkMode ? 'text-white' : 'text-blue-700') : (isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500')}`} />
                Strengths & Languages
            </button>
            <button onClick={() => setActiveTab('social')}
                className={`group w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                    activeTab === 'social'
                        ? isDarkMode
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-100 text-blue-700 shadow-md'
                        : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}>
                <Share2 className={`w-5 h-5 mr-2 ${activeTab === 'social' ? (isDarkMode ? 'text-white' : 'text-blue-700') : (isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500')}`} />
                Social Media Links
            </button>
            <button onClick={() => setActiveTab('personalDetails')}
                className={`group w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center ${
                    activeTab === 'personalDetails'
                        ? isDarkMode
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-100 text-blue-700 shadow-md'
                        : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}>
                <User className={`w-5 h-5 mr-2 ${activeTab === 'personalDetails' ? (isDarkMode ? 'text-white' : 'text-blue-700') : (isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500')}`} />
                Personal Details
            </button>
        </nav>
    );
};

export default QuickLinks;
