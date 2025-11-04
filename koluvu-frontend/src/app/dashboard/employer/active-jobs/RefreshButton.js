// src/app/main/dashboard/active-jobs/RefreshButton.js

'use client';

import { motion } from 'framer-motion';

export default function RefreshButton({ onRefresh }) {
  return (
    <motion.button
      onClick={onRefresh}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-lg flex items-center shadow-md"
    >
      <i className="fas fa-sync-alt mr-2"></i> Refresh
    </motion.button>
  );
}
