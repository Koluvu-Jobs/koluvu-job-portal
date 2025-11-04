// src/components/ui/label.js

'use client';

import React from 'react';

const Label = React.forwardRef(({ 
  className = '', 
  required = false,
  children,
  ...props 
}, ref) => {
  return (
    <label
      ref={ref}
      className={`
        text-sm font-medium leading-none peer-disabled:cursor-not-allowed 
        peer-disabled:opacity-70 text-gray-900 dark:text-gray-100 
        flex items-center gap-1 ${className}
      `}
      {...props}
    >
      {children}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
});

Label.displayName = 'Label';

export { Label };
