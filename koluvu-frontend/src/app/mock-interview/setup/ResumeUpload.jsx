// src/app/mai/mock-interview/setup/components/ResumeUpload.jsx

"use client";
import { useRef } from "react";
import { motion } from "framer-motion";

export default function ResumeUpload({ file, onFile, onRemove, error, setError }) {
  const inputRef = useRef();

  function handleFile(files) {
    const f = files[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }
    setError("");
    onFile(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files);
  }

  function handleChange(e) {
    handleFile(e.target.files);
  }

  return (    <div>
      {!file ? (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 p-8 cursor-pointer text-center group"
          onClick={() => inputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          tabIndex={0}
          role="button"
          aria-label="Upload resume"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow duration-300"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </motion.div>
          <div className="text-gray-800 font-semibold text-lg mb-2">Drag & drop your PDF resume here</div>
          <div className="text-sm text-gray-500 mb-4">or click to browse files</div>
          <div className="text-xs text-gray-400">PDF only, max 5MB</div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleChange}
          />
        </motion.div>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl px-6 py-4"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="text-green-800 font-semibold truncate max-w-[200px]">{file.name}</div>
              <div className="text-xs text-green-600">
                {(file.size / 1024 / 1024).toFixed(1)} MB • PDF Document
              </div>
            </div>
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-green-600 hover:text-green-800 focus:outline-none text-sm font-medium bg-white px-3 py-1 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-200"
            onClick={onRemove}
            aria-label="Remove resume"
          >
            Remove
          </motion.button>
        </motion.div>
      )}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600 mt-3 ml-1 flex items-center bg-red-50 px-3 py-2 rounded-lg border border-red-200"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.div>
      )}
    </div>
  );
} 
