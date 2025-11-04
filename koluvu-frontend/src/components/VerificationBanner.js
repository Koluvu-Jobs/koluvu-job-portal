// src/components/VerificationBanner.js

import React from 'react';
import { motion } from 'framer-motion';

const VerificationBanner = ({ isVerified }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${styles.banner} ${
        isVerified ? styles.verified : styles.notVerified
      }`}
    >
      <i className={`fas ${isVerified ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
      <span>
        {isVerified
          ? 'Your account is fully verified!'
          : 'Your account is not yet verified. Please complete the verification steps.'}
      </span>
    </motion.div>
  );
};

const styles = {
  banner: {
    padding: '12px 20px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '500',
  },
  verified: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    color: '#2ecc71',
  },
  notVerified: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    color: '#e74c3c',
  },
};

export default VerificationBanner;
