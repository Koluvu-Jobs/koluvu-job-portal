// src/app/main/dashboard/active-jobs/page.js

"use client";

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { AnimatedWrapper, AnimatedTableRow, AnimatedButton } from '@koluvu/styles/employer/menubar/AnimatedWrapper';
import RefreshButton from './RefreshButton';
import { toast } from 'react-toastify';
import AuthContext from '../../../../contexts/AuthContext';

export default function ActiveJobsPage() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [summary, setSummary] = useState({
    total_active_jobs: 0,
    total_applications: 0,
    total_views: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobs, setSelectedJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      if (!isAuthenticated) {
        toast.error('Please log in to view jobs');
        return;
      }

      const url = searchQuery 
        ? `/api/employer/active-jobs?search=${encodeURIComponent(searchQuery)}`
        : '/api/employer/active-jobs';

      const response = await fetch(url);

      if (response.status === 403) {
        // Token might be expired, try to refresh
        toast.warn('Session expired, please log in again');
        logout();
        return;
      }

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch jobs');
        } else {
          // Server returned HTML (likely an error page)
          const errorText = await response.text();
          console.error('Server returned HTML instead of JSON:', errorText);
          throw new Error('Server error occurred');
        }
      }

      const data = await response.json();
      setJobs(data.jobs || []);
      setSummary(data.summary || {});
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery]);

  const handleJobAction = async (jobId, action) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please log in to perform this action');
        return;
      }
      
      let url;
      let method = 'POST'; // All our Next.js API routes use POST
      
      if (action === 'delete') {
        url = `/api/employer/jobs/${jobId}/delete`;
      } else if (action === 'close') {
        url = `/api/employer/jobs/${jobId}/close`;
      } else if (action === 'activate') {
        url = `/api/employer/jobs/${jobId}/activate`;
      } else {
        url = `/api/employer/jobs/${jobId}/${action}`;
      }
      
      const response = await fetch(url, {
        method: method,
      });

      if (response.status === 403) {
        toast.warn('Session expired, please log in again');
        logout();
        return;
      }

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Action failed');
        } else {
          // Server returned HTML (likely an error page)
          const errorText = await response.text();
          console.error('Server returned HTML instead of JSON:', errorText);
          throw new Error('Server error occurred');
        }
      }

      const data = await response.json();

      toast.success(data.message || 'Action completed successfully');
      fetchJobs(); 
    } catch (error) {
      console.error('Error performing action:', error);
      toast.error(error.message || 'Failed to perform action');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedJobs.length === 0) {
      toast.warning('Please select jobs first');
      return;
    }

    try {
      if (!isAuthenticated) {
        toast.error('Please log in to perform this action');
        return;
      }
      
      const response = await fetch('/api/employer/jobs/bulk-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_ids: selectedJobs,
          action: action,
        }),
      });

      if (response.status === 403) {
        toast.warn('Session expired, please log in again');
        logout();
        return;
      }

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Bulk action failed');
        } else {
          const errorText = await response.text();
          console.error('Server returned HTML instead of JSON:', errorText);
          throw new Error('Server error occurred');
        }
      }

      const data = await response.json();

      toast.success(data.message || 'Bulk action completed');
      setSelectedJobs([]);
      fetchJobs();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error(error.message || 'Failed to perform bulk action');
    }
  };

  const toggleJobSelection = (jobId) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(jobs.map(job => job.id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AnimatedWrapper className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Active Job Listings
          </h1>
          <div className="flex gap-4 mt-2 text-sm text-gray-600">
            <span>Total Jobs: <strong>{summary.total_active_jobs}</strong></span>
            <span>Total Applications: <strong>{summary.total_applications}</strong></span>
            <span>Total Views: <strong>{summary.total_views}</strong></span>
          </div>
        </div>
        <RefreshButton onRefresh={fetchJobs} />
      </div>

      {/* Search and Bulk Actions */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {selectedJobs.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('close')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              Close Selected ({selectedJobs.length})
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Delete Selected ({selectedJobs.length})
            </button>
          </div>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Active Jobs</h3>
          <p className="text-gray-500 mb-4">You haven't posted any active jobs yet.</p>
          <Link href="/dashboard/employer?tab=post-jobs">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Post Your First Job
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedJobs.length === jobs.length && jobs.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Posted Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Applicants</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job, index) => (
                  <AnimatedTableRow key={job.id} index={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job.id)}
                        onChange={() => toggleJobSelection(job.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-xs text-gray-500">{job.job_type} • {job.employment_type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(job.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(job.application_deadline)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer">
                        {job.applications_count || 0} Applicants
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{job.views_count || 0}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link href={`/dashboard/employer/jobs/${job.id}`} className="text-blue-600 hover:text-blue-900 transition-colors" title="View">
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link href={`/dashboard/employer/jobs/${job.id}/edit`} className="text-yellow-600 hover:text-yellow-900 transition-colors" title="Edit">
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button 
                          onClick={() => handleJobAction(job.id, 'close')}
                          className="text-orange-600 hover:text-orange-900 transition-colors"
                          title="Close"
                        >
                          <i className="fas fa-times-circle"></i>
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete the job "${job.title}"? This action cannot be undone.`)) {
                              handleJobAction(job.id, 'delete');
                            }
                          }}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </AnimatedTableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AnimatedWrapper>
  );
}
