// src/app/main/dashboard/employee/verification/verificationUtils.js

/**
 * Validates UAN (Universal Account Number)
 * @param {string} uan - The UAN to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateUAN = (uan) => {
  // UAN should be exactly 12 digits and not all zeros
  return /^[1-9]\d{11}$/.test(uan);
};

/**
 * Validates a file based on type and size
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum allowed size in MB (default: 5)
 * @returns {Object} - { isValid: boolean, error?: string }
 */
export const validateFile = (file, maxSizeMB = 5) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (file.type !== "application/pdf") {
    return { isValid: false, error: 'Only PDF files are allowed' };
  }
  
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { isValid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }
  
  return { isValid: true };
};

/**
 * Verification pricing structure
 */
export const verificationPrices = {
  uan: 49,
  form16: 49,
  fresher: 9,
  badge: 9
};

/**
 * Formats price with currency symbol
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted price string
 */
export const formatPrice = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

/**
 * Gets verification method details
 * @param {string} method - Verification method (uan/form16/fresher/badge)
 * @returns {Object} - Method details including price and display name
 */
export const getVerificationMethodDetails = (method) => {
  const methods = {
    uan: {
      name: 'UAN Verification',
      price: verificationPrices.uan,
      description: 'Verify using your Universal Account Number'
    },
    form16: {
      name: 'Form 16 Verification',
      price: verificationPrices.form16,
      description: 'Upload your Form 16 document'
    },
    fresher: {
      name: 'Fresher Verification',
      price: verificationPrices.fresher,
      description: 'Special verification for fresh graduates'
    },
    badge: {
      name: 'Verified Badge',
      price: verificationPrices.badge,
      description: 'Get a verified profile badge'
    }
  };

  return methods[method] || {
    name: 'Unknown Method',
    price: 0,
    description: ''
  };
};

/**
 * Simulates payment processing
 * @param {string} method - Verification method
 * @returns {Promise<boolean>} - Resolves to true if successful
 */
export const processPayment = async (method) => {
  const price = verificationPrices[method];
  if (!price) return false;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate successful payment 90% of the time
  return Math.random() > 0.1;
};

/**
 * Generates a mock verification ID
 * @returns {string} - Verification ID
 */
export const generateVerificationId = () => {
  return `VER-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};
