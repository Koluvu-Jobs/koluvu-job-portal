// src/api/jobs.js - API functions for jobs

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

export const jobsAPI = {
  // Get all jobs
  getAllJobs: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/jobs?${queryParams}`);
    if (!response.ok) throw new Error("Failed to fetch jobs");
    return response.json();
  },

  // Get job by ID
  getJobById: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
    if (!response.ok) throw new Error("Failed to fetch job");
    return response.json();
  },

  // Create new job (for employers)
  createJob: async (jobData) => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) throw new Error("Failed to create job");
    return response.json();
  },

  // Update job
  updateJob: async (jobId, jobData) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(jobData),
    });
    if (!response.ok) throw new Error("Failed to update job");
    return response.json();
  },

  // Delete job
  deleteJob: async (jobId) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete job");
    return response.json();
  },

  // Search jobs
  searchJobs: async (searchQuery, filters = {}) => {
    const queryParams = new URLSearchParams({
      search: searchQuery,
      ...filters,
    }).toString();
    const response = await fetch(`${API_BASE_URL}/jobs/search?${queryParams}`);
    if (!response.ok) throw new Error("Failed to search jobs");
    return response.json();
  },
};
