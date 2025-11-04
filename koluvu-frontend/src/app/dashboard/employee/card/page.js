"use client";

import React from "react";
import { motion } from "framer-motion";

// Card components
const Card = ({ children, className = "" }) => (
  <motion.div
    className={`rounded-2xl shadow-lg bg-white border border-gray-200 overflow-hidden ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
  >
    {children}
  </motion.div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`border-b border-gray-200 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-semibold text-black ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 space-y-4 ${className}`}>
    {children}
  </div>
);

// Main page component
export default function EmployeeCardPage() {
  const cardData = [
    {
      title: "Profile Overview",
      content: "View and manage your profile information, skills, and experience."
    },
    {
      title: "Application Status",
      content: "Track your job applications and their current status."
    },
    {
      title: "Skill Assessment",
      content: "Take skill assessments to improve your profile ranking."
    }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Card Components</h1>
          <p className="text-gray-600">Interactive card components for the employee dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardData.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{item.content}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Learn More
                </motion.button>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
