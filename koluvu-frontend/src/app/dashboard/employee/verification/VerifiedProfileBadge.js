//src/app/main/dashboard/employee/verification/VerifiedProfileBadge.js

"use client";
import React, { useState } from "react";
import { CheckCircle, BadgeCheck, Shield } from "lucide-react";
import { motion } from "framer-motion";


export default function VerifiedProfileBadge({ userProfile, onVerificationSuccess }) {
  const [verified, setVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Razorpay script loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleVerify = async () => {
    setIsProcessing(true);
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: "rzp_test_YourKeyHere", // Replace with your Razorpay key
      amount: 900, // 9 INR in paise
      currency: "INR",
      name: "Koluvu Job Portal",
      description: "Verified Profile Badge",
      image: "/company_logos/ai_labs_logo.png", // Optional: update with your logo
      handler: function (response) {
        setVerified(true);
        onVerificationSuccess('badge');
      },
      prefill: {
        name: userProfile?.name || '',
        email: userProfile?.email || '',
      },
      theme: {
        color: "#2563eb"
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    // Razorpay will call handler or ondismiss, so don't set isProcessing here
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Shield className="text-blue-500 w-6 h-6" />
            <span>Verified Profile Badge</span>
          </h2>
          {verified && (
            <BadgeCheck className="text-green-500 w-8 h-8" />
          )}
        </div>

        <p className="text-gray-600 mb-6">
          Get a verified badge for just <strong className="text-blue-600">₹9</strong> and increase your profile credibility!
        </p>

        <div className="space-y-3 mb-6">
          {[
            "Builds Trust with Employers",
            "Increases Resume Visibility",
            "Shows You're Genuinely Job Searching",
            "Highlights Your Honesty & Commitment",
            "Gets You 2x More Profile Views"
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>

        {!verified ? (
          <motion.button
            onClick={handleVerify}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 flex items-center justify-center space-x-2"
            disabled={isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Pay ₹9 & Get Verified</span>
                <BadgeCheck className="w-5 h-5" />
              </>
            )}
          </motion.button>
        ) : (
          <div className="text-center py-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-green-600 font-medium">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg">Your profile is now verified!</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
