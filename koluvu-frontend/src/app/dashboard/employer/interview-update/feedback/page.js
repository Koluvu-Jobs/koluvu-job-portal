// src/app/main/dashboard/employer/interview-update/feedback/page.js
"use client";
import { useState, useEffect } from "react";

export default function InterviewFeedbackPage() {
  // Initial empty form state
  const getInitialFormState = () => ({
    candidateInfo: {
      name: "",
      email: "",
      mobile: "",
      position: "",
      department: "",
      interviewDate: "",
    },
    status: "",
    feedback: {
      skills: "",
      behavior: "",
      technical: "",
    }
  });

  const [candidateInfo, setCandidateInfo] = useState(getInitialFormState().candidateInfo);
  const [status, setStatus] = useState(getInitialFormState().status);
  const [feedback, setFeedback] = useState(getInitialFormState().feedback);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showClearMessage, setShowClearMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Clear form when component mounts or tab is revisited
  useEffect(() => {
    // Check if form should be cleared (e.g., after submission)
    const shouldClearForm = localStorage.getItem('feedback-form-clear');
    if (shouldClearForm === 'true') {
      clearForm();
      localStorage.removeItem('feedback-form-clear');
    } else {
      // Always start with a fresh form
      clearForm();
    }
  }, []);

  // Function to clear all form fields
  const clearForm = (showMessage = false) => {
    const initialState = getInitialFormState();
    setCandidateInfo(initialState.candidateInfo);
    setStatus(initialState.status);
    setFeedback(initialState.feedback);
    
    // Show clear message briefly (but not on initial mount)
    if (showMessage) {
      setShowClearMessage(true);
      setTimeout(() => setShowClearMessage(false), 2000);
    }
  };

  // Calculate form completion percentage
  const calculateFormCompletion = () => {
    const fields = [
      candidateInfo.name,
      candidateInfo.email,
      candidateInfo.mobile,
      candidateInfo.position,
      candidateInfo.department,
      candidateInfo.interviewDate,
      status,
      feedback.skills,
      feedback.behavior,
      feedback.technical
    ];
    
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = calculateFormCompletion();

  // Handle manual form clearing with confirmation
  const handleClearForm = () => {
    // Check if form has any data
    const hasData = candidateInfo.name || candidateInfo.position || candidateInfo.department || 
                   candidateInfo.interviewDate || status || feedback.skills || 
                   feedback.behavior || feedback.technical;
    
    if (hasData) {
      if (confirm("Are you sure you want to clear all form data? This action cannot be undone.")) {
        clearForm(true);
      }
    } else {
      clearForm(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      const formData = {
  ...candidateInfo,
        status,
        feedback,
      };
      
      console.log("Submitted Feedback:", formData);
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/employer/feedback/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify({
      //     candidate_name: candidateInfo.name,
      //     position_applied: candidateInfo.position,
      //     department: candidateInfo.department,
      //     interview_date: candidateInfo.interviewDate,
      //     interview_status: status.toLowerCase(),
      //     skills_assessment: feedback.skills,
      //     behavior_assessment: feedback.behavior,
      //     technical_skills: feedback.technical,
      //     is_submitted: true
      //   })
      // });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 4000);
      
      // Mark form for clearing and clear immediately
      localStorage.setItem('feedback-form-clear', 'true');
      clearForm();
      
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-lg border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Interview Feedback Form
      </h2>

      {/* Form Progress Indicator */}
      {completionPercentage > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Form Completion</span>
            <span className="text-sm font-medium text-gray-700">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{width: `${completionPercentage}%`}}
            ></div>
          </div>
        </div>
      )}

      {/* Success/Clear Messages */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg text-center">
          🎉 Interview feedback submitted successfully! Form has been cleared for next entry.
        </div>
      )}
      
      {showClearMessage && !showSuccessMessage && (
        <div className="mb-6 p-4 bg-blue-100 border border-blue-300 text-blue-700 rounded-lg text-center">
          ✅ Form cleared! Ready for new feedback entry.
        </div>
      )}

      <div className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Candidate Email Address:
            </label>
            <input
              type="email"
              value={candidateInfo.email}
              onChange={(e) =>
                setCandidateInfo({ ...candidateInfo, email: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter candidate email address"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Candidate Mobile Number:
            </label>
            <input
              type="tel"
              value={candidateInfo.mobile}
              onChange={(e) =>
                setCandidateInfo({ ...candidateInfo, mobile: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter candidate mobile number"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Candidate Name:
            </label>
            <input
              type="text"
              value={candidateInfo.name}
              onChange={(e) =>
                setCandidateInfo({ ...candidateInfo, name: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter candidate name"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position Attended:
            </label>
            <input
              type="text"
              value={candidateInfo.position}
              onChange={(e) =>
                setCandidateInfo({ ...candidateInfo, position: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter position"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department:
            </label>
            <input
              type="text"
              value={candidateInfo.department}
              onChange={(e) =>
                setCandidateInfo({
                  ...candidateInfo,
                  department: e.target.value,
                })
              }
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter department"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Interview:
            </label>
            <input
              type="date"
              value={candidateInfo.interviewDate}
              onChange={(e) =>
                setCandidateInfo({
                  ...candidateInfo,
                  interviewDate: e.target.value,
                })
              }
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Interview Status
          </label>
          <div className="flex flex-wrap gap-4">
            {["Selected", "Rejected", "Hold", "Shortlisted", "Next Round"].map(
              (option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={option}
                    checked={status === option}
                    onChange={(e) => setStatus(e.target.value)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              )
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Skills Assessment
            </label>
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Write about skills assessment..."
              value={feedback.skills}
              onChange={(e) =>
                setFeedback({ ...feedback, skills: e.target.value })
              }
            />
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Behavior Assessment
            </label>
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Write about behavior assessment..."
              value={feedback.behavior}
              onChange={(e) =>
                setFeedback({ ...feedback, behavior: e.target.value })
              }
            />
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Technical Skills
            </label>
            <textarea
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Write about technical skills..."
              value={feedback.technical}
              onChange={(e) =>
                setFeedback({ ...feedback, technical: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={!status || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
          
          <button
            type="button"
            className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-300 shadow-md hover:shadow-lg font-medium text-lg"
            onClick={handleClearForm}
          >
            Clear Form
          </button>
        </div>
      </div>
    </div>
  );
}
