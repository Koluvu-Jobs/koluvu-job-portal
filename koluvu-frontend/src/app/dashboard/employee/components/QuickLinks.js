// src/app/main/dashboard/employee/profile/components/QuickLinks.js

import React, { useCallback } from "react";
import {
  User,
  Code,
  BriefcaseBusiness,
  Briefcase,
  GraduationCap,
  FileText,
  BookOpen,
  Lightbulb,
  Share2,
} from "lucide-react";

const QuickLinks = ({ activeTab, setActiveTab, isDarkMode }) => {
  const handleTabClick = useCallback(
    (tab) => {
      setActiveTab(tab);
    },
    [setActiveTab]
  );

  const navItems = [
    { id: "careerObjective", label: "Career Objective", icon: User },
    { id: "keySkills", label: "Key Skills", icon: Code },
    { id: "experience", label: "Experience Details", icon: BriefcaseBusiness },
    {
      id: "internshipExperience",
      label: "Internship Experience",
      icon: Briefcase,
    },
    { id: "education", label: "Education Qualification", icon: GraduationCap },
    {
      id: "technicalQualifications",
      label: "Technical Qualification",
      icon: Code,
    },
    { id: "projects", label: "Project Details", icon: FileText },
    { id: "researches", label: "Any Researches Details", icon: BookOpen },
    { id: "additionalInfo", label: "Strengths & Languages", icon: Lightbulb },
    { id: "social", label: "Social Media Links", icon: Share2 },
    { id: "personalDetails", label: "Personal Details", icon: User },
  ];

  return (
    <nav className="space-y-3">
      {navItems.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            onClick={() => handleTabClick(id)}
            className={`group w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all duration-150 ease-out flex items-center ${
              isActive
                ? isDarkMode
                  ? "bg-blue-600 text-white shadow-md scale-[1.02]"
                  : "bg-blue-100 text-blue-700 shadow-md scale-[1.02]"
                : isDarkMode
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
            style={{
              willChange: "transform, background-color",
              transform: isActive ? "scale(1.02)" : "scale(1)",
            }}
            type="button"
          >
            <Icon
              className={`w-5 h-5 mr-2 transition-colors duration-150 ${
                isActive
                  ? isDarkMode
                    ? "text-white"
                    : "text-blue-700"
                  : isDarkMode
                  ? "text-gray-400 group-hover:text-blue-400"
                  : "text-gray-500 group-hover:text-blue-500"
              }`}
            />
            <span className="select-none">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default React.memo(QuickLinks);
