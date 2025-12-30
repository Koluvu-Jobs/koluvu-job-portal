/**
 * Utility functions for creating SEO-friendly URLs and managing job links
 */

/**
 * Create URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @param {number} maxLength - Maximum length of slug (default: 50)
 * @returns {string} URL-friendly slug
 */
export const createSlug = (text, maxLength = 50) => {
  if (!text) return 'untitled';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s-]+/g, '_')      // Replace spaces and hyphens with underscores
    .replace(/^_+|_+$/g, '')      // Remove leading/trailing underscores
    .substring(0, maxLength)      // Limit length
    || 'untitled';                // Fallback if empty
};

/**
 * Build proper job URL structure
 * @param {Object} jobData - Job object containing title, company_name, id, etc.
 * @returns {string} Properly formatted job URL
 */
export const buildJobUrl = (jobData) => {
  if (!jobData || !jobData.id) {
    console.warn('Invalid job data provided to buildJobUrl:', jobData);
    return '/jobs';
  }

  // Use public_url if available (custom URL)
  if (jobData.public_url) {
    return `/${jobData.public_url}`;
  }

  // Build standard URL structure: /jobs/company/title/number
  const company = createSlug(
    jobData.company_name || 
    jobData.employer_name || 
    jobData.employer?.company_name ||
    'company'
  );
  
  const title = createSlug(
    jobData.title || 
    jobData.job_title ||
    'job'
  );
  
  const number = jobData.id || jobData.job_id;

  return `/jobs/${company}/${title}/${number}`;
};

/**
 * Navigate to job URL using Next.js router
 * @param {Object} router - Next.js router instance
 * @param {Object} jobData - Job object
 */
export const navigateToJob = (router, jobData) => {
  const url = buildJobUrl(jobData);
  router.push(url);
};

/**
 * Extract job URL parameters from current route
 * @param {Object} params - Next.js params object
 * @returns {Object} Extracted parameters
 */
export const extractJobParams = (params) => {
  return {
    company: params.company,
    title: params.title,
    number: params.number || params.id,
  };
};