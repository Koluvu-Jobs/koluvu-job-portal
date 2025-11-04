// src/lib/api.js

// API utility functions for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Helper function to check if backend is available
const isBackendAvailable = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/companies/`, {
      method: "HEAD",
      timeout: 5000,
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Helper function to handle API errors gracefully
const handleApiError = (error, fallbackData = null) => {
  console.error("API Error:", error);

  if (fallbackData) {
    console.warn("Using fallback data due to API error");
    return fallbackData;
  }

  throw error;
};

export const api = {
  // Fetch companies/employers for the companies page
  async fetchCompanies(params = {}) {
    const searchParams = new URLSearchParams();

    // Add query parameters
    if (params.search) searchParams.append("search", params.search);
    if (params.industry) searchParams.append("industry", params.industry);
    if (params.location) searchParams.append("location", params.location);
    if (params.type) searchParams.append("type", params.type);
    if (params.page) searchParams.append("page", params.page);
    if (params.page_size) searchParams.append("page_size", params.page_size);

    const url = `${API_BASE_URL}/companies${
      searchParams.toString() ? "?" + searchParams.toString() : ""
    }`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn(
          `Companies API returned ${response.status}, using fallback data`
        );

        // Fallback data when backend is not available
        return {
          status: "success",
          data: [
            {
              id: 1,
              company_name: "Tech Solutions Inc.",
              industry_type: "Technology",
              company_location: "Bangalore",
              company_description: "Leading technology solutions provider",
              total_employees: "100-500",
              company_logo: null,
              is_verified: true,
            },
            {
              id: 2,
              company_name: "Digital Innovations Ltd.",
              industry_type: "Software",
              company_location: "Hyderabad",
              company_description: "Digital transformation specialists",
              total_employees: "50-100",
              company_logo: null,
              is_verified: true,
            },
            {
              id: 3,
              company_name: "Future Systems Pvt Ltd.",
              industry_type: "IT Services",
              company_location: "Mumbai",
              company_description: "Future-ready IT solutions",
              total_employees: "200-1000",
              company_logo: null,
              is_verified: true,
            },
          ],
          pagination: {
            current_page: 1,
            total_pages: 1,
            total_items: 3,
          },
        };
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching companies:", error);
      console.warn("Using fallback data due to network error");

      // Fallback data when network request fails
      return {
        status: "success",
        data: [
          {
            id: 1,
            company_name: "Tech Solutions Inc.",
            industry_type: "Technology",
            company_location: "Bangalore",
            company_description: "Leading technology solutions provider",
            total_employees: "100-500",
            company_logo: null,
            is_verified: true,
          },
          {
            id: 2,
            company_name: "Digital Innovations Ltd.",
            industry_type: "Software",
            company_location: "Hyderabad",
            company_description: "Digital transformation specialists",
            total_employees: "50-100",
            company_logo: null,
            is_verified: true,
          },
          {
            id: 3,
            company_name: "Future Systems Pvt Ltd.",
            industry_type: "IT Services",
            company_location: "Mumbai",
            company_description: "Future-ready IT solutions",
            total_employees: "200-1000",
            company_logo: null,
            is_verified: true,
          },
        ],
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_items: 3,
        },
      };
    }
  },

  // Register a new employer
  async registerEmployer(formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: "POST",
        body: formData, // FormData object with files
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error registering employer:", error);
      throw error;
    }
  },

  // Login employer
  async loginEmployer(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error logging in employer:", error);
      throw error;
    }
  },

  // Get employer profile
  async getEmployerProfile(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/profile/?user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching employer profile:", error);
      throw error;
    }
  },

  // Registration cache management
  async saveRegistrationCache(email, sessionId, data, step) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/cache/save/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          session_id: sessionId,
          data,
          step,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving registration cache:", error);
      throw error;
    }
  },

  async getRegistrationCache(email, sessionId) {
    try {
      const params = new URLSearchParams();
      if (email) params.append("email", email);
      if (sessionId) params.append("session_id", sessionId);

      const response = await fetch(
        `${API_BASE_URL}/auth/cache/get/?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return { success: false, data: null };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting registration cache:", error);
      throw error;
    }
  },

  async clearRegistrationCache(email, sessionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/cache/clear/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error clearing registration cache:", error);
      throw error;
    }
  },
};

export default api;
