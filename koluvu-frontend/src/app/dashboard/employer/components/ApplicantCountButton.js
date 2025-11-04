// src/app/main/dashboard/employer/active-jobs/components/ApplicantCountButton.js
'use client';

import Link from 'next/link';

export default function ApplicantCountButton({ jobId, count = 24 }) {
  return (
    <Link 
      href={`/dashboard/employer/applicants?jobId=${jobId}`}
      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
    >
      {count} Applicants
    </Link>
  );
}
