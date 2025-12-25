// src/api/verificationService.js

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Set up Axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for auth token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status code outside 2xx range
      const errorMessage = error.response.data?.message || 
                         error.response.statusText || 
                         'Request failed';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('Network error - no response received'));
    } else {
      // Something happened in setting up the request
      return Promise.reject(new Error('Request setup error'));
    }
  }
);

/**
 * @typedef {Object} VerificationStatus
 * @property {boolean} profileComplete - Whether basic profile verification is complete
 * @property {boolean} badgeVerified - Whether premium badge verification is complete
 * @property {Array<VerificationRequirement>} requirements - List of verification requirements
 */

/**
 * @typedef {Object} VerificationRequirement
 * @property {string} id - Unique identifier for the requirement
 * @property {string} title - Display title of the requirement
 * @property {string} description - Detailed description of what's needed
 * @property {boolean} completed - Whether this requirement has been fulfilled
 * @property {boolean} [multiple] - Whether multiple files can be uploaded
 */

/**
 * @typedef {Object} PaymentInitiationResponse
 * @property {boolean} success - Whether the initiation was successful
 * @property {string} paymentUrl - URL to redirect user for payment
 */

/**
 * @typedef {Object} DocumentSubmissionResponse
 * @property {boolean} success - Whether the submission was successful
 * @property {string} [documentId] - ID of the submitted document
 */

export const verificationService = {
  /**
   * Get current verification status for employer
   * @returns {Promise<VerificationStatus>}
   * @throws {Error} When request fails
   */
  getVerificationStatus: async () => {
    try {
      const response = await apiClient.get('/employer/verification/status');
      return {
        profileComplete: response.data.profileComplete,
        badgeVerified: response.data.badgeVerified,
        requirements: response.data.requirements || []
      };
    } catch (error) {
      console.error('Error fetching verification status:', error);
      throw error; // Already handled by interceptor
    }
  },

  /**
   * Complete basic employer profile verification
   * @param {string} userId - ID of the user to verify
   * @returns {Promise<{success: boolean, profileComplete: boolean}>}
   * @throws {Error} When request fails
   */
  completeProfile: async (userId) => {
    try {
      const response = await apiClient.post('/employer/verification/complete-profile', { userId });
      return {
        success: response.data.success,
        profileComplete: response.data.profileComplete
      };
    } catch (error) {
      console.error('Error completing profile verification:', error);
      throw error;
    }
  },

  /**
   * Initiate premium badge verification process
   * @param {string} userId - ID of the user to verify
   * @returns {Promise<PaymentInitiationResponse>}
   * @throws {Error} When request fails
   */
  initiateBadgeVerification: async (userId) => {
    try {
      const response = await apiClient.post('/employer/verification/initiate-badge', { userId });
      return {
        success: response.data.success,
        paymentUrl: response.data.paymentUrl
      };
    } catch (error) {
      console.error('Error initiating badge verification:', error);
      throw error;
    }
  },

  /**
   * Verify payment completion for premium badge
   * @param {string} paymentId - Payment ID from payment gateway
   * @param {string} orderId - Order ID from payment gateway
   * @returns {Promise<{success: boolean, badgeVerified: boolean}>}
   * @throws {Error} When request fails
   */
  confirmBadgePayment: async (paymentId, orderId) => {
    try {
      const response = await apiClient.post('/employer/verification/confirm-badge', {
        paymentId,
        orderId
      });
      return {
        success: response.data.success,
        badgeVerified: response.data.badgeVerified
      };
    } catch (error) {
      console.error('Error confirming badge payment:', error);
      throw error;
    }
  },

  /**
   * Get all verification requirements
   * @returns {Promise<Array<VerificationRequirement>>}
   * @throws {Error} When request fails
   */
  getVerificationRequirements: async () => {
    try {
      const response = await apiClient.get('/employer/verification/requirements');
      return response.data.map(req => ({
        id: req.id,
        title: req.title,
        description: req.description,
        completed: req.completed,
        multiple: req.multiple || false
      }));
    } catch (error) {
      console.error('Error fetching verification requirements:', error);
      throw error;
    }
  },

  /**
   * Submit documents for verification
   * @param {string} requirementId - ID of the requirement being fulfilled
   * @param {FormData} documents - FormData containing document files
   * @returns {Promise<DocumentSubmissionResponse>}
   * @throws {Error} When request fails
   */
  submitVerificationDocuments: async (requirementId, documents) => {
    try {
      const response = await apiClient.post(
        `/employer/verification/submit-documents/${requirementId}`,
        documents,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return {
        success: response.data.success,
        documentId: response.data.documentId
      };
    } catch (error) {
      console.error(`Error submitting documents for requirement ${requirementId}:`, error);
      throw error;
    }
  },

  /**
   * Simulate payment completion for development/testing
   * @returns {Promise<{success: boolean, paymentId: string, orderId: string}>}
   */
  simulatePaymentCompletion: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          paymentId: 'mock_payment_' + Math.random().toString(36).substring(2),
          orderId: 'mock_order_' + Math.random().toString(36).substring(2)
        });
      }, 1500);
    });
  }
};

// Named exports for individual functions
export const {
  getVerificationStatus,
  completeProfile,
  initiateBadgeVerification,
  confirmBadgePayment,
  getVerificationRequirements,
  submitVerificationDocuments,
  simulatePaymentCompletion
} = verificationService;

export default verificationService;
