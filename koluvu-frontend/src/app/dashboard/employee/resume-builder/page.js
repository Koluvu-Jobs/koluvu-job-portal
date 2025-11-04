// src/app/dashboard/employee/resume-builder/page.js

"use client";

import { useState } from "react";
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

export default function ResumeBuilderPage() {
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Resume Builder
        </h1>
        <p className="text-gray-600">
          Create and manage your professional resumes
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Create New Resume</h3>
            <p className="text-sm text-gray-600 mb-4">
              Start building a new resume from scratch
            </p>
            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Import Resume</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your existing resume to edit
            </p>
            <Button variant="outline" className="w-full">
              Import
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Browse Templates</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose from professional templates
            </p>
            <Button variant="outline" className="w-full">
              Browse
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* My Resumes */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Resumes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{resume.name}</CardTitle>
                    <p className="text-sm text-gray-600">
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
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Last modified: {resume.lastModified}
                  </p>
                  <p className="text-sm text-gray-600">
                    Downloads: {resume.downloads}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Featured Templates */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Featured Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="relative">
                <div className="aspect-[3/4] bg-gray-100 rounded-t-lg flex items-center justify-center">
                  <FileText className="w-16 h-16 text-gray-400" />
                </div>
                {template.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
                    Featured
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{template.name}</h3>
                <Button size="sm" className="w-full">
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
