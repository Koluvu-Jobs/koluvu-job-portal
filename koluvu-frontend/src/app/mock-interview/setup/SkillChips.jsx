// src/app/mai/mock-interview/setup/components/SkillChips.jsx

"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function SkillChips({ value, onChange }) {
  const [input, setInput] = useState("");

  function handleInput(e) {
    setInput(e.target.value);
  }

  function handleKeyDown(e) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
      }
      setInput("");
    } else if (e.key === "Backspace" && !input && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  function removeSkill(idx) {
    onChange(value.filter((_, i) => i !== idx));
  }
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-4 py-4 min-h-[3rem] transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
      {value.map((skill, idx) => (
        <motion.span 
          key={skill + idx} 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full px-3 py-1.5 text-sm font-medium shadow-sm"
        >
          {skill}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ml-2 text-blue-200 hover:text-white focus:outline-none transition-colors duration-200"
            onClick={() => removeSkill(idx)}
            aria-label={`Remove ${skill}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>        </motion.span>
      ))}
      <input
        type="text"
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-[140px] bg-transparent border-none outline-none text-sm px-2 py-1 placeholder-gray-400"
        placeholder={value.length ? "Add another skill..." : "e.g. React, Node.js, Python, SQL"}
        aria-label="Add a skill or technology"
      />
    </div>
  );
}
