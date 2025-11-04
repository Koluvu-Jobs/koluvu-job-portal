'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, config } from '@react-spring/web';
import styles from '@koluvu/styles/employee/dashboard.module.css';

export default function JobPreferencesForm() {
  const [formData, setFormData] = useState({
    jobTitles: '',
    industries: '',
    departments: '',
    jobType: '',
    location: '',
    salaryRange: '',
    experienceLevel: '',
    noticePeriod: '',
    shiftPreference: '',
    languagesKnown: '',
    companies: '',
    workAuthorization: '',
    internship: false,
    jobAlert: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const fieldAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const buttonSpring = useSpring({
    from: { scale: 1 },
    to: async (next) => {
      while (1) {
        await next({ scale: 1.03 });
        await next({ scale: 1 });
      }
    },
    config: config.wobbly
  });

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: 0.1 }
        }
      }}
      className={styles.card}
      style={{ position: 'relative', zIndex: 1 }}
    >
      <div className={styles.sectionHeader}>
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={styles.sectionTitle}
        >
          Job Preferences
        </motion.h2>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            variants={fieldAnimation}
            className={`${styles.formField} ${styles.purpleGradient}`}
          >
            <label className={styles.fieldLabel}>Preferred Job Titles</label>
            <motion.input
              type="text"
              name="jobTitles"
              value={formData.jobTitles}
              onChange={handleInputChange}
              className={styles.textInput}
              placeholder="e.g. Software Engineer, Product Manager"
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(168, 85, 247, 0.3)",
                transition: { duration: 0.2 }
              }}
            />
          </motion.div>

          <motion.div 
            variants={fieldAnimation}
            className={`${styles.formField} ${styles.blueGradient}`}
          >
            <label className={styles.fieldLabel}>Preferred Job Type</label>
            <motion.select
              name="jobType"
              value={formData.jobType}
              onChange={handleInputChange}
              className={styles.selectInput}
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.3)",
                transition: { duration: 0.2 }
              }}
            >
              <option value="">Select job type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </motion.select>
          </motion.div>

          <motion.div 
            variants={fieldAnimation}
            className={`${styles.formField} ${styles.greenGradient}`}
          >
            <label className={styles.fieldLabel}>Preferred Industries</label>
            <motion.input
              type="text"
              name="industries"
              value={formData.industries}
              onChange={handleInputChange}
              className={styles.textInput}
              placeholder="e.g. IT, Healthcare, Finance (press enter to separate)"
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.3)",
                transition: { duration: 0.2 }
              }}
            />
          </motion.div>

          <motion.div 
            variants={fieldAnimation}
            className={`${styles.formField} ${styles.yellowGradient}`}
          >
            <label className={styles.fieldLabel}>Preferred Department</label>
            <motion.input
              type="text"
              name="departments"
              value={formData.departments}
              onChange={handleInputChange}
              className={styles.textInput}
              placeholder="e.g. Engineering, Marketing, Sales (press enter to separate)"
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(234, 179, 8, 0.3)",
                transition: { duration: 0.2 }
              }}
            />
          </motion.div>

          <motion.div 
            variants={fieldAnimation}
            className={`${styles.formField} ${styles.pinkGradient}`}
          >
            <label className={styles.fieldLabel}>Preferred Location</label>
            <motion.input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={styles.textInput}
              placeholder="e.g. Bangalore, Remote"
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(236, 72, 153, 0.3)",
                transition: { duration: 0.2 }
              }}
            />
          </motion.div>

          <motion.div 
            variants={fieldAnimation}
            className={`${styles.formField} ${styles.indigoGradient}`}
          >
            <label className={styles.fieldLabel}>Expected Salary Range</label>
            <motion.input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleInputChange}
              className={styles.textInput}
              placeholder="e.g. 10-15 LPA"
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.3)",
                transition: { duration: 0.2 }
              }}
            />
          </motion.div>

          <motion.div 
            variants={fieldAnimation}
            className={`${styles.formField} ${styles.cyanGradient}`}
          >
            <label className={styles.fieldLabel}>Experience Level</label>
            <motion.select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleInputChange}
              className={styles.selectInput}
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.3)",
                transition: { duration: 0.2 }
              }}
            >
              <option value="">Select experience level</option>
              <option value="Fresher">Fresher</option>
              <option value="0-1 years">0-1 years</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </motion.select>
          </motion.div>

          <motion.div 
            variants={fieldAnimation}
            className={`${styles.formField} ${styles.emeraldGradient}`}
          >
            <label className={styles.fieldLabel}>Notice Period</label>
            <motion.select
              name="noticePeriod"
              value={formData.noticePeriod}
              onChange={handleInputChange}
              className={styles.selectInput}
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.3)",
                transition: { duration: 0.2 }
              }}
            >
              <option value="">Select notice period</option>
              <option value="Immediate">Immediate</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="60 Days">60 Days</option>
              <option value="90 Days">90 Days</option>
            </motion.select>
          </motion.div>

          <motion.div 
            variants={fieldAnimation}
            className={`${styles.formField} ${styles.amberGradient}`}
          >
            <label className={styles.fieldLabel}>Shift Preference</label>
            <motion.select
              name="shiftPreference"
              value={formData.shiftPreference}
              onChange={handleInputChange}
              className={styles.selectInput}
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.3)",
                transition: { duration: 0.2 }
              }}
            >
              <option value="">Select shift preference</option>
              <option value="Day">Day Shift</option>
              <option value="Night">Night Shift</option>
              <option value="Rotational">Rotational</option>
              <option value="Flexible">Flexible</option>
            </motion.select>
          </motion.div>

          <motion.div 
            variants={fieldAnimation}
            className={`${styles.formField} ${styles.fuchsiaGradient}`}
          >
            <label className={styles.fieldLabel}>Languages Known</label>
            <motion.input
              type="text"
              name="languagesKnown"
              value={formData.languagesKnown}
              onChange={handleInputChange}
              className={styles.textInput}
              placeholder="e.g. English, Hindi, Spanish"
              whileFocus={{ 
                scale: 1.02,
                boxShadow: "0 0 0 3px rgba(217, 70, 239, 0.3)",
                transition: { duration: 0.2 }
              }}
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            variants={fieldAnimation}
            className={`${styles.checkboxField} ${styles.blueGradient}`}
          >
            <motion.div 
              className={styles.checkboxContainer}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="checkbox"
                name="internship"
                checked={formData.internship}
                onChange={handleCheckboxChange}
                className={styles.checkboxInput}
              />
              <label className={styles.checkboxLabel}>Open to Internship</label>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={fieldAnimation}
            className={`${styles.checkboxField} ${styles.greenGradient}`}
          >
            <motion.div 
              className={styles.checkboxContainer}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="checkbox"
                name="jobAlert"
                checked={formData.jobAlert}
                onChange={handleCheckboxChange}
                className={styles.checkboxInput}
              />
              <label className={styles.checkboxLabel}>Receive Job Alerts</label>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex justify-end">
          <motion.button
            className={styles.submitButton}
            whileHover={{ 
              scale: 1.05,
              background: "linear-gradient(135deg, #4338ca, #6d28d9)",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              scale: buttonSpring.scale
            }}
          >
            Save Preferences
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
