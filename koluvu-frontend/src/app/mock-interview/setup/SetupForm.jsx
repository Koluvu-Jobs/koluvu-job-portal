// src/app/mai/mock-interview/setup/components/SetupForm.jsx

"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import PersonalInfoStep from "./components/PersonalInfoStep";
import InterviewSetupStep from "./components/InterviewSetupStep";
import ResumeConfirmStep from "./components/ResumeConfirmStep";

export default function SetupForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [form, setForm] = useState({
    name: "",
    role: "",
    experience: "",
    interviewTypes: [],
    skills: [],
    language: "",
    resume: null,
    permission: false
  });

  // Error state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value.trim() ? 'Name is required' : 
               value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
      case 'role':
        return !value ? 'Please select a role' : '';
      case 'experience':
        return !value ? 'Please select your experience level' : '';
      case 'interviewTypes':
        return value.length === 0 ? 'Select at least one interview type' : '';
      case 'skills':
        return value.length === 0 ? 'Add at least one skill' : '';
      default:
        return '';
    }
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach(key => {
      if (key !== 'language' && key !== 'resume' && key !== 'permission') {
        const error = validateField(key, form[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'interviewTypes') {
      const newTypes = form.interviewTypes.includes(value)
        ? form.interviewTypes.filter(t => t !== value)
        : [...form.interviewTypes, value];
      setForm(prev => ({ ...prev, interviewTypes: newTypes }));
      
      // Validate
      const error = validateField('interviewTypes', newTypes);
      setErrors(prev => ({ ...prev, interviewTypes: error }));
    } else {
      const newValue = type === 'checkbox' ? checked : value;
      setForm(prev => ({ ...prev, [name]: newValue }));
      
      // Validate
      if (name !== 'language' && name !== 'permission') {
        const error = validateField(name, newValue);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  // Handle blur events
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Handle skill changes
  const handleSkillChange = (newSkills) => {
    setForm(prev => ({ ...prev, skills: newSkills }));
    const error = validateField('skills', newSkills);
    setErrors(prev => ({ ...prev, skills: error }));
  };

  // Handle resume upload
  const handleResume = (file) => {
    setForm(prev => ({ ...prev, resume: file }));
    setErrors(prev => ({ ...prev, resume: '' }));
    setUploadDone(true);
  };

  // Handle resume removal
  const handleRemoveResume = () => {
    setForm(prev => ({ ...prev, resume: null }));
    setUploadDone(false);
  };

  // Set resume error
  const setResumeError = (error) => {
    setErrors(prev => ({ ...prev, resume: error }));
  };

  // Navigation
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !form.permission) {
      return;
    }

    setLoading(true);

    try {      // Submit form data
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'interviewTypes' || key === 'skills') {
          // Send arrays properly for backend processing
          form[key].forEach(item => {
            formData.append(`${key}[]`, item);
          });
        } else if (key === 'resume' && form[key]) {
          formData.append(key, form[key]);
        } else if (key !== 'resume') {
          formData.append(key, form[key]);
        }
      });

      const response = await fetch('/api/mock-interview-setup', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to save setup');
      }      const result = await response.json();
      
      // Generate interview script
      const scriptResponse = await fetch('/api/generate-interview-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          setupId: result.setupId
        })
      });

      if (!scriptResponse.ok) {
        const errorText = await scriptResponse.text();
        console.error("API Error Response Body:", errorText);
        let errorDetails = "The server returned an unexpected error. Check the server logs for more details.";
        try {
          const errorJson = JSON.parse(errorText);
          errorDetails = errorJson.details || errorJson.error || errorDetails;
        } catch (e) {
          // The response was not JSON, use the raw text if it's not too long
          if (errorText.length < 500) {
            errorDetails = errorText;
          }
        }
        throw new Error(`Failed to generate interview script. Server responded with status ${scriptResponse.status}. Details: ${errorDetails}`);
      }

      const scriptResult = await scriptResponse.json();
      
      // Show success message instead of immediately redirecting
      setSuccess(true);
      setError('');      // Wait a moment to show success, then redirect to permissions page
      setTimeout(() => {
        router.push(`/main/mock-interview/permissions?sessionId=${result.sessionId}&scriptId=${scriptResult.scriptId}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-lg mx-auto">
      <ProgressBar currentStep={currentStep} />
      
      {/* Success Message */}
      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <div className="text-green-800">
              <p className="font-semibold">Setup completed successfully!</p>
              <p className="text-sm">Generating your personalized interview script...</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Error Message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-red-800">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit} className="mt-4">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <PersonalInfoStep
              form={form}
              errors={errors}
              touched={touched}
              onChange={handleChange}
              onBlur={handleBlur}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 2 && (
            <InterviewSetupStep
              form={form}
              errors={errors}
              touched={touched}
              onChange={handleChange}
              onBlur={handleBlur}
              onSkillChange={handleSkillChange}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          )}
          
          {currentStep === 3 && (
            <ResumeConfirmStep
              form={form}
              errors={errors}
              touched={touched}
              uploading={uploading}
              uploadDone={uploadDone}
              loading={loading}
              onResumeUpload={handleResume}
              onResumeRemove={handleRemoveResume}
              setResumeError={setResumeError}
              onChange={handleChange}
              onBlur={handleBlur}
              onSubmit={handleSubmit}
              onPrev={handlePrev}
            />
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
