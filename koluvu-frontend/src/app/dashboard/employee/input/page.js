"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// Input component for demonstration
const InputComponent = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <motion.input
      ref={ref}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    />
  );
});

InputComponent.displayName = "InputComponent";

// Main page component
export default function InputPage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Input Components</h1>
          <p className="text-gray-600">Interactive input components for the employee dashboard</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Sample Input</h2>
          <InputComponent
            placeholder="Enter your text here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full"
          />
          {inputValue && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600"
            >
              You typed: {inputValue}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
