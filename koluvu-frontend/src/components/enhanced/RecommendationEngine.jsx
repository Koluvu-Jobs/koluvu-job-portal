// src/components/enhanced/RecommendationEngine.jsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Building, TrendingUp } from "lucide-react";

const RecommendationEngine = ({ userProfile = {} }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call for job recommendations
    setTimeout(() => {
      const mockRecommendations = [
        {
          id: 1,
          title: "Senior React Developer",
          company: "TechCorp Inc.",
          location: "San Francisco, CA",
          salary: "$120,000 - $150,000",
          match: 95,
          skills: ["React", "TypeScript", "Node.js"],
          remote: true,
        },
        {
          id: 2,
          title: "Full Stack Engineer",
          company: "StartupXYZ",
          location: "New York, NY",
          salary: "$100,000 - $130,000",
          match: 88,
          skills: ["JavaScript", "Python", "AWS"],
          remote: false,
        },
        {
          id: 3,
          title: "Frontend Lead",
          company: "Digital Solutions",
          location: "Remote",
          salary: "$110,000 - $140,000",
          match: 82,
          skills: ["React", "Vue.js", "CSS"],
          remote: true,
        },
      ];
      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 1000);
  }, [userProfile]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Job Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Recommended Jobs for You
        </CardTitle>
        <p className="text-sm text-gray-600">
          Based on your profile and preferences
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Building className="h-4 w-4" />
                    <span>{job.company}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{job.match}% match</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                {job.remote && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Remote
                  </span>
                )}
              </div>

              <div className="text-sm font-medium text-green-600 mb-2">
                {job.salary}
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                  Apply Now
                </button>
                <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View More Recommendations
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationEngine;
