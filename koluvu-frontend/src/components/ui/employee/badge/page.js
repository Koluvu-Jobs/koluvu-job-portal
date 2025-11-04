// src/components/ui/employee/badge/page.js

import React from "react";
import { motion } from "framer-motion";

const Badge = ({ children, variant = "default" }) => {
  const variantStyles = {
    Shortlisted: "bg-green-100 text-green-800 border-green-200",
    "In Consideration": "bg-yellow-100 text-yellow-800 border-yellow-200",
    Completed: "bg-blue-100 text-blue-800 border-blue-200",
    default: "bg-gray-100 text-gray-800 border-gray-200"
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <motion.span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${style}`}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
