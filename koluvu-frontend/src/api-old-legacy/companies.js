// src/api/companies.js - API functions for companies

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

export const companiesAPI = {
  // Get all companies
  getAllCompanies: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/companies?${queryParams}`);
    if (!response.ok) throw new Error("Failed to fetch companies");
    return response.json();
  },

  // Get company by ID
  getCompanyById: async (companyId) => {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}`);
    if (!response.ok) throw new Error("Failed to fetch company");
    return response.json();
  },

  // Create new company
  createCompany: async (companyData) => {
    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(companyData),
    });
    if (!response.ok) throw new Error("Failed to create company");
    return response.json();
  },

  // Update company
  updateCompany: async (companyId, companyData) => {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(companyData),
    });
    if (!response.ok) throw new Error("Failed to update company");
    return response.json();
  },

  // Delete company
  deleteCompany: async (companyId) => {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete company");
    return response.json();
  },

  // Get company jobs
  getCompanyJobs: async (companyId) => {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/jobs`);
    if (!response.ok) throw new Error("Failed to fetch company jobs");
    return response.json();
  },

  // Search companies
  searchCompanies: async (searchQuery, filters = {}) => {
    const queryParams = new URLSearchParams({
      search: searchQuery,
      ...filters,
    }).toString();
    const response = await fetch(
      `${API_BASE_URL}/companies/search?${queryParams}`
    );
    if (!response.ok) throw new Error("Failed to search companies");
    return response.json();
  },
};
