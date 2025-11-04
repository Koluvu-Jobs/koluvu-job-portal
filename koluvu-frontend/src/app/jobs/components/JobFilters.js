// src/app/jobs/components/JobFilters.js

'use client';

import { motion } from 'framer-motion';

export default function JobFilters({
  filters,
  setFilters,
  jobTypes,
  industries,
  departments,
  locations,
  experienceLevels,
  onClear
}) {
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const FilterSection = ({ title, filterName, options }) => (
    <motion.div
      className="p-4 rounded-lg mb-4 border border-orange-100 bg-white"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(234, 88, 12, 0.4)",
        borderColor: "rgba(234, 88, 12, 0.3)",
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 10
        }
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-gray-800 text-base md:text-lg">{title}</h4>
      </div>
      <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar text-sm md:text-base">
        <motion.li
          whileHover={{
            x: 3,
            backgroundColor: "rgba(234, 88, 12, 0.08)"
          }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <label className="flex items-center gap-2 cursor-pointer p-1 rounded">
            <input
              type="radio"
              name={filterName}
              checked={filters[filterName] === ""}
              onChange={() => handleFilterChange(filterName, "")}
              className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
            />
            <span className="text-gray-700">All</span>
          </label>
        </motion.li>
        {options.map((option) => (
          <motion.li
            key={option}
            whileHover={{
              x: 3,
              backgroundColor: "rgba(234, 88, 12, 0.08)"
            }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <label className="flex items-center gap-2 cursor-pointer p-1 rounded">
              <input
                type="radio"
                name={filterName}
                checked={filters[filterName] === option}
                onChange={() => handleFilterChange(filterName, option)}
                className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    <div className="space-y-4">
      <FilterSection
        title="Job Type"
        filterName="type"
        options={jobTypes}
      />
      <FilterSection
        title="Industry"
        filterName="industry"
        options={industries}
      />
      <FilterSection
        title="Department"
        filterName="department"
        options={departments}
      />
      <FilterSection
        title="Location"
        filterName="location"
        options={locations}
      />
      <FilterSection
        title="Experience Level"
        filterName="experience"
        options={experienceLevels}
      />

      <motion.button
        onClick={onClear}
        className="w-full py-2.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium border border-orange-200 hover:bg-orange-100"
        whileHover={{
          scale: 1.02,
          boxShadow: "0 4px 20px -3px rgba(234, 88, 12, 0.4)",
          borderColor: "rgb(234, 88, 12)"
        }}
        whileTap={{ scale: 0.98 }}
      >
        Clear All Filters
      </motion.button>
    </div>
  );
}
