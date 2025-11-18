// src/app/career-guidance/components/CareerPathsSection.js

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Briefcase,
  Clock,
  DollarSign,
  MapPin,
  Target,
  Award,
  BookOpen,
  Zap,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function CareerPathsSection() {
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedField, setSelectedField] = useState("all");
  const [filteredPaths, setFilteredPaths] = useState([]);

  const careerPaths = [
    {
      id: 1,
      title: "Software Developer to Tech Lead",
      field: "technology",
      level: "senior",
      duration: "3-5 years",
      difficulty: "Medium",
      currentRole: "Software Developer",
      targetRole: "Technical Lead",
      steps: [
        {
          phase: "Year 1-2",
          title: "Master Technical Skills",
          description: "Deepen programming expertise and learn system design",
          skills: [
            "Advanced Programming",
            "System Architecture",
            "Code Review",
          ],
          milestones: ["Lead a small project", "Mentor junior developers"],
        },
        {
          phase: "Year 2-3",
          title: "Build Leadership Skills",
          description: "Develop team management and communication abilities",
          skills: [
            "Team Leadership",
            "Project Management",
            "Stakeholder Communication",
          ],
          milestones: ["Manage a team of 3-5", "Drive technical decisions"],
        },
        {
          phase: "Year 3-5",
          title: "Strategic Leadership",
          description: "Focus on long-term technical strategy and team growth",
          skills: [
            "Strategic Planning",
            "Technical Vision",
            "Cross-team Collaboration",
          ],
          milestones: ["Define technical roadmap", "Lead multiple teams"],
        },
      ],
      salaryRange: "$90K - $160K",
      demandScore: 9.2,
      trending: true,
    },
    {
      id: 2,
      title: "Marketing Coordinator to Marketing Manager",
      field: "marketing",
      level: "mid",
      duration: "2-4 years",
      difficulty: "Medium",
      currentRole: "Marketing Coordinator",
      targetRole: "Marketing Manager",
      steps: [
        {
          phase: "Year 1",
          title: "Campaign Mastery",
          description: "Excel at executing and analyzing marketing campaigns",
          skills: ["Campaign Management", "Analytics", "Content Strategy"],
          milestones: [
            "Increase campaign ROI by 25%",
            "Manage budget of $50K+",
          ],
        },
        {
          phase: "Year 2-3",
          title: "Team Leadership",
          description: "Start managing team members and larger initiatives",
          skills: ["Team Management", "Strategic Planning", "Vendor Relations"],
          milestones: ["Manage 2-3 team members", "Lead product launches"],
        },
        {
          phase: "Year 3-4",
          title: "Strategic Management",
          description: "Drive marketing strategy and department growth",
          skills: [
            "Marketing Strategy",
            "Budget Management",
            "Cross-functional Leadership",
          ],
          milestones: ["Develop annual marketing plan", "Expand team size"],
        },
      ],
      salaryRange: "$55K - $95K",
      demandScore: 7.8,
      trending: false,
    },
    {
      id: 3,
      title: "Data Analyst to Data Scientist",
      field: "technology",
      level: "mid",
      duration: "2-3 years",
      difficulty: "High",
      currentRole: "Data Analyst",
      targetRole: "Data Scientist",
      steps: [
        {
          phase: "Year 1",
          title: "Advanced Analytics",
          description:
            "Master statistical analysis and machine learning basics",
          skills: [
            "Python/R Programming",
            "Statistical Analysis",
            "Machine Learning",
          ],
          milestones: ["Complete ML certification", "Build 3 ML models"],
        },
        {
          phase: "Year 2",
          title: "Applied Machine Learning",
          description: "Implement ML solutions for business problems",
          skills: ["Deep Learning", "Model Deployment", "A/B Testing"],
          milestones: [
            "Deploy ML model to production",
            "Improve business KPI by 15%",
          ],
        },
        {
          phase: "Year 2-3",
          title: "Data Science Leadership",
          description: "Lead data science projects and mentor others",
          skills: ["Project Leadership", "Data Strategy", "Communication"],
          milestones: [
            "Lead cross-functional DS project",
            "Present to executives",
          ],
        },
      ],
      salaryRange: "$80K - $140K",
      demandScore: 9.5,
      trending: true,
    },
    {
      id: 4,
      title: "Junior Designer to Senior UX Designer",
      field: "design",
      level: "senior",
      duration: "4-6 years",
      difficulty: "Medium",
      currentRole: "Junior Designer",
      targetRole: "Senior UX Designer",
      steps: [
        {
          phase: "Year 1-2",
          title: "Design Fundamentals",
          description: "Master design tools and basic UX principles",
          skills: ["Figma/Sketch", "User Research", "Prototyping"],
          milestones: [
            "Complete 10 design projects",
            "Conduct user interviews",
          ],
        },
        {
          phase: "Year 2-4",
          title: "UX Specialization",
          description: "Develop expertise in user experience design",
          skills: [
            "Information Architecture",
            "Interaction Design",
            "Usability Testing",
          ],
          milestones: [
            "Lead UX for major feature",
            "Improve user satisfaction by 30%",
          ],
        },
        {
          phase: "Year 4-6",
          title: "Senior Designer",
          description: "Drive design strategy and mentor junior designers",
          skills: [
            "Design Strategy",
            "Cross-functional Leadership",
            "Design Systems",
          ],
          milestones: ["Establish design system", "Lead design team"],
        },
      ],
      salaryRange: "$60K - $120K",
      demandScore: 8.1,
      trending: true,
    },
  ];

  const levels = [
    { id: "all", label: "All Levels", icon: <Users className="w-4 h-4" /> },
    {
      id: "junior",
      label: "Junior Level",
      icon: <BookOpen className="w-4 h-4" />,
    },
    { id: "mid", label: "Mid Level", icon: <TrendingUp className="w-4 h-4" /> },
    {
      id: "senior",
      label: "Senior Level",
      icon: <Award className="w-4 h-4" />,
    },
  ];

  const fields = [
    { id: "all", label: "All Fields" },
    { id: "technology", label: "Technology" },
    { id: "marketing", label: "Marketing" },
    { id: "design", label: "Design" },
    { id: "finance", label: "Finance" },
  ];

  useEffect(() => {
    let filtered = careerPaths;

    if (selectedLevel !== "all") {
      filtered = filtered.filter((path) => path.level === selectedLevel);
    }

    if (selectedField !== "all") {
      filtered = filtered.filter((path) => path.field === selectedField);
    }

    setFilteredPaths(filtered);
  }, [selectedLevel, selectedField]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-500/10";
      case "Medium":
        return "text-yellow-400 bg-yellow-500/10";
      case "High":
        return "text-red-400 bg-red-500/10";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white">
              Career{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Paths
              </span>
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover structured pathways to advance your career. Get
            step-by-step guidance, skill requirements, and timeline expectations
            for your professional growth.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">
                Filter Career Paths
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Level Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Experience Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedLevel(level.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        selectedLevel === level.id
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {level.icon}
                      <span>{level.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Field Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Career Field
                </label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {fields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Career Paths Grid */}
        <div className="grid gap-8">
          {filteredPaths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all duration-300"
            >
              {/* Path Header */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">
                        {path.title}
                      </h3>
                      {path.trending && (
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Trending
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-slate-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {path.duration}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-lg text-sm ${getDifficultyColor(
                          path.difficulty
                        )}`}
                      >
                        {path.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {path.salaryRange}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-semibold">
                        {path.demandScore}/10
                      </span>
                    </div>
                    <span className="text-sm text-slate-400">
                      Market Demand
                    </span>
                  </div>
                </div>
              </div>

              {/* Career Path Steps */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-cyan-400" />
                  <span className="text-lg font-semibold text-white">
                    Career Progression
                  </span>
                </div>

                <div className="space-y-6">
                  {path.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="relative">
                      {stepIndex < path.steps.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-full bg-gradient-to-b from-cyan-500 to-blue-500"></div>
                      )}

                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {stepIndex + 1}
                        </div>

                        <div className="flex-1">
                          <div className="bg-slate-700/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg font-semibold text-white">
                                {step.title}
                              </h4>
                              <span className="text-sm text-cyan-400 font-medium">
                                {step.phase}
                              </span>
                            </div>
                            <p className="text-slate-300 mb-3">
                              {step.description}
                            </p>

                            <div className="space-y-3">
                              <div>
                                <span className="text-sm font-medium text-slate-400 block mb-1">
                                  Key Skills:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {step.skills.map((skill, skillIndex) => (
                                    <span
                                      key={skillIndex}
                                      className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <span className="text-sm font-medium text-slate-400 block mb-1">
                                  Milestones:
                                </span>
                                <ul className="space-y-1">
                                  {step.milestones.map(
                                    (milestone, milestoneIndex) => (
                                      <li
                                        key={milestoneIndex}
                                        className="flex items-center gap-2 text-sm text-slate-300"
                                      >
                                        <ChevronRight className="w-3 h-3 text-cyan-400" />
                                        {milestone}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2">
                    <span>Start This Career Path</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredPaths.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Career Paths Found
            </h3>
            <p className="text-slate-400">
              Try adjusting your filters to see more options.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
