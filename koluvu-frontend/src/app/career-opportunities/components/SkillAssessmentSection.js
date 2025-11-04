// src/app/career-opportunities/components/SkillAssessmentSection.js

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Lightbulb,
  Users,
} from "lucide-react";

export default function SkillAssessmentSection() {
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState(null);

  const assessments = [
    {
      id: 1,
      name: "Technical Skills Assessment",
      category: "Technical",
      description:
        "Evaluate your programming, problem-solving, and technical knowledge across various domains.",
      duration: 30,
      questions: 25,
      difficulty: "Intermediate",
      icon: <Brain className="w-8 h-8" />,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      skills: ["Programming", "Algorithms", "System Design", "Databases"],
      sampleQuestions: [
        {
          question: "What is the time complexity of binary search?",
          options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
          correct: 1,
        },
        {
          question: "Which data structure is best for implementing a queue?",
          options: ["Array", "Linked List", "Stack", "Tree"],
          correct: 1,
        },
        {
          question: "What does REST stand for in web development?",
          options: [
            "Representational State Transfer",
            "Remote State Transfer",
            "Relational State Transfer",
            "Resource State Transfer",
          ],
          correct: 0,
        },
      ],
    },
    {
      id: 2,
      name: "Leadership & Management",
      category: "Soft Skills",
      description:
        "Assess your leadership capabilities, team management skills, and strategic thinking abilities.",
      duration: 25,
      questions: 20,
      difficulty: "Advanced",
      icon: <Users className="w-8 h-8" />,
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
      skills: [
        "Leadership",
        "Communication",
        "Decision Making",
        "Team Building",
      ],
      sampleQuestions: [
        {
          question: "What is the most effective way to handle team conflicts?",
          options: [
            "Ignore them",
            "Address them immediately",
            "Let team members resolve it",
            "Escalate to HR",
          ],
          correct: 1,
        },
        {
          question:
            "Which leadership style is most effective in crisis situations?",
          options: [
            "Democratic",
            "Autocratic",
            "Laissez-faire",
            "Transformational",
          ],
          correct: 1,
        },
      ],
    },
    {
      id: 3,
      name: "Creative Problem Solving",
      category: "Creative",
      description:
        "Test your creative thinking, innovation skills, and ability to approach problems from unique angles.",
      duration: 20,
      questions: 15,
      difficulty: "Beginner",
      icon: <Lightbulb className="w-8 h-8" />,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-500/10 to-orange-500/10",
      skills: [
        "Creativity",
        "Innovation",
        "Critical Thinking",
        "Design Thinking",
      ],
      sampleQuestions: [
        {
          question: "How many different ways can you use a paperclip?",
          options: ["5-10", "10-20", "20-30", "30+"],
          correct: 3,
        },
      ],
    },
    {
      id: 4,
      name: "Communication Skills",
      category: "Soft Skills",
      description:
        "Evaluate your verbal, written, and interpersonal communication abilities.",
      duration: 15,
      questions: 18,
      difficulty: "Intermediate",
      icon: <Target className="w-8 h-8" />,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
      skills: [
        "Verbal Communication",
        "Written Communication",
        "Active Listening",
        "Presentation",
      ],
      sampleQuestions: [
        {
          question:
            "What is the most important aspect of effective communication?",
          options: [
            "Speaking clearly",
            "Active listening",
            "Using big words",
            "Talking fast",
          ],
          correct: 1,
        },
      ],
    },
  ];

  const userResults = [
    {
      assessment: "Technical Skills Assessment",
      score: 85,
      completedAt: "2024-01-15",
      strengths: ["Algorithms", "System Design"],
      improvements: ["Database Optimization", "Security"],
    },
    {
      assessment: "Leadership & Management",
      score: 72,
      completedAt: "2024-01-10",
      strengths: ["Team Building", "Communication"],
      improvements: ["Strategic Planning", "Conflict Resolution"],
    },
  ];

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmitAssessment();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(assessment.duration * 60); // Convert minutes to seconds
    setIsActive(true);
    setShowResults(false);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedAssessment.sampleQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmitAssessment = () => {
    setIsActive(false);

    // Calculate score (simplified)
    let correctAnswers = 0;
    selectedAssessment.sampleQuestions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctAnswers++;
      }
    });

    const score = Math.round(
      (correctAnswers / selectedAssessment.sampleQuestions.length) * 100
    );

    setAssessmentResults({
      score,
      totalQuestions: selectedAssessment.sampleQuestions.length,
      correctAnswers,
      timeTaken: selectedAssessment.duration * 60 - timeLeft,
      strengths:
        score >= 80
          ? ["Excellent Performance"]
          : score >= 60
          ? ["Good Understanding"]
          : ["Room for Improvement"],
      recommendations:
        score >= 80 ? ["Consider advanced topics"] : ["Focus on fundamentals"],
    });

    setShowResults(true);
  };

  const resetAssessment = () => {
    setSelectedAssessment(null);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(null);
    setIsActive(false);
    setShowResults(false);
    setAssessmentResults(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-400 bg-green-500/20";
      case "Intermediate":
        return "text-yellow-400 bg-yellow-500/20";
      case "Advanced":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  if (selectedAssessment && !showResults) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Assessment Header */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${selectedAssessment.color} text-white`}
                >
                  {selectedAssessment.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedAssessment.name}
                  </h2>
                  <p className="text-slate-300">
                    Question {currentQuestion + 1} of{" "}
                    {selectedAssessment.sampleQuestions.length}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-2xl font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2"
                >
                  {isActive ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isActive ? "Pause" : "Resume"}
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    ((currentQuestion + 1) /
                      selectedAssessment.sampleQuestions.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">
              {selectedAssessment.sampleQuestions[currentQuestion]?.question}
            </h3>

            <div className="space-y-4">
              {selectedAssessment.sampleQuestions[currentQuestion]?.options.map(
                (option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                    className={`w-full p-4 text-left rounded-xl border transition-all duration-300 ${
                      answers[currentQuestion] === index
                        ? "bg-cyan-500/20 border-cyan-400 text-white"
                        : "bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion] === index
                            ? "border-cyan-400 bg-cyan-400"
                            : "border-slate-500"
                        }`}
                      >
                        {answers[currentQuestion] === index && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={resetAssessment}
                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              <button
                onClick={nextQuestion}
                disabled={answers[currentQuestion] === undefined}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {currentQuestion ===
                selectedAssessment.sampleQuestions.length - 1
                  ? "Submit"
                  : "Next"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && assessmentResults) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 backdrop-blur-sm">
              <Award className="w-6 h-6 text-green-400" />
              <span className="text-green-300 font-medium">
                Assessment Complete
              </span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">Your Results</h1>
            <p className="text-slate-300 text-lg">{selectedAssessment.name}</p>
          </motion.div>

          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-8 text-center"
          >
            <div className="mb-6">
              <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text mb-2">
                {assessmentResults.score}%
              </div>
              <p className="text-slate-300 text-lg">Overall Score</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-900/50 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">
                  {assessmentResults.correctAnswers}
                </div>
                <div className="text-slate-400 text-sm">Correct Answers</div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">
                  {assessmentResults.totalQuestions}
                </div>
                <div className="text-slate-400 text-sm">Total Questions</div>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl">
                <div className="text-2xl font-bold text-white mb-1">
                  {Math.floor(assessmentResults.timeTaken / 60)}m
                </div>
                <div className="text-slate-400 text-sm">Time Taken</div>
              </div>
            </div>
          </motion.div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Strengths
              </h3>
              <div className="space-y-3">
                {assessmentResults.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-400/20"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">{strength}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-yellow-400" />
                Recommendations
              </h3>
              <div className="space-y-3">
                {assessmentResults.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-400/20"
                  >
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <span className="text-white">{rec}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={resetAssessment}
              className="px-8 py-4 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-colors"
            >
              Take Another Assessment
            </button>
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200">
              View Career Recommendations
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-400/30 backdrop-blur-sm">
            <Brain className="w-6 h-6 text-cyan-400" />
            <span className="text-cyan-300 font-medium">Skill Assessment</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
              Assess Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Skills
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
            Take comprehensive assessments to identify your strengths, discover
            areas for improvement, and get personalized career recommendations.
          </p>
        </motion.div>

        {/* Previous Results */}
        {userResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              Your Previous Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">
                      {result.assessment}
                    </h3>
                    <div className="text-2xl font-bold text-cyan-400">
                      {result.score}%
                    </div>
                  </div>
                  <div className="text-sm text-slate-400 mb-4">
                    Completed on {result.completedAt}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-green-400 mb-2">
                        Strengths
                      </div>
                      <div className="space-y-1">
                        {result.strengths.map((strength, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-slate-300 bg-green-500/10 px-2 py-1 rounded"
                          >
                            {strength}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-yellow-400 mb-2">
                        Improvements
                      </div>
                      <div className="space-y-1">
                        {result.improvements.map((improvement, idx) => (
                          <div
                            key={idx}
                            className="text-xs text-slate-300 bg-yellow-500/10 px-2 py-1 rounded"
                          >
                            {improvement}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Available Assessments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {assessments.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${assessment.color} rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500`}
              ></div>

              <div className="relative h-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${assessment.color} text-white transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    {assessment.icon}
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border ${getDifficultyColor(
                        assessment.difficulty
                      )}`}
                    >
                      <Star className="w-3 h-3" />
                      <span className="text-xs font-medium">
                        {assessment.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {assessment.name}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {assessment.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                    <Clock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-400">Duration</div>
                    <div className="text-sm text-white font-medium">
                      {assessment.duration}m
                    </div>
                  </div>
                  <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                    <Target className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-400">Questions</div>
                    <div className="text-sm text-white font-medium">
                      {assessment.questions}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-slate-900/50 rounded-lg">
                    <Brain className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <div className="text-xs text-slate-400">Category</div>
                    <div className="text-sm text-white font-medium">
                      {assessment.category}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <div className="text-xs text-slate-400 mb-2">
                    Skills Assessed
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {assessment.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-700/50 text-xs text-slate-300 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={() => startAssessment(assessment)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Start Assessment
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-400/20 rounded-2xl">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Need Custom Assessment?
              </h3>
              <p className="text-slate-300">
                Get personalized assessments tailored to your specific career
                goals and industry requirements.
              </p>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-cyan-500/25 whitespace-nowrap">
              Request Custom Assessment
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
