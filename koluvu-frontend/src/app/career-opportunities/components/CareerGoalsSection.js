// src/app/career-opportunities/components/CareerGoalsSection.js

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  Flag,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Star,
  Timer,
  AlertCircle,
  BookOpen,
  Users,
  DollarSign,
  Zap,
  PieChart,
} from "lucide-react";

export default function CareerGoalsSection() {
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [activeTab, setActiveTab] = useState("my-goals");
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "career",
    priority: "medium",
    deadline: "",
    milestones: [""],
  });

  const sampleGoals = [
    {
      id: 1,
      title: "Get Promoted to Senior Developer",
      description:
        "Advance to a senior software developer role with increased responsibilities and leadership opportunities.",
      category: "career",
      priority: "high",
      progress: 65,
      deadline: "2024-12-31",
      status: "in-progress",
      milestones: [
        { text: "Complete advanced React course", completed: true },
        { text: "Lead a cross-team project", completed: true },
        { text: "Mentor 2 junior developers", completed: false },
        {
          text: "Present technical solution to stakeholders",
          completed: false,
        },
      ],
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Transition to Product Management",
      description:
        "Move from engineering role to product management within the next 18 months.",
      category: "transition",
      priority: "high",
      progress: 30,
      deadline: "2025-06-30",
      status: "in-progress",
      milestones: [
        { text: "Complete PM certification course", completed: true },
        { text: "Shadow current PM for 3 months", completed: false },
        {
          text: "Lead product feature from conception to launch",
          completed: false,
        },
        { text: "Build stakeholder management skills", completed: false },
      ],
      createdAt: "2024-02-01",
    },
    {
      id: 3,
      title: "Build Professional Network",
      description:
        "Expand professional network by connecting with 50 industry professionals and attending 6 conferences.",
      category: "networking",
      priority: "medium",
      progress: 80,
      deadline: "2024-10-31",
      status: "in-progress",
      milestones: [
        { text: "Attend 3 tech conferences", completed: true },
        { text: "Connect with 25 professionals on LinkedIn", completed: true },
        { text: "Join 2 professional organizations", completed: true },
        { text: "Speak at 1 industry event", completed: false },
      ],
      createdAt: "2024-01-01",
    },
  ];

  const goalTemplates = [
    {
      id: 1,
      title: "Get a Promotion",
      description: "Advance to the next level in your current role",
      category: "career",
      milestones: [
        "Identify promotion criteria",
        "Complete required training/certifications",
        "Take on additional responsibilities",
        "Discuss promotion timeline with manager",
      ],
    },
    {
      id: 2,
      title: "Change Career Fields",
      description: "Transition to a completely new industry or role",
      category: "transition",
      milestones: [
        "Research target field requirements",
        "Acquire necessary skills/education",
        "Build relevant portfolio/experience",
        "Network with professionals in target field",
      ],
    },
    {
      id: 3,
      title: "Increase Salary by 30%",
      description:
        "Achieve significant salary increase through promotion or job change",
      category: "financial",
      milestones: [
        "Research market salary ranges",
        "Document achievements and value",
        "Prepare negotiation strategy",
        "Apply for higher-paying positions",
      ],
    },
    {
      id: 4,
      title: "Build Leadership Skills",
      description: "Develop management and leadership capabilities",
      category: "skills",
      milestones: [
        "Complete leadership training program",
        "Mentor team members",
        "Lead cross-functional projects",
        "Seek feedback on leadership style",
      ],
    },
  ];

  const categories = [
    {
      id: "career",
      label: "Career Growth",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "skills",
      label: "Skill Development",
      icon: <BookOpen className="w-4 h-4" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "transition",
      label: "Career Transition",
      icon: <ArrowRight className="w-4 h-4" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "networking",
      label: "Networking",
      icon: <Users className="w-4 h-4" />,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "financial",
      label: "Financial",
      icon: <DollarSign className="w-4 h-4" />,
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const priorities = [
    { id: "low", label: "Low", color: "text-green-400 bg-green-500/10" },
    {
      id: "medium",
      label: "Medium",
      color: "text-yellow-400 bg-yellow-500/10",
    },
    { id: "high", label: "High", color: "text-red-400 bg-red-500/10" },
  ];

  useEffect(() => {
    setGoals(sampleGoals);
  }, []);

  const addMilestone = () => {
    setNewGoal((prev) => ({
      ...prev,
      milestones: [...prev.milestones, ""],
    }));
  };

  const updateMilestone = (index, value) => {
    setNewGoal((prev) => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) =>
        i === index ? value : milestone
      ),
    }));
  };

  const removeMilestone = (index) => {
    setNewGoal((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitGoal = () => {
    const goal = {
      ...newGoal,
      id: Date.now(),
      progress: 0,
      status: "not-started",
      milestones: newGoal.milestones
        .filter((m) => m.trim())
        .map((m) => ({ text: m, completed: false })),
      createdAt: new Date().toISOString().split("T")[0],
    };

    setGoals((prev) => [...prev, goal]);
    setNewGoal({
      title: "",
      description: "",
      category: "career",
      priority: "medium",
      deadline: "",
      milestones: [""],
    });
    setShowAddGoal(false);
  };

  const updateGoalProgress = (goalId, milestoneIndex) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const updatedMilestones = goal.milestones.map((milestone, index) =>
            index === milestoneIndex
              ? { ...milestone, completed: !milestone.completed }
              : milestone
          );
          const completedCount = updatedMilestones.filter(
            (m) => m.completed
          ).length;
          const progress = Math.round(
            (completedCount / updatedMilestones.length) * 100
          );

          return {
            ...goal,
            milestones: updatedMilestones,
            progress,
            status:
              progress === 100
                ? "completed"
                : progress > 0
                ? "in-progress"
                : "not-started",
          };
        }
        return goal;
      })
    );
  };

  const useTemplate = (template) => {
    setNewGoal({
      title: template.title,
      description: template.description,
      category: template.category,
      priority: "medium",
      deadline: "",
      milestones: template.milestones,
    });
    setShowAddGoal(true);
  };

  const getCategoryInfo = (categoryId) => {
    return categories.find((cat) => cat.id === categoryId) || categories[0];
  };

  const getPriorityInfo = (priorityId) => {
    return priorities.find((p) => p.id === priorityId) || priorities[1];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/10";
      case "in-progress":
        return "text-blue-400 bg-blue-500/10";
      case "not-started":
        return "text-gray-400 bg-gray-500/10";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white">
              Career{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Goals
              </span>
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Set, track, and achieve your career objectives with structured goal
            planning. Break down ambitious goals into actionable milestones and
            monitor your progress.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex justify-center">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 border border-slate-700">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("my-goals")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === "my-goals"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  My Goals
                </button>
                <button
                  onClick={() => setActiveTab("templates")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === "templates"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Goal Templates
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === "analytics"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Analytics
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* My Goals Tab */}
        {activeTab === "my-goals" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Add Goal Button */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Your Career Goals
              </h2>
              <button
                onClick={() => setShowAddGoal(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Goal
              </button>
            </div>

            {/* Goals List */}
            <div className="space-y-6">
              {goals.map((goal, index) => {
                const categoryInfo = getCategoryInfo(goal.category);
                const priorityInfo = getPriorityInfo(goal.priority);
                const daysUntilDeadline = getDaysUntilDeadline(goal.deadline);

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6"
                  >
                    {/* Goal Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`p-2 rounded-lg bg-gradient-to-r ${categoryInfo.color}`}
                          >
                            {categoryInfo.icon}
                          </div>
                          <h3 className="text-xl font-bold text-white">
                            {goal.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-lg text-xs ${priorityInfo.color}`}
                          >
                            {priorityInfo.label} Priority
                          </span>
                        </div>
                        <p className="text-slate-300 mb-3">
                          {goal.description}
                        </p>

                        {/* Goal Meta */}
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created:{" "}
                            {new Date(goal.createdAt).toLocaleDateString()}
                          </span>
                          {goal.deadline && (
                            <span
                              className={`flex items-center gap-1 ${
                                daysUntilDeadline < 7
                                  ? "text-red-400"
                                  : daysUntilDeadline < 30
                                  ? "text-yellow-400"
                                  : "text-slate-400"
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                              {daysUntilDeadline > 0
                                ? `${daysUntilDeadline} days left`
                                : daysUntilDeadline === 0
                                ? "Due today"
                                : `${Math.abs(daysUntilDeadline)} days overdue`}
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 rounded-lg text-xs ${getStatusColor(
                              goal.status
                            )}`}
                          >
                            {goal.status
                              .replace("-", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-300">
                          Progress
                        </span>
                        <span className="text-sm font-bold text-white">
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <Flag className="w-4 h-4 text-cyan-400" />
                        Milestones
                      </h4>
                      <div className="space-y-2">
                        {goal.milestones.map((milestone, milestoneIndex) => (
                          <div
                            key={milestoneIndex}
                            className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg"
                          >
                            <button
                              onClick={() =>
                                updateGoalProgress(goal.id, milestoneIndex)
                              }
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                milestone.completed
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "border-slate-500 hover:border-cyan-500"
                              }`}
                            >
                              {milestone.completed && (
                                <CheckCircle className="w-3 h-3" />
                              )}
                            </button>
                            <span
                              className={`flex-1 ${
                                milestone.completed
                                  ? "text-slate-400 line-through"
                                  : "text-slate-300"
                              }`}
                            >
                              {milestone.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Add Goal Modal */}
            {showAddGoal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-800 rounded-2xl border border-slate-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      Add New Goal
                    </h3>
                    <button
                      onClick={() => setShowAddGoal(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Goal Title
                      </label>
                      <input
                        type="text"
                        value={newGoal.title}
                        onChange={(e) =>
                          setNewGoal((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Enter your goal title..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newGoal.description}
                        onChange={(e) =>
                          setNewGoal((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent h-24"
                        placeholder="Describe your goal in detail..."
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Category
                        </label>
                        <select
                          value={newGoal.category}
                          onChange={(e) =>
                            setNewGoal((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Priority
                        </label>
                        <select
                          value={newGoal.priority}
                          onChange={(e) =>
                            setNewGoal((prev) => ({
                              ...prev,
                              priority: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        >
                          {priorities.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Deadline
                        </label>
                        <input
                          type="date"
                          value={newGoal.deadline}
                          onChange={(e) =>
                            setNewGoal((prev) => ({
                              ...prev,
                              deadline: e.target.value,
                            }))
                          }
                          className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Milestones
                        </label>
                        <button
                          onClick={addMilestone}
                          className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Milestone
                        </button>
                      </div>
                      <div className="space-y-2">
                        {newGoal.milestones.map((milestone, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={milestone}
                              onChange={(e) =>
                                updateMilestone(index, e.target.value)
                              }
                              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                              placeholder={`Milestone ${index + 1}...`}
                            />
                            {newGoal.milestones.length > 1 && (
                              <button
                                onClick={() => removeMilestone(index)}
                                className="text-red-400 hover:text-red-300 p-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSubmitGoal}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                      >
                        Create Goal
                      </button>
                      <button
                        onClick={() => setShowAddGoal(false)}
                        className="px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* Templates Tab */}
        {activeTab === "templates" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Goal Templates
              </h2>
              <p className="text-slate-300">
                Choose from pre-built goal templates to get started quickly with
                proven frameworks.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {goalTemplates.map((template, index) => {
                const categoryInfo = getCategoryInfo(template.category);

                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 hover:border-cyan-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${categoryInfo.color}`}
                      >
                        {categoryInfo.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2">
                          {template.title}
                        </h3>
                        <p className="text-slate-300 text-sm">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-300 mb-2">
                        Included Milestones:
                      </h4>
                      <ul className="space-y-1">
                        {template.milestones.map(
                          (milestone, milestoneIndex) => (
                            <li
                              key={milestoneIndex}
                              className="flex items-center gap-2 text-sm text-slate-400"
                            >
                              <CheckCircle className="w-3 h-3 text-cyan-400" />
                              {milestone}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <button
                      onClick={() => useTemplate(template)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <span>Use This Template</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Goal Analytics
              </h2>
              <p className="text-slate-300">
                Track your progress and get insights into your goal achievement
                patterns.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Total Goals
                  </h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {goals.length}
                </div>
                <div className="text-sm text-slate-400">
                  Active goals in progress
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Avg Progress
                  </h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {Math.round(
                    goals.reduce((acc, goal) => acc + goal.progress, 0) /
                      goals.length || 0
                  )}
                  %
                </div>
                <div className="text-sm text-slate-400">Across all goals</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Completed
                  </h3>
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {goals.filter((goal) => goal.status === "completed").length}
                </div>
                <div className="text-sm text-slate-400">Goals achieved</div>
              </div>
            </div>

            {/* Goal Categories Breakdown */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-cyan-400" />
                Goals by Category
              </h3>

              <div className="space-y-4">
                {categories.map((category) => {
                  const categoryGoals = goals.filter(
                    (goal) => goal.category === category.id
                  );
                  const percentage =
                    goals.length > 0
                      ? (categoryGoals.length / goals.length) * 100
                      : 0;

                  return (
                    <div key={category.id} className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">
                            {category.label}
                          </span>
                          <span className="text-slate-400 text-sm">
                            {categoryGoals.length} goals
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${category.color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-white font-semibold min-w-[3rem] text-right">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
