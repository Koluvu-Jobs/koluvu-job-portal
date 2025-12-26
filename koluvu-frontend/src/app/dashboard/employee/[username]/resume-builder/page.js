// src/app/dashboard/employee/[username]/resume-builder/page.js

"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  Plus,
  Edit,
  Eye,
  Trash2,
  Star,
} from "lucide-react";

export default function ResumeBuilderPage({ params }) {
  // Unwrap params for Next.js 15+
  const { username } = React.use(params);

  const [resumes, setResumes] = useState([
    {
      id: 1,
      name: "Software Engineer Resume",
      lastModified: "2 days ago",
      template: "Modern",
      status: "Active",
      downloads: 12,
    },
    {
      id: 2,
      name: "Full Stack Developer",
      lastModified: "1 week ago",
      template: "Professional",
      status: "Draft",
      downloads: 8,
    },
  ]);

  const templates = [
    {
      id: 1,
      name: "Modern",
      preview: "/api/placeholder/300/400",
      featured: true,
    },
    {
      id: 2,
      name: "Professional",
      preview: "/api/placeholder/300/400",
      featured: false,
    },
    {
      id: 3,
      name: "Creative",
      preview: "/api/placeholder/300/400",
      featured: false,
    },
    {
      id: 4,
      name: "Minimalist",
      preview: "/api/placeholder/300/400",
      featured: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-2 xs:p-3 sm:p-4 md:p-6">
      <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 xs:mb-2">
          Resume Builder for {username}
        </h1>
        <p className="text-xs xs:text-sm md:text-base text-gray-600">
          Create and manage your professional resumes
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 mb-4 xs:mb-5 sm:mb-6 md:mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-3 xs:p-4 sm:p-5 md:p-6 text-center">
            <div className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 mx-auto mb-2 xs:mb-3 sm:mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-2">Create New Resume</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Start building a new resume from scratch
            </p>
            <Button className="w-full text-xs sm:text-sm">Get Started</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-2">Import Resume</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Upload your existing resume to edit
            </p>
            <Button variant="outline" className="w-full text-xs sm:text-sm">
              Import
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base mb-2">Browse Templates</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Choose from professional templates
            </p>
            <Button variant="outline" className="w-full text-xs sm:text-sm">
              Browse
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* My Resumes */}
      <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
        <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold mb-3 xs:mb-4">My Resumes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-3 xs:p-4 sm:p-5 md:p-6">
                <div className="flex justify-between items-start">
                  <div className="max-w-[70%]">
                    <CardTitle className="text-base sm:text-lg truncate">
                      {resume.name}
                    </CardTitle>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      Template: {resume.template}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      resume.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {resume.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-3 xs:p-4 sm:p-5 md:p-6 pt-0">
                <div className="mb-2 xs:mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Last modified: {resume.lastModified}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Downloads: {resume.downloads}
                  </p>
                </div>
                <div className="flex gap-1 xs:gap-1.5 sm:gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-[10px] xs:text-xs">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Preview</span>
                  </Button>
                  <Button size="sm" className="flex-1 text-xs">
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button size="sm" variant="outline" className="px-2 sm:px-3">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="px-2 sm:px-3">
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Templates */}
      <div>
        <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold mb-3 xs:mb-4">Featured Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="relative">
                <div className="aspect-[3/4] bg-gray-100 rounded-t-lg flex items-center justify-center">
                  <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                </div>
                {template.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                    Featured
                  </div>
                )}
              </div>
              <CardContent className="p-2 xs:p-3 sm:p-4">
                <h3 className="font-semibold text-xs xs:text-sm md:text-base mb-1.5 xs:mb-2">{template.name}</h3>
                <Button size="sm" className="w-full text-xs sm:text-sm">
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
