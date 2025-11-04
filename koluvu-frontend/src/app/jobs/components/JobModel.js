// src/app/jobs/components/JobModal.js

'use client';

import Image from "next/image";
import styles from '@koluvu/styles/home/jobs/job-card.module.css';
import { MotionDiv, MotionButton, MotionSpan, AnimatePresence } from '@koluvu/components/motion';

export default function JobModal({ job, onClose }) {
  return (
    <AnimatePresence>
      <MotionDiv
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <MotionDiv
          className="bg-white rounded-xl max-w-sm md:max-w-2xl lg:max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <MotionDiv
                  className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200"
                  whileHover={{ rotate: 2, scale: 1.05 }}
                >
                  <Image
                    src={job.companyLogo}
                    alt={job.company}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </MotionDiv>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">{job.title}</h2>
                  <p className="text-gray-600 text-sm md:text-base">{job.company}</p>
                  <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </p>
                </div>
              </div>
              <MotionButton
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors self-start md:self-center"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </MotionButton>
            </div>

            <div className="space-y-6">
              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-semibold text-gray-800 mb-3">Job Description</h3>
                <p className="text-gray-700 text-sm md:text-base">{job.description}</p>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h3 className="font-semibold text-gray-800 mb-3">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <MotionSpan
                      key={skill}
                      className="px-2 py-1 sm:px-3 sm:py-1 bg-gray-100 text-gray-800 rounded-full text-xs md:text-sm font-medium"
                      whileHover={{ scale: 1.05, backgroundColor: '#e5e7eb' }}
                    >
                      {skill}
                    </MotionSpan>
                  ))}
                </div>
              </MotionDiv>

              <MotionDiv
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div>
                  <p className="text-gray-500 text-sm">Industry</p>
                  <p className="font-medium text-gray-700 text-sm md:text-base">{job.industry}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Job Type</p>
                  <p className="font-medium text-gray-700 text-sm md:text-base">{job.type}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Department</p>
                  <p className="font-medium text-gray-700 text-sm md:text-base">{job.department}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Posted</p>
                  <p className="font-medium text-gray-700 text-sm md:text-base">{job.posted}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Salary Range</p>
                  <p className="font-medium text-gray-700 text-sm md:text-base">{job.salary}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Experience</p>
                  <p className="font-medium text-gray-700 text-sm md:text-base">{job.experience}</p>
                </div>
              </MotionDiv>

              <MotionDiv
                className="pt-4 space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <MotionButton
                  className={`w-full py-3 ${styles.applyButton} text-white rounded-lg font-medium hover:bg-green-700 transition-colors`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Now
                </MotionButton>
                <MotionButton
                  className="w-full py-3 bg-white text-blue-600 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Job
                </MotionButton>
              </MotionDiv>
            </div>
          </div>
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>
  );
}
