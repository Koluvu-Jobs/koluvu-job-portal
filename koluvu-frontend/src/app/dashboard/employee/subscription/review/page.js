// src/app/main/dashboard/employee/subscription/review/page.js

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ReviewPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const planData = sessionStorage.getItem('selectedPlan');
    if (planData) {
      setSelectedPlan(JSON.parse(planData));
    } else {
      router.push('/dashboard/employee/subscription');
    }

    // Load existing user info if available
    const existingUserInfo = sessionStorage.getItem('userInfo');
    if (existingUserInfo) {
      setUserInfo(JSON.parse(existingUserInfo));
    }
  }, [router]);

  const handleUserInfoChange = (field, value) => {
    const updatedInfo = { ...userInfo, [field]: value };
    setUserInfo(updatedInfo);
    sessionStorage.setItem('userInfo', JSON.stringify(updatedInfo));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateName = (name) => /^[A-Za-z ]{2,}$/.test(name);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleContinue = () => {
    if (!validateName(userInfo.name)) {
      setError("Please enter a valid name (letters only, at least 2 characters).");
      return;
    }
    if (!validateEmail(userInfo.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!validatePhone(userInfo.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");
    router.push('/dashboard/employee/subscription/payment');
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">1</div>
        <div className="w-8 h-0.5 bg-blue-600" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">2</div>
        <div className="w-8 h-0.5 bg-blue-600" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white">3</div>
        <div className="w-8 h-0.5 bg-gray-300" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-600">4</div>
        <div className="w-8 h-0.5 bg-gray-300" />
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-600">5</div>
      </div>
    </div>
  );

  if (!selectedPlan) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-6xl mx-auto">
        {renderStepIndicator()}
        
        <div className="mb-4">
          <h1 className="text-center text-xl font-semibold text-gray-600">Order Review</h1>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Order Review</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={userInfo.name}
                onChange={(e) => handleUserInfoChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="email"
                placeholder="Email Address *"
                value={userInfo.email}
                onChange={(e) => handleUserInfoChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={userInfo.phone}
                onChange={(e) => handleUserInfoChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {error && (
                <p className="text-red-600 font-semibold mt-2">{error}</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="flex justify-between items-center mb-2">
              <span>{selectedPlan.name}</span>
              <span>₹{selectedPlan.price}/-</span>
            </div>
            {selectedPlan.savings && (
              <div className="flex justify-between items-center mb-2 text-green-600 text-sm">
                <span>Savings:</span>
                <span>-₹{selectedPlan.savings}/-</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between items-center font-bold">
              <span>Total Amount:</span>
              <span>₹{selectedPlan.price}/-</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => router.push('/dashboard/employee/subscription/cart')}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
            </button>
            <button 
              onClick={handleContinue}
              className="flex items-center flex-1 justify-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Proceed to Payment <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
