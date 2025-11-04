// src/app/main/dashboard/expired-jobs/page.js

import Link from 'next/link';
import { AnimatedWrapper, AnimatedTableRow } from '@koluvu/styles/employer/menubar/AnimatedWrapper';

async function getExpiredJobs() {
  return [
    {
      id: 1,
      title: 'UX Designer',
      company: 'Design Hub',
      postedDate: 'Dec 1, 2022',
      expiryDate: 'Mar 1, 2023',
      applicants: 35,
      status: 'Expired'
    },
    {
      id: 2,
      title: 'DevOps Engineer',
      company: 'Cloud Systems',
      postedDate: 'Jan 20, 2023',
      expiryDate: 'Apr 20, 2023',
      applicants: 22,
      status: 'Expired'
    }
  ];
}

export default async function ExpiredJobsPage() {
  const jobs = await getExpiredJobs();

  return (
    <AnimatedWrapper className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Expired Job Listings
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job, index) => (
                <AnimatedTableRow key={job.id} index={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.postedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.expiryDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {job.applicants}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/main/dashboard/employer/jobs/${job.id}`} className="text-blue-600 hover:text-blue-900">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <button className="text-gray-600 hover:text-gray-900">
                        <i className="fas fa-redo"></i>
                      </button>
                    </div>
                  </td>
                </AnimatedTableRow>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{jobs.length}</span> of <span className="font-medium">{jobs.length}</span> results
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
}
