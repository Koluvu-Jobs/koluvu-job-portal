// src/components/ui/employee/button/page.js

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// Button component
const ButtonComponent = React.forwardRef(({ 
  className = "",
  variant = "default",
  size = "default",
  isLoading = false,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return (
    <motion.button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        props.children
      )}
    </motion.button>
  );
});

ButtonComponent.displayName = "ButtonComponent";

// Main page component
export default function ButtonPage() {
  const [loadingStates, setLoadingStates] = useState({});

  const handleButtonClick = (buttonId) => {
    setLoadingStates(prev => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };

  const buttonExamples = [
    { id: 'default', variant: 'default', size: 'default', text: 'Default Button' },
    { id: 'outline', variant: 'outline', size: 'default', text: 'Outline Button' },
    { id: 'ghost', variant: 'ghost', size: 'default', text: 'Ghost Button' },
    { id: 'destructive', variant: 'destructive', size: 'default', text: 'Delete' },
    { id: 'success', variant: 'success', size: 'default', text: 'Save Changes' },
    { id: 'small', variant: 'default', size: 'sm', text: 'Small' },
    { id: 'large', variant: 'default', size: 'lg', text: 'Large Button' },
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Button Components</h1>
          <p className="text-gray-600">Interactive button components for the employee dashboard</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Button Variants</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {buttonExamples.map((example) => (
              <ButtonComponent
                key={example.id}
                variant={example.variant}
                size={example.size}
                isLoading={loadingStates[example.id]}
                onClick={() => handleButtonClick(example.id)}
              >
                {example.text}
              </ButtonComponent>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Interactive Example</h3>
            <div className="flex gap-4">
              <ButtonComponent
                variant="default"
                onClick={() => alert('Primary action clicked!')}
              >
                Primary Action
              </ButtonComponent>
              <ButtonComponent
                variant="outline"
                onClick={() => alert('Secondary action clicked!')}
              >
                Secondary Action
              </ButtonComponent>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
