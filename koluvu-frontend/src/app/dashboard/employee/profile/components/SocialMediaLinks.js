// src/app/main/dashboard/employee/profile/components/SocialMediaLinks.js

import React from 'react';
import { Github, Linkedin, Twitter, Globe } from 'lucide-react';

const SocialMediaLinks = ({ 
    isEditing, 
    isDarkMode, 
    profileData, 
    editData, 
    handleNestedInputChange,
    socialIcons
}) => {
    return (
        <div className="space-y-6">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Social Media Links
                </h3>
                <div className="space-y-4">
                    {Object.entries(profileData.socialLinks).map(([platform, url]) => (
                        <div key={platform} className="flex items-center">
                            <div className={`w-10 h-10 flex items-center justify-center mr-4 rounded-full ${
                                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                            } flex-shrink-0`}>
                                {socialIcons[platform] || <Globe className="w-5 h-5" />}
                            </div>
                            {isEditing ? (
                                <input 
                                    type="text"
                                    value={editData.socialLinks[platform]}
                                    onChange={(e) => handleNestedInputChange('socialLinks', platform, e.target.value)}
                                    className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'} focus:ring-blue-500 outline-none`}
                                />
                            ) : (
                                <a 
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`hover:underline ${
                                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                    } flex-grow text-lg truncate`}
                                >
                                    {url}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocialMediaLinks;
