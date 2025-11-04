// src/app/main/verification/page.js

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@koluvu/contexts/AuthContext';

export default function VerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const currentUser = storedUser ? JSON.parse(storedUser) : null;
      
      if (currentUser) {
        // Redirect based on user role
        const redirectPath = currentUser.role === 'employer' 
          ? '/dashboard/employer/verification' 
          : '/dashboard/employee/verification';
        
        router.push(redirectPath);
      } else {
        // If not logged in, redirect to login with the current path as redirect
        const currentPath = window.location.pathname + (window.location.search || '');
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification...</p>
        </div>
      </div>
    );
  }

  return null;
}
