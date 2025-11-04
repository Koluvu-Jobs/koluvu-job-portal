// src/components/enhanced/ProfileProgress.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Circle,
  User,
  FileText,
  Camera,
  Award,
} from "lucide-react";

const ProfileProgress = ({ userProfile = {} }) => {
  const steps = [
    {
      id: "basic-info",
      title: "Basic Information",
      description: "Name, email, phone number",
      icon: User,
      completed: userProfile.hasBasicInfo || false,
      required: true,
    },
    {
      id: "photo",
      title: "Profile Photo",
      description: "Upload a professional photo",
      icon: Camera,
      completed: userProfile.hasPhoto || false,
      required: false,
    },
    {
      id: "resume",
      title: "Resume/CV",
      description: "Upload your latest resume",
      icon: FileText,
      completed: userProfile.hasResume || false,
      required: true,
    },
    {
      id: "skills",
      title: "Skills & Experience",
      description: "Add your technical skills",
      icon: Award,
      completed: userProfile.hasSkills || false,
      required: true,
    },
  ];

  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const getProgressColor = () => {
    if (progressPercentage >= 80) return "text-green-600";
    if (progressPercentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressBgColor = () => {
    if (progressPercentage >= 80) return "bg-green-600";
    if (progressPercentage >= 50) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Profile Completion</span>
          <span className={`text-2xl font-bold ${getProgressColor()}`}>
            {Math.round(progressPercentage)}%
          </span>
        </CardTitle>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressBgColor()}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-sm text-gray-600 mb-4">
          Complete your profile to improve your visibility to employers
        </div>

        <div className="space-y-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <h4
                      className={`text-sm font-medium ${
                        step.completed ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {step.title}
                      {step.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h4>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>

                  {!step.completed && (
                    <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                      Complete now →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {progressPercentage < 100 && (
          <div className="mt-6 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-blue-800 font-medium">
                Pro Tip:
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Profiles with 80%+ completion receive 3x more interview
              invitations!
            </p>
          </div>
        )}

        {progressPercentage === 100 && (
          <div className="mt-6 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800 font-medium">
                Profile Complete!
              </span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your profile is now optimized for maximum visibility.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileProgress;
