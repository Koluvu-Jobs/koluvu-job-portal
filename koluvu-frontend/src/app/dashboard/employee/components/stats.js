// src/app/main/dashboard/employee/components/stats.js

'use client';
import { motion } from 'framer-motion';
import styles from '@koluvu/styles/employee/dashboard.module.css';

export default function Stats({ user, onViewAppliedJobs }) {
  const stats = [
    { label: 'Applications', value: user.applications.length, action: onViewAppliedJobs, actionText: 'View Applications' },
    { label: 'Profile Views', value: 124, action: null, actionText: '' },
    { label: 'Saved Jobs', value: 8, action: null, actionText: '' },
  ];

  return (
    <motion.div 
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className={styles.cardTitle}>Your Stats</h3>
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            className={styles.statItem}
            whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
          >
            <h4 className={styles.statLabel}>{stat.label}</h4>
            <p className={styles.statValue}>{stat.value}</p>
            {stat.action && (
              <motion.button
                className={styles.statAction}
                onClick={stat.action}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {stat.actionText}
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
