"use client";

import React from "react";
import { motion } from "framer-motion";

// Label component
const LabelComponent = React.forwardRef(({ 
  className = "", 
  required = false,
  children,
  ...props 
}, ref) => {
  return (
    <motion.label
      ref={ref}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black dark:text-gray-300 flex items-center gap-1 ${className}`}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
      {required && <span className="text-red-500">*</span>}
    </motion.label>
  );
});

LabelComponent.displayName = "LabelComponent";

// Main page component
export default function LabelPage() {
  const labelExamples = [
    { text: "First Name", required: true },
    { text: "Last Name", required: true },
    { text: "Email Address", required: true },
    { text: "Phone Number", required: false },
    { text: "LinkedIn Profile", required: false },
    { text: "Portfolio URL", required: false }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Label Components</h1>
          <p className="text-gray-600">Form label components for the employee dashboard</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Form Labels</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {labelExamples.map((example, index) => (
              <div key={index} className="space-y-2">
                <LabelComponent required={example.required}>
                  {example.text}
                </LabelComponent>
                <input
                  type="text"
                  placeholder={`Enter your ${example.text.toLowerCase()}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
