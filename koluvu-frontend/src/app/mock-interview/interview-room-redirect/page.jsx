// src/app/main/mock-interview/interview-room-direct/page.jsx

"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const InterviewRoomRedirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Redirect to the new conversational room
    const scriptId = searchParams.get('scriptId');
    const redirectUrl = scriptId 
      ? `/main/mock-interview/conversational-room?scriptId=${scriptId}`
      : '/main/mock-interview/conversational-room';
    
    router.replace(redirectUrl);
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to conversational interview...</p>
      </div>
    </div>
  );
};

export default InterviewRoomRedirect;
