// src/app/main/dashboard/employee/components/interview-feedback.js

import React from "react";
import { Card, CardContent } from "@koluvu/components/ui/employee/card/page";
import Badge from "@koluvu/components/ui/employee/badge/page";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Calendar, Briefcase, Building } from "lucide-react";

// Simulating data fetch for CSR (Client-Side Rendering)
const feedbacks = [
  {
    id: 1,
    jobTitle: "Frontend Developer",
    company: "Koluvu Technologies",
    interviewDate: "2025-04-28",
    status: "Completed",
    feedback: {
      rating: 4.5,
      summary: "Strong coding skills, could improve on system design.",
      comments: {
        communication: "Clear and professional",
        technicalSkills: "Excellent in React and TypeScript",
        confidence: "Well-prepared",
        improvementAreas: "Expand backend knowledge"
      },
      nextStep: "Shortlisted"
    }
  },
  {
    id: 2,
    jobTitle: "Backend Engineer",
    company: "SoftHive Inc.",
    interviewDate: "2025-04-25",
    status: "Completed",
    feedback: {
      rating: 3.8,
      summary: "Good understanding of APIs, needs more clarity in communication.",
      comments: {
        communication: "A bit vague",
        technicalSkills: "Good understanding of REST and databases",
        confidence: "Moderate",
        improvementAreas: "Practice explaining design choices"
      },
      nextStep: "In Consideration"
    }
  }
];

const FeedbackCard = ({ item }) => {
  const badgeColor = {
    Shortlisted: "bg-green-100 text-green-800",
    "In Consideration": "bg-yellow-100 text-yellow-800",
    Completed: "bg-blue-100 text-blue-800"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="rounded-2xl shadow-lg bg-white border border-gray-100 overflow-hidden">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-gray-500" />
              <h2 className="text-xl font-semibold text-gray-800">
                {item.jobTitle}
              </h2>
            </div>
            <Badge variant={item.feedback.nextStep}>
              {item.feedback.nextStep}
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>{item.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Interviewed on: {item.interviewDate}</span>
            </div>
          </div>
          <p className="text-base text-gray-700 bg-gray-50 p-3 rounded-lg">
            <span className="font-medium">Summary:</span> {item.feedback.summary}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-gray-600">
                <strong className="text-gray-800">Communication:</strong>{" "}
                {item.feedback.comments.communication}
              </p>
              <p className="text-gray-600">
                <strong className="text-gray-800">Tech Skills:</strong>{" "}
                {item.feedback.comments.technicalSkills}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-600">
                <strong className="text-gray-800">Confidence:</strong>{" "}
                {item.feedback.comments.confidence}
              </p>
              <p className="text-gray-600">
                <strong className="text-gray-800">Improvement:</strong>{" "}
                {item.feedback.comments.improvementAreas}
              </p>
            </motion.div>
          </div>
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(item.feedback.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm font-semibold text-gray-800">
              {item.feedback.rating} / 5
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function InterviewFeedback() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Interview Feedback Inbox
      </motion.h1>
      <div className="max-w-4xl mx-auto space-y-6">
        <AnimatePresence>
          {feedbacks.map((item) => (
            <FeedbackCard key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
