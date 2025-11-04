// src/app/jobs/components/JobCard.js

'use client';

import { useState } from "react";
import Image from "next/image";
import JobModal from "./JobModel";
import { MotionDiv, MotionButton } from '@koluvu/components/motion';

export default function JobCard({ job }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback image for when company logo fails to load
  const fallbackLogo = '/images/default-company-logo.png';

  return (
    <>
      <MotionDiv 
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <MotionDiv 
              className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-200"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Image 
                src={imageError ? fallbackLogo : job.companyLogo}
                alt={`${job.company} logo`}
                width={64}
                height={64}
                className="object-contain"
                onError={() => setImageError(true)}
              />
            </MotionDiv>
            <div>
              <MotionButton
                className="text-lg font-semibold text-gray-800 hover:text-blue-500 cursor-pointer transition-colors text-left"
                onClick={() => setIsModalOpen(true)}
                whileHover={{ color: '#3b82f6' }}
                transition={{ duration: 0.2 }}
              >
                {job.title}
              </MotionButton>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.company} • {job.location}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm mb-6">
            <div>
              <p className="text-gray-500">Industry</p>
              <p className="font-medium text-gray-700">{job.industry}</p>
            </div>
            <div>
              <p className="text-gray-500">Salary</p>
              <p className="font-medium text-gray-700">{job.salary}</p>
            </div>
            <div>
              <p className="text-gray-500">Experience</p>
              <p className="font-medium text-gray-700">{job.experience}</p>
            </div>
            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-medium text-gray-700">{job.type}</p>
            </div>
          </div>
          
          <MotionButton 
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-4 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-500 hover:text-white transition-colors duration-200 shadow-sm"
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 4px 12px rgba(96, 165, 250, 0.25)',
              backgroundColor: '#60a5fa'
            }}
            whileTap={{ 
              scale: 0.98,
              backgroundColor: '#3b82f6'
            }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 10
            }}
          >
            View Details
          </MotionButton>
        </div>
      </MotionDiv>

      {isModalOpen && (
        <JobModal job={job} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
