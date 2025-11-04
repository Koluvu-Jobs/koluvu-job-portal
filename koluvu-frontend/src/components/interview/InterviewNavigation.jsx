// src/components/interview/InterviewNavigation.jsx

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const InterviewNavigation = ({ setupId }) => {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleStartInterview = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Generate interview script
      const response = await fetch('/api/generate-interview-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setupId })
      });

      const data = await response.json();
        if (data.scriptId) {
        // Navigate to conversational interview room with script ID
        router.push(`/dashboard/employee/mock-interview/conversational-room?scriptId=${data.scriptId}`);
      } else {
        setError(data.error || 'Failed to generate interview script');
      }
    } catch (err) {
      setError('Failed to start interview. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="text-center space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <button
        onClick={handleStartInterview}
        disabled={isGenerating}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Questions...
          </span>        ) : (
          'Start Conversational Interview'
        )}
      </button>
        <p className="text-sm text-gray-600">
        This will generate personalized questions and start the conversational AI interview session.
      </p>
    </div>
  );
};
