// src/app/main/dashboard/employee/components/applied-jobs.js

'use client';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '@koluvu/styles/employee/dashboard.module.css';

export default function AppliedJobsModal({ isOpen, onClose, applications, onWithdraw }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.cardTitle}>Applied Jobs</h3>
              <button onClick={onClose} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.applicationList}>
              {applications.map((app) => (
                <motion.div
                  key={app.id}
                  className={styles.applicationItem}
                  whileHover={{ scale: 1.02, background: "#f8fafc" }}
                >
                  <div>
                    <p className={styles.applicationTitle}>{app.title}</p>
                    <p className={styles.applicationCompany}>{app.company}</p>
                    <p className={styles.applicationStatus}>Status: {app.status}</p>
                    <p className={styles.applicationDate}>Applied: {app.appliedDate}</p>
                  </div>
                  <motion.button
                    className={styles.withdrawButton}
                    onClick={() => onWithdraw(app.id)}
                    whileHover={{ scale: 1.05, background: "#fee2e2" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Withdraw
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
