// src/components/ui/button.js

'use client';

import { motion } from 'framer-motion';
import React from 'react';

const Button = ({ 
  children, 
  size = 'md', 
  variant = 'default', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-base h-10',
    lg: 'px-6 py-3 text-lg h-12'
  };

  const variantClasses = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white border border-transparent',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border border-transparent',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-transparent',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 bg-transparent',
    ghost: 'hover:bg-gray-100 text-gray-700 bg-transparent border border-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-transparent'
  };

  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
    : '';

  return (
    <motion.button
      className={`
        inline-flex items-center justify-center rounded-md font-medium transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabledClasses}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export { Button };
