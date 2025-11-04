// src/app/mai/mock-interview/setup/components/PersonalInfoStep.jsx

"use client";
import { motion } from "framer-motion";
import FloatingLabelInput from "./FloatingLabelInput";

const roles = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "Product Manager", "DevOps Engineer", "UI/UX Designer"];
const experienceLevels = ["Fresher", "Junior", "Mid", "Senior"];
const languages = ["English", "Hindi", "Spanish", "French", "German", "Other"];

export default function PersonalInfoStep({ 
  form, 
  errors, 
  touched,
  onChange, 
  onBlur,
  onNext 
}) {
  return (
    <motion.div
      key="section1"
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
        <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mb-2">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Personal Information</h2>
        <p className="text-xs text-gray-600">Basic details to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="md:col-span-2">
          <FloatingLabelInput
            label="Full Name"
            id="name"
            name="name"
            value={form.name}
            onChange={onChange}
            onBlur={onBlur}
            required
            error={errors.name}
          />
        </div>

        {/* Role Selection */}
        <div className="space-y-1">
          <label htmlFor="role" className="block text-xs font-semibold text-gray-700">
            Role You're Applying For
          </label>
          <select
            name="role"
            id="role"
            value={form.role}
            onChange={onChange}
            onBlur={onBlur}
            required
            className={`w-full rounded-xl border-2 px-3 py-2 text-gray-800 bg-gray-50/50 transition-all duration-300 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white
                       hover:border-gray-300 hover:bg-gray-50
                       ${errors.role ? "border-red-400 bg-red-50/30" : "border-gray-200"}`}
          >
            <option value="">Select a role</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {errors.role && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600 mt-1 ml-1 flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors.role}
            </motion.div>
          )}
        </div>

        {/* Experience Level */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700">Experience Level</label>
          <div className="grid grid-cols-2 gap-1">
            {experienceLevels.map(level => (
              <motion.button
                type="button"
                key={level}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`rounded-lg px-2 py-1.5 text-xs font-semibold border-2 transition-all duration-300 text-center
                  ${form.experience === level
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg ring-2 ring-blue-200"
                    : "bg-gray-50/50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"}`}
                onClick={() => onChange({ target: { name: 'experience', value: level } })}
                onBlur={() => onBlur({ target: { name: 'experience' } })}
              >
                {level}
              </motion.button>
            ))}
          </div>
          {errors.experience && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600 mt-1 ml-1 flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {errors.experience}
            </motion.div>
          )}
        </div>

        {/* Language Selection */}
        <div className="md:col-span-2 space-y-1">
          <label htmlFor="language" className="block text-xs font-semibold text-gray-700">
            Interview Language <span className="text-xs text-gray-500 font-normal">(optional)</span>
          </label>
          <select
            name="language"
            id="language"
            value={form.language}
            onChange={onChange}
            className="w-full rounded-xl border-2 px-3 py-2 text-gray-800 bg-gray-50/50 transition-all duration-300 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white
                       hover:border-gray-300 hover:bg-gray-50 border-gray-200"
          >
            <option value="">Select a language</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-2">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
          onClick={onNext}
          disabled={!!(errors.name || errors.role || errors.experience)}
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
