//src/app/dashboard/employee/verification/page.js

"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@koluvu/components/ui/card";
import { Button } from "@koluvu/components/ui/button";
import { Input } from "@koluvu/components/ui/forms/Input";
import { CheckCircle, Shield, FileText, GraduationCap } from 'lucide-react';
import VerificationStatus from './VerificationStatus.js';
import VerificationBenefits from './VerificationBenefits.js';
import { validateUAN, validateFile, verificationPrices } from './verificationUtils.js';

// Utility to dynamically load Razorpay script
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function EmployeeVerification() {
  const [verificationType, setVerificationType] = useState("uan");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    uan: '',
    file: null,
    paymentComplete: false
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [verificationType]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (verificationType === 'uan') {
      if (!formData.uan) {
        newErrors.uan = 'UAN is required';
      } else if (!validateUAN(formData.uan)) {
        newErrors.uan = 'Please enter a valid 12-digit UAN';
      }
      
      const fileValidation = validateFile(formData.file);
      if (!fileValidation.isValid) {
        newErrors.file = fileValidation.error;
      }
    } else if (verificationType === 'form16') {
      const fileValidation = validateFile(formData.file);
      if (!fileValidation.isValid) {
        newErrors.file = fileValidation.error;
      }
    }
    // For 'fresher', no validation required for fields.
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Load Razorpay script
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error('Failed to load payment gateway');
      }
      // Create order on your backend
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: verificationPrices[verificationType] * 100, // Convert to paise
          currency: 'INR',
          receipt: 'verification_' + Date.now(),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      const order = await response.json();
      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Koluvu Verification',
        description: `Verification for ${verificationType.toUpperCase()}`,
        order_id: order.id,
        handler: async function(response) {
          // Verify payment on your backend
          const verificationResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              verificationType,
              formData: {
                ...formData,
                file: formData.file ? formData.file.name : null,
              },
            }),
          });
          
          if (!verificationResponse.ok) {
            throw new Error('Payment verification failed');
          }
          const result = await verificationResponse.json();
          setVerificationStatus({
            success: true,
            type: verificationType,
            price: verificationPrices[verificationType],
            ...result,
          });
        },
        prefill: {
          name: 'Customer Name', // You can get this from user profile
          email: 'customer@example.com', // You can get this from user profile
          contact: '+919876543210', // You can get this from user profile
        },
        theme: {
          color: '#4F46E5',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus({
        success: false,
        message: error.message || 'An error occurred during verification',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setVerificationStatus(null);
    setFormData({
      uan: '',
      file: null,
      paymentComplete: false,
    });
    setErrors({});
  };

  if (verificationStatus && typeof verificationStatus === 'object' && 'success' in verificationStatus) {
    return (
      <VerificationStatus 
        status={verificationStatus} 
        onReset={resetForm} 
      />
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50">
      <div className="p-4 lg:p-8">
        <div className="w-full max-w-5xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="text-3xl font-bold mb-4 inline-block px-4 py-2 rounded-lg" style={{ backgroundColor: '#F3E8FF', color: '#6C2BD9' }}>Verify Your Profile</h1>
                  <div className="max-w-2xl mx-auto px-6 py-3 rounded-lg bg-[#FFFDE7] my-4 border border-amber-100">
                    <p className="text-[#4A4A00] text-center text-sm sm:text-base font-medium leading-relaxed">
                      Complete your profile verification to unlock all features and increase your credibility.
                    </p>
                  </div>
                </div>

                <Card className="mb-8">
                  <CardContent className="p-4 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="space-y-4">
                        <div className="mb-2">
                          <label className="text-base sm:text-lg font-bold text-[#00796B] block pb-1 relative px-4 py-2 rounded-lg bg-white inline-block w-auto border border-gray-100 shadow-sm">
                            Choose Verification Method
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF6D00] to-[#6C2BD9] rounded-full"></span>
                          </label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            {
                              id: 'uan',
                              icon: <Shield className="w-6 h-6 text-blue-600" />,
                              title: 'UAN Verification',
                              description: 'Verify with UAN and EPFO passbook',
                              price: verificationPrices.uan,
                            },
                            {
                              id: 'form16',
                              icon: <FileText className="w-6 h-6 text-green-600" />,
                              title: 'Form 16',
                              description: 'Upload your Form 16 document',
                              price: verificationPrices.form16,
                            },
                            {
                              id: 'fresher',
                              icon: <GraduationCap className="w-6 h-6 text-purple-600" />,
                              title: 'Fresher',
                              description: 'For candidates with no work experience',
                              price: verificationPrices.fresher,
                            },
                          ].map((method) => (
                            <Card
                              key={method.id}
                              className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                                verificationType === method.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                              onClick={() => setVerificationType(method.id)}
                            >
                              <CardContent className="p-0 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="p-2 rounded-lg bg-opacity-10">
                                    {method.icon}
                                  </div>
                                  <span className="text-sm font-medium text-gray-500">₹{method.price}</span>
                                </div>
                                <h3 className="font-semibold text-gray-900">{method.title}</h3>
                                <p className="text-sm text-gray-600">{method.description}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
                        {verificationType === 'uan' && (
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <label htmlFor="uan" className="block mb-2 text-sm font-medium text-gray-700">
                                UAN Number <span className="text-red-500">*</span>
                              </label>
                              <Input
                                id="uan"
                                name="uan"
                                placeholder="Enter your 12-digit UAN"
                                maxLength={12}
                                value={formData.uan}
                                onChange={handleInputChange}
                                className="h-12"
                                required
                              />
                              {errors.uan && <p className="text-red-500 text-sm">{errors.uan}</p>}
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="epfo" className="block mb-2 text-sm font-medium text-gray-700">
                                Upload EPFO Passbook (PDF) <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <Input
                                  id="epfo"
                                  type="file"
                                  name="file"
                                  accept="application/pdf"
                                  onChange={handleInputChange}
                                  className="h-12 opacity-0 absolute inset-0 w-full cursor-pointer"
                                  required
                                />
                                <div className="h-12 border border-gray-300 rounded-md flex items-center px-4 pointer-events-none bg-white">
                                  {formData.file ? (
                                    <span className="truncate text-black">{formData.file.name}</span>
                                  ) : (
                                    <span className="text-gray-500">Choose file...</span>
                                  )}
                                </div>
                              </div>
                              {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                            </div>
                          </div>
                        )}

                        {verificationType === 'form16' && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label htmlFor="form16" className="block mb-2 text-sm font-medium text-gray-700">
                                Upload Form 16 (PDF) <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <Input
                                  id="form16"
                                  type="file"
                                  name="file"
                                  accept="application/pdf"
                                  onChange={handleInputChange}
                                  className="h-12 opacity-0 absolute inset-0 w-full cursor-pointer"
                                  required
                                />
                                <div className="h-12 border border-gray-300 rounded-md flex items-center px-4 pointer-events-none bg-white">
                                  {formData.file ? (
                                    <span className="truncate text-black">{formData.file.name}</span>
                                  ) : (
                                    <span className="text-gray-500">Choose file...</span>
                                  )}
                                </div>
                              </div>
                              {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                            </div>
                            <div className="text-xs sm:text-sm text-black">
                              <p>Your Form 16 should:</p>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>Be a clear, legible PDF document</li>
                                <li>Contain your employer's details and TDS information</li>
                                <li>Not be password protected</li>
                              </ul>
                            </div>
                          </div>
                        )}

                        {verificationType === 'fresher' && (
                          <div className="space-y-4">
                            <Card className="bg-yellow-50 border-yellow-200">
                              <CardContent className="p-4 sm:p-6 text-center">
                                <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-600 mx-auto mb-4" />
                                <h3 className="font-semibold text-yellow-800 mb-2 text-lg sm:text-xl">
                                  Fresher Verification
                                </h3>
                                <p className="text-yellow-700 mb-4 text-sm sm:text-base">
                                  Please complete the payment of ₹{verificationPrices.fresher} to proceed with verification.
                                </p>
                              </CardContent>
                            </Card>
                            {errors.payment && <p className="text-red-500 text-sm text-center">{errors.payment}</p>}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="w-full sm:w-auto px-8 py-3 text-base font-medium"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            `Pay ₹${verificationPrices[verificationType]} & Verify`
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

          <VerificationBenefits />
        </div>
      </div>
    </div>
  );
}
