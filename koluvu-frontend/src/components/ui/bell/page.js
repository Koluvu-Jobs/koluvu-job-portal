// src/components/ui/bell/page.js

import React from 'react';
import { motion } from 'framer-motion';

const Bell = ({ 
  className = '',
  hasNotification = false,
  ...props 
}) => {
  return (
    <div className="relative">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-6 h-6 ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        {...props}
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </motion.svg>
      
      {hasNotification && (
        <motion.div
          className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500 }}
        />
      )}
    </div>
  );
};

export default Bell;
