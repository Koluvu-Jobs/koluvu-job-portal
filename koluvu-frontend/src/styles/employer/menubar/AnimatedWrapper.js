// src/styles/employer/menubar/AnimatedWrapper.js

'use client';

import { motion } from 'framer-motion';

export const AnimatedWrapper = ({ 
  children, 
  className = '',
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 0.5 }
}) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedTableRow = ({ 
  children, 
  index = 0, 
  className = '',
  initial = { opacity: 0, y: 10 },
  animate = { opacity: 1, y: 0 },
  transition = { delay: 0.1 }
}) => {
  return (
    <motion.tr
      initial={initial}
      animate={animate}
      transition={{ delay: index * transition.delay, ...transition }}
      className={className}
    >
      {children}
    </motion.tr>
  );
};

export const AnimatedButton = ({ 
  children,
  className = '',
  whileHover = { scale: 1.05 },
  whileTap = { scale: 0.98 },
  onClick
}) => {
  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

export const MobileMenuIndicator = ({ isOpen, onClick }) => {
  return (
    <motion.div 
      className="fixed md:hidden top-20 left-4 z-50 flex flex-col items-center"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatedButton
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
      >
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: 0 }}
            animate={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <i className="fas fa-times text-xl"></i>
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ rotate: 0 }}
            animate={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <i className="fas fa-bars text-xl"></i>
          </motion.div>
        )}
      </AnimatedButton>
      <motion.div 
        className="mt-2 bg-white px-2 py-1 rounded-full text-xs font-medium shadow-sm"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        {isOpen ? 'Close' : 'Menu'}
      </motion.div>
    </motion.div>
  );
};
