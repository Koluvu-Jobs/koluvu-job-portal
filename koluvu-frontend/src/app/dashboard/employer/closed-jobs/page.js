'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import AuthContext from '../../../../contexts/AuthContext';

export default function ClosedJobsPage() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [summary, setSummary] = useState({
    total_closed_jobs: 0,
    total_applications: 0,
    total_views: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobs, setSelectedJobs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchClosedJobs();
  }, [searchTerm]);

  const fetchClosedJobs = async () => {
    try {
      setLoading(true);
      
      if (!isAuthenticated) {
        toast.error('Please login to continue');
        router.push('/auth/login/employer');
        return;
      }

      let url = '/api/employer/closed-jobs';
      if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(url);

      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch closed jobs');
      }

      const data = await response.json();
      setJobs(data.jobs || []);
      setSummary(data.summary || {
        total_closed_jobs: 0,
        total_applications: 0,
        total_views: 0,
      });
    } catch (error) {
      console.error('Error fetching closed jobs:', error);
      toast.error('Failed to load closed jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async (jobId) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please log in to perform this action');
        return;
      }

      const response = await fetch(`/api/employer/jobs/${jobId}/reactivate`, {
        method: 'POST',
      });

      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        logout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to reactivate job' }));
        throw new Error(errorData.error || 'Failed to reactivate job');
      }

      toast.success('Job reactivated successfully!');
      fetchClosedJobs(); // Refresh the list
    } catch (error) {
      console.error('Error reactivating job:', error);
      toast.error('Failed to reactivate job');
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      if (!isAuthenticated) {
        toast.error('Please log in to perform this action');
        return;
      }

      const response = await fetch(`/api/employer/jobs/${jobId}/delete`, {
        method: 'POST',
      });

      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        logout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete job' }));
        throw new Error(errorData.error || 'Failed to delete job');
      }

      toast.success('Job deleted successfully!');
      fetchClosedJobs(); // Refresh the list
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedJobs.length === 0) {
      toast.error('Please select at least one job');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please log in to perform this action');
      return;
    }

    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedJobs.length} job(s)? This action cannot be undone.`)) {
        return;
      }
    }

    try {
      const response = await fetch('/api/employer/jobs/closed-bulk-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_ids: selectedJobs,
          action: action,
        }),
      });

      if (!response.ok) {
        throw new Error('Bulk action failed');
      }

      const data = await response.json();
      toast.success(data.message);
      setSelectedJobs([]);
      fetchClosedJobs(); // Refresh the list
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedJobs(jobs.map(job => job.id));
    } else {
      setSelectedJobs([]);
    }
  };

  const handleSelectJob = (jobId) => {
    if (selectedJobs.includes(jobId)) {
      setSelectedJobs(selectedJobs.filter(id => id !== jobId));
    } else {
      setSelectedJobs([...selectedJobs, jobId]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading closed jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Closed Job Listings</h1>
          <p className="text-gray-600">Manage your closed job postings</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Closed Jobs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total_closed_jobs}</p>
              </div>
              <div className="bg-gray-100 rounded-full p-3">
                <i className="fas fa-folder text-gray-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total_applications}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <i className="fas fa-users text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total_views}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <i className="fas fa-eye text-green-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search closed jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>

            {selectedJobs.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('reactivate')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <i className="fas fa-redo mr-2"></i>
                  Reactivate ({selectedJobs.length})
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Delete ({selectedJobs.length})
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-folder-open text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Closed Jobs</h3>
              <p className="text-gray-500">You don't have any closed job postings</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedJobs.length === jobs.length && jobs.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posted Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Closed Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedJobs.includes(job.id)}
                          onChange={() => handleSelectJob(job.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        <div className="text-sm text-gray-500">{job.department || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {job.location || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(job.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(job.updated_at)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {job.applications_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {job.views_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => router.push(`/dashboard/employer/jobs/${job.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            onClick={() => handleReactivate(job.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Reactivate Job"
                          >
                            <i className="fas fa-redo"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Job"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
