// src/hooks/useJobs.js - Custom hook for job management

import { useState, useEffect } from "react";
// import { jobsAPI } from "@koluvu/api/jobs";

export const useJobs = (filters = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalJobs, setTotalJobs] = useState(0);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // const response = await jobsAPI.getAllJobs(filters);
      // Mock response for now since jobsAPI is not available
      const response = { data: [], total: 0 };
      setJobs(response.data || response);
      setTotalJobs(response.total || response.length);
      setError(null);
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [JSON.stringify(filters)]);

  const createJob = async (jobData) => {
    try {
      setLoading(true);
      // const newJob = await jobsAPI.createJob(jobData);
      // Mock response for now since jobsAPI is not available
      const newJob = { id: Date.now(), ...jobData };
      setJobs((prev) => [newJob, ...prev]);
      setTotalJobs((prev) => prev + 1);
      return newJob;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (jobId, jobData) => {
    try {
      setLoading(true);
      // const updatedJob = await jobsAPI.updateJob(jobId, jobData);
      // Mock response for now since jobsAPI is not available
      const updatedJob = { id: jobId, ...jobData };
      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? updatedJob : job))
      );
      return updatedJob;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      setLoading(true);
      // await jobsAPI.deleteJob(jobId);
      // Mock deletion for now since jobsAPI is not available
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      setTotalJobs((prev) => prev - 1);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = async (searchQuery, searchFilters = {}) => {
    try {
      setLoading(true);
      // const response = await jobsAPI.searchJobs(searchQuery, searchFilters);
      // Mock search response for now since jobsAPI is not available
      const response = { data: [], total: 0 };
      setJobs(response.data || response);
      setTotalJobs(response.total || response.length);
      setError(null);
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    loading,
    error,
    totalJobs,
    createJob,
    updateJob,
    deleteJob,
    searchJobs,
    refetch: fetchJobs,
  };
};
