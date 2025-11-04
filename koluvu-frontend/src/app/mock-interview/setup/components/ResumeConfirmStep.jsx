// src/app/mai/mock-interview/setup/components/ResumeConfirmStep

"use client";
import { motion } from "framer-motion";
import ResumeUpload from "../ResumeUpload";

export default function ResumeConfirmStep({ 
  form, 
  errors, 
  touched,
  uploading,
  uploadDone,
  loading,
  onResumeUpload,
  onResumeRemove,
  setResumeError,
  onChange,
  onBlur,
  onSubmit,
  onPrev 
}) {
  return (
    <motion.div
      key="section3"
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
        <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg mb-2">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Resume & Confirm</h2>
        <p className="text-xs text-gray-600">Upload resume and finalize setup</p>
      </div>

      <div className="space-y-4">
        {/* Resume Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-gray-700">
            Resume (PDF, max 5MB)
          </label>
          <div className="bg-gray-50/50 rounded-lg border-2 border-gray-200 p-3">
            <ResumeUpload
              file={form.resume}
              onFile={onResumeUpload}
              onRemove={onResumeRemove}
              error={errors.resume}
              setError={setResumeError}
              uploading={uploading}
              uploadDone={uploadDone}
              onBlur={() => onBlur({ target: { name: 'resume' } })}
            />
          </div>
        </div>

        {/* Permission Checkbox */}
        <div className="bg-blue-50/50 rounded-lg border border-blue-200 p-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="flex-shrink-0 mt-0.5">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  form.permission
                    ? "bg-blue-600 border-blue-600"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <input
                  type="checkbox"
                  name="permission"
                  checked={form.permission}
                  onChange={onChange}
                  onBlur={() => onBlur({ target: { name: 'permission' } })}
                  className="sr-only"
                  id="permission"
                />
                {form.permission && (
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
              </motion.div>
            </div>
            <div className="flex-1">
              <div className={`text-sm font-medium ${form.permission ? "text-blue-900" : "text-gray-700"}`}>
                I agree to share my resume for AI-powered question generation
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Your resume will be analyzed to create personalized interview questions.
              </div>
            </div>
          </label>
        </div>

        {/* Interview Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg border border-gray-200 p-3">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center text-sm">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Interview Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div><span className="font-semibold text-gray-700">Name:</span> {form.name || <span className="text-gray-400">—</span>}</div>
              <div><span className="font-semibold text-gray-700">Role:</span> {form.role || <span className="text-gray-400">—</span>}</div>
              <div><span className="font-semibold text-gray-700">Experience:</span> {form.experience || <span className="text-gray-400">—</span>}</div>
            </div>
            <div className="space-y-1">
              <div><span className="font-semibold text-gray-700">Language:</span> {form.language || <span className="text-gray-400">English (default)</span>}</div>
              <div><span className="font-semibold text-gray-700">Resume:</span> {form.resume ? form.resume.name : <span className="text-gray-400">—</span>}</div>
            </div>
            <div className="md:col-span-2 space-y-1">
              <div><span className="font-semibold text-gray-700">Types:</span> {form.interviewTypes.length ? form.interviewTypes.join(", ") : <span className="text-gray-400">—</span>}</div>
              <div><span className="font-semibold text-gray-700">Skills:</span> {form.skills.length ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {form.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {form.skills.length > 4 && (
                    <span className="text-gray-500 text-xs">+{form.skills.length - 4} more</span>
                  )}
                </div>
              ) : <span className="text-gray-400">—</span>}</div>
            </div>
          </div>
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
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
          disabled={loading || !form.permission || (form.resume && uploading)}
          onClick={onSubmit}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <span>Start Interview</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
