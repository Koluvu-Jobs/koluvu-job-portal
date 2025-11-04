// src/components/ui/employee/card/page.js

import React from "react";
import { motion } from "framer-motion";

const Card = ({ children, className = "" }) => {
  return (
    <motion.div
      className={`rounded-2xl shadow-lg bg-white border border-gray-100 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  );
};

const CardContent = ({ children, className = "" }) => {
  return (
    <div className={`p-6 space-y-4 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardContent };
