import React from "react";

/**
 * Character counter component with limit validation
 * Shows current count, limit, and visual feedback
 */
const CharacterCounter = ({ current = 0, limit, className = "" }) => {
  const percentage = (current / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isOverLimit = percentage >= 100;

  return (
    <div className={`flex items-center justify-between text-sm ${className}`}>
      <div className="flex items-center gap-2">
        <span
          className={`font-medium ${
            isOverLimit
              ? "text-red-600"
              : isNearLimit
              ? "text-orange-600"
              : "text-gray-600"
          }`}
        >
          {current} / {limit} characters
        </span>
        {isOverLimit && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            Over limit
          </span>
        )}
        {isNearLimit && !isOverLimit && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
            Near limit
          </span>
        )}
      </div>
      {/* Progress bar */}
      <div className="flex-1 max-w-[120px] h-2 bg-gray-200 rounded-full overflow-hidden ml-3">
        <div
          className={`h-full transition-all duration-300 ${
            isOverLimit
              ? "bg-red-500"
              : isNearLimit
              ? "bg-orange-500"
              : "bg-green-500"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default CharacterCounter;
