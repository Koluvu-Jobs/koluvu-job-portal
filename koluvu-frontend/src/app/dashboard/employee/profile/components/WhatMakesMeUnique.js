// src/app/dashboard/employee/profile/components/WhatMakesMeUnique.js

import React, { useState } from 'react';
import { Star, Edit3, Save, X, Plus, Trash2, Lightbulb, Award, Target, Heart } from 'lucide-react';

const WhatMakesMeUnique = ({ isDarkMode, profileData, isEditing, handleNestedInputChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) => {
    const [newUniqueTrait, setNewUniqueTrait] = useState('');
    const [newAchievement, setNewAchievement] = useState('');

    const uniqueTraits = profileData.uniqueTraits || [
        "Problem-solving mindset with creative solutions",
        "Strong leadership skills in cross-functional teams",
        "Passionate about continuous learning and innovation",
        "Excellent communication across technical and non-technical stakeholders"
    ];

    const personalAchievements = profileData.personalAchievements || [
        "Led a team of 5 developers to deliver a project 2 weeks ahead of schedule",
        "Implemented cost-saving solution that reduced server costs by 30%",
        "Mentored 10+ junior developers in their career growth",
        "Speaker at 3 tech conferences and 5 meetups"
    ];

    const addUniqueTrait = () => {
        if (newUniqueTrait.trim()) {
            handleAddArrayItem('uniqueTraits', newUniqueTrait.trim());
            setNewUniqueTrait('');
        }
    };

    const addAchievement = () => {
        if (newAchievement.trim()) {
            handleAddArrayItem('personalAchievements', newAchievement.trim());
            setNewAchievement('');
        }
    };

    return (
        <div className={`rounded-xl shadow-lg border p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className={`p-2 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'} mr-3`}>
                        <Star className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        What Makes Me Unique
                    </h2>
                </div>
            </div>

            <div className="space-y-8">
                {/* Unique Traits Section */}
                <div>
                    <div className="flex items-center mb-4">
                        <Lightbulb className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Unique Strengths & Traits
                        </h3>
                    </div>
                    
                    <div className="grid gap-3">
                        {uniqueTraits.map((trait, index) => (
                            <div key={index} className={`p-4 rounded-lg border flex items-start justify-between ${
                                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                            }`}>
                                {isEditing ? (
                                    <div className="flex-1 flex items-center gap-2">
                                        <textarea
                                            value={trait}
                                            onChange={(e) => handleArrayChange('uniqueTraits', index, 'value', e.target.value)}
                                            className={`flex-1 p-2 rounded border resize-none ${
                                                isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                            rows={2}
                                        />
                                        <button
                                            onClick={() => handleRemoveArrayItem('uniqueTraits', index)}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-start">
                                        <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${isDarkMode ? 'bg-purple-400' : 'bg-purple-500'}`} />
                                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {trait}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {isEditing && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newUniqueTrait}
                                    onChange={(e) => setNewUniqueTrait(e.target.value)}
                                    placeholder="Add a unique trait..."
                                    className={`flex-1 p-2 rounded border ${
                                        isDarkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    }`}
                                    onKeyPress={(e) => e.key === 'Enter' && addUniqueTrait()}
                                />
                                <button
                                    onClick={addUniqueTrait}
                                    className={`px-3 py-2 rounded ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Personal Achievements Section */}
                <div>
                    <div className="flex items-center mb-4">
                        <Award className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            Key Achievements
                        </h3>
                    </div>
                    
                    <div className="grid gap-3">
                        {personalAchievements.map((achievement, index) => (
                            <div key={index} className={`p-4 rounded-lg border flex items-start justify-between ${
                                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                            }`}>
                                {isEditing ? (
                                    <div className="flex-1 flex items-center gap-2">
                                        <textarea
                                            value={achievement}
                                            onChange={(e) => handleArrayChange('personalAchievements', index, 'value', e.target.value)}
                                            className={`flex-1 p-2 rounded border resize-none ${
                                                isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                            rows={2}
                                        />
                                        <button
                                            onClick={() => handleRemoveArrayItem('personalAchievements', index)}
                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-start">
                                        <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${isDarkMode ? 'bg-green-400' : 'bg-green-500'}`} />
                                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {achievement}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {isEditing && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newAchievement}
                                    onChange={(e) => setNewAchievement(e.target.value)}
                                    placeholder="Add an achievement..."
                                    className={`flex-1 p-2 rounded border ${
                                        isDarkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    }`}
                                    onKeyPress={(e) => e.key === 'Enter' && addAchievement()}
                                />
                                <button
                                    onClick={addAchievement}
                                    className={`px-3 py-2 rounded ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Personal Mission Section */}
                <div>
                    <div className="flex items-center mb-4">
                        <Target className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                            My Professional Mission
                        </h3>
                    </div>
                    
                    <div className={`p-4 rounded-lg border ${
                        isDarkMode ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-800' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                    }`}>
                        {isEditing ? (
                            <textarea
                                value={profileData.professionalMission || "To leverage technology and innovation to create meaningful solutions that positively impact businesses and communities while continuously growing as a professional and leader."}
                                onChange={(e) => handleNestedInputChange('professionalMission', e.target.value)}
                                className={`w-full p-3 rounded border resize-none ${
                                    isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                                rows={3}
                                placeholder="Describe your professional mission..."
                            />
                        ) : (
                            <div className="flex items-start">
                                <Heart className={`w-5 h-5 mr-3 mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
                                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} italic leading-relaxed`}>
                                    "{profileData.professionalMission || "To leverage technology and innovation to create meaningful solutions that positively impact businesses and communities while continuously growing as a professional and leader."}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatMakesMeUnique;
