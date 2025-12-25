// src/components/training/InstituteSetupModal.js

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function InstituteSetupModal({ isOpen, onClose, onSubmit, existingData = null }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    organization_name: existingData?.organization_name || "",
    contact_person: existingData?.contact_person || "",
    phone: existingData?.phone || "",
    address: existingData?.address || "",
    website: existingData?.website || "",
    certification_number: existingData?.certification_number || "",
    specialization: existingData?.specialization || "",
    description: existingData?.description || "",
    founded_year: existingData?.founded_year || "",
    team_size: existingData?.team_size || "",
    experience_years: existingData?.experience_years || "",
    qualifications: existingData?.qualifications || "",
    linkedin_url: existingData?.linkedin_url || "",
    facebook_url: existingData?.facebook_url || "",
    twitter_url: existingData?.twitter_url || "",
    youtube_url: existingData?.youtube_url || "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.organization_name?.trim()) {
        newErrors.organization_name = "Organization name is required";
      }
      if (!formData.contact_person?.trim()) {
        newErrors.contact_person = "Contact person is required";
      }
      if (!formData.phone?.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^[+]?[\d\s-()]+$/.test(formData.phone)) {
        newErrors.phone = "Invalid phone number format";
      }
      if (!formData.address?.trim()) {
        newErrors.address = "Address is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(1)) {
      setStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean the data before sending - remove empty strings and convert to proper types
      const cleanedData = {};
      
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        
        // Skip empty strings
        if (value === '' || value === null || value === undefined) {
          return;
        }
        
        // Convert numeric fields to integers or null
        if (['founded_year', 'team_size', 'experience_years'].includes(key)) {
          const numValue = parseInt(value, 10);
          if (!isNaN(numValue) && numValue > 0) {
            cleanedData[key] = numValue;
          }
        }
        // Keep string fields that are not empty
        else {
          cleanedData[key] = value.trim();
        }
      });

      console.log("📤 Sending cleaned data:", cleanedData);
      await onSubmit(cleanedData);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        submit: error.message || "Failed to save profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={(e) => {
            // Prevent closing if required fields are not filled
            if (!formData.organization_name || !formData.contact_person || !formData.phone || !formData.address) {
              e.preventDefault();
            }
          }}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 text-white">
              <h2 className="text-3xl font-bold">Complete Your Institute Profile</h2>
              <p className="text-orange-100 mt-2">
                Please provide your institute information to continue using the training dashboard
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="px-8 py-4 bg-gray-50 border-b">
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${step >= 1 ? "text-orange-600" : "text-gray-400"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 1 ? "bg-orange-600 text-white" : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium">Basic Info</span>
                </div>
                <div className="flex-1 h-1 mx-4 bg-gray-300">
                  <div
                    className={`h-full transition-all ${step >= 2 ? "bg-orange-600" : "bg-gray-300"}`}
                    style={{ width: step >= 2 ? "100%" : "0%" }}
                  />
                </div>
                <div className={`flex items-center ${step >= 2 ? "text-orange-600" : "text-gray-400"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= 2 ? "bg-orange-600 text-white" : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">Additional Details</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="organization_name"
                        value={formData.organization_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.organization_name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g., Tech Academy"
                      />
                      {errors.organization_name && (
                        <p className="text-red-500 text-sm mt-1">{errors.organization_name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.contact_person ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g., John Doe"
                      />
                      {errors.contact_person && (
                        <p className="text-red-500 text-sm mt-1">{errors.contact_person}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="+91 98765 43210"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="https://www.example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter complete address"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certification/Registration Number
                        </label>
                        <input
                          type="text"
                          name="certification_number"
                          value={formData.certification_number}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="e.g., REG123456789"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Specialization
                        </label>
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="e.g., Software Development, Data Science"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Brief description about your organization..."
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Additional Details */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Founded Year
                        </label>
                        <input
                          type="number"
                          name="founded_year"
                          value={formData.founded_year}
                          onChange={handleChange}
                          min="1900"
                          max={new Date().getFullYear()}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="2015"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Team Size
                        </label>
                        <input
                          type="number"
                          name="team_size"
                          value={formData.team_size}
                          onChange={handleChange}
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Experience (Years)
                        </label>
                        <input
                          type="number"
                          name="experience_years"
                          value={formData.experience_years}
                          onChange={handleChange}
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Qualifications & Certifications
                      </label>
                      <textarea
                        name="qualifications"
                        value={formData.qualifications}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="List your key qualifications and certifications..."
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            LinkedIn URL
                          </label>
                          <input
                            type="url"
                            name="linkedin_url"
                            value={formData.linkedin_url}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="https://linkedin.com/company/your-company"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Facebook URL
                          </label>
                          <input
                            type="url"
                            name="facebook_url"
                            value={formData.facebook_url}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="https://facebook.com/your-page"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Twitter URL
                          </label>
                          <input
                            type="url"
                            name="twitter_url"
                            value={formData.twitter_url}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="https://twitter.com/your-handle"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            YouTube URL
                          </label>
                          <input
                            type="url"
                            name="youtube_url"
                            value={formData.youtube_url}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="https://youtube.com/@your-channel"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error message */}
                {errors.submit && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 py-6 bg-gray-50 border-t flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {step === 1 && (
                    <span>
                      <span className="text-red-500">*</span> Required fields
                    </span>
                  )}
                </div>
                <div className="flex gap-4">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      Back
                    </button>
                  )}
                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Saving...</span>
                        </>
                      ) : (
                        "Complete Setup"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
