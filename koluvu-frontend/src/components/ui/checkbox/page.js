// src/components/ui/checkbox/page.js

"use client";

import React from "react";

const Checkbox = ({
  checked = false,
  onCheckedChange,
  className = "",
  id,
  ...props
}) => {
  const handleChange = (e) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };

  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={handleChange}
      className={`
        w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
        focus:ring-blue-500 focus:ring-2 cursor-pointer
        ${className}
      `}
      {...props}
    />
  );
};

export { Checkbox };
