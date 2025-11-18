"use client";

import React from "react";

const Checkbox = React.forwardRef(
  ({ className = "", checked, onCheckedChange, children, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className={`
          h-4 w-4 rounded border border-gray-300 text-blue-600 
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${className}
        `}
          {...props}
        />
        {children && <span className="text-sm text-gray-700">{children}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
