// src/app/mai/mock-interview/setup/components/InterviewStepupStep.jsx

"use client";
import { motion } from "framer-motion";
import SkillChips from "../SkillChips";

const interviewTypes = ["Technical", "HR", "Behavioral"];

export default function InterviewSetupStep({ 
  form, 
  errors, 
  touched,
  onChange, 
  onBlur,
  onSkillChange,
  onNext,
  onPrev 
}) {
  return (
    <motion.div
      key="section2"
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      className="space-y-4"
    >
      {/* Header */}
      <div className="text-center pb-2 border-b border-gray-100">
        <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mb-2">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Interview Setup</h2>
        <p className="text-xs text-gray-600">Choose interview types and skills</p>
      </div>

      <div className="space-y-4">
        {/* Interview Type Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700">Interview Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {interviewTypes.map(type => (
              <motion.label 
                key={type} 
                whileHover={{ scale: 1.02 }}
                className={`relative flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  form.interviewTypes.includes(type)
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  name="interviewTypes"
                  value={type}
                  checked={form.interviewTypes.includes(type)}
                  onChange={onChange}
                  onBlur={() => onBlur({ target: { name: 'interviewTypes' } })}
                  className="sr-only"
                />
                <div className={`flex-shrink-0 w-4 h-4 rounded border-2 mr-2 flex items-center justify-center transition-all duration-200 ${
                  form.interviewTypes.includes(type)
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300"
                }`}>
                  {form.interviewTypes.includes(type) && (
                    <motion.svg 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2.5 h-2.5 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{type}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {type === 'Technical' && 'Coding, algorithms'}
                    {type === 'HR' && 'Background, culture fit'}
                    {type === 'Behavioral' && 'Situation scenarios'}
                  </div>
                </div>
              </motion.label>
            ))}
          </div>
          {errors.interviewTypes && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600 mt-1 ml-1 flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors.interviewTypes}
            </motion.div>
          )}
        </div>

        {/* Skills Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700">Technologies / Skills</label>
          <div className="bg-gray-50/50 rounded-lg border-2 border-gray-200 p-3">
            <SkillChips 
              value={form.skills} 
              onChange={onSkillChange} 
              onBlur={() => onBlur({ target: { name: 'skills' } })} 
            />
          </div>
          {errors.skills && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600 mt-1 ml-1 flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors.skills}
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold shadow-md hover:bg-gray-200 transition-all duration-300 flex items-center space-x-2 text-sm"
          onClick={onPrev}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
          onClick={onNext}
          disabled={!!(errors.interviewTypes || errors.skills)}
        >
          <span>Continue</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
