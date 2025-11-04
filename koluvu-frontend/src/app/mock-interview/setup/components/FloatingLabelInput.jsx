// src/app/mai/mock-interview/setup/components/DloatingLebalInput.jsx

"use client";
import { motion } from "framer-motion";

export default function FloatingLabelInput({ label, id, value, onChange, error, ...props }) {
  return (
    <div className="relative w-full group">
      <input
        id={id}
        value={value}
        onChange={onChange}
        className={`peer w-full rounded-lg border-2 px-3 py-2 bg-gray-50/50 text-gray-800 placeholder-transparent transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white
                    hover:border-gray-300 hover:bg-gray-50
                    ${value ? "pt-4 pb-0.5" : "pt-2 pb-2"}
                    ${error ? "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200"}`}
        placeholder={label}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 pointer-events-none transition-all duration-300 ease-in-out
                    ${value || props.placeholder 
                      ? "top-1 text-xs font-medium" 
                      : "top-2 text-sm"
                    }
                    ${error 
                      ? "text-red-600" 
                      : value 
                        ? "text-blue-600" 
                        : "text-gray-500 group-focus-within:text-blue-600"
                    }
                    ${value || props.placeholder ? "" : "group-focus-within:top-1 group-focus-within:text-xs group-focus-within:font-medium"}`}
      >
        {label}
      </label>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-600 mt-1 ml-1 flex items-center"
        >
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
    </div>
  );
}
