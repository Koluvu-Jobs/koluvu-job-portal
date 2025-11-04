// src/app/jobs/components/JobSearch.js

'use client';

import { MotionDiv, MotionInput } from '@koluvu/components/motion';

export default function JobSearch({ search, setSearch }) {
  return (
    <MotionDiv
      className="mb-6 w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <MotionInput
          type="text"
          placeholder="Search jobs by title, company or keywords..."
          className="block w-full pl-10 pr-3 py-3 md:py-4 text-sm md:text-base border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          whileFocus={{
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)',
            borderColor: '#3b82f6'
          }}
        />
      </div>
    </MotionDiv>
  );
}
