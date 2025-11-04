// src/app/test-otp/page.js

"use client";

import React, { useState } from "react";
import OTPVerification from "@/components/auth/OTPVerification";
import toast, { Toaster } from "react-hot-toast";

export default function TestOTPPage() {
  const [step, setStep] = useState("input"); // 'input' or 'verify'
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationType, setVerificationType] = useState("email");

  const handleStartVerification = (e) => {
    e.preventDefault();

    if (verificationType === "email" && !email) {
      toast.error("Please enter your email address");
      return;
    }

    if (verificationType === "phone" && !phone) {
      toast.error("Please enter your phone number");
      return;
    }

    setStep("verify");
  };

  const handleVerified = () => {
    toast.success("🎉 Verification successful!");
    // You can redirect or perform other actions here
    setTimeout(() => {
      setStep("input");
      setEmail("");
      setPhone("");
    }, 2000);
  };

  const handleBack = () => {
    setStep("input");
  };

  if (step === "verify") {
    return (
      <OTPVerification
        email={email}
        phone={phone}
        type={verificationType}
        onVerified={handleVerified}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Toaster position="top-right" />

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Django OTP Test
          </h1>
          <p className="text-gray-600">
            Test the new Django-powered OTP system
          </p>
        </div>

        {/* Verification Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose verification method:
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="verificationType"
                value="email"
                checked={verificationType === "email"}
                onChange={(e) => setVerificationType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">📧 Email OTP</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="verificationType"
                value="phone"
                checked={verificationType === "phone"}
                onChange={(e) => setVerificationType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">📱 Phone OTP</span>
            </label>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleStartVerification} className="space-y-6">
          {verificationType === "email" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          )}

          {verificationType === "phone" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Send OTP
          </button>
        </form>

        {/* Features List */}
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">
            ✅ Django OTP Features:
          </h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Secure OTP generation using django-otp</li>
            <li>• Database persistence with expiration</li>
            <li>• Attempt limiting (3 max attempts)</li>
            <li>• Console mode for development</li>
            <li>• Automatic cleanup of old OTPs</li>
            <li>• Email & Phone support</li>
          </ul>
        </div>

        {/* Development Info */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">
            🔧 Development Mode:
          </h3>
          <p className="text-sm text-blue-700">
            OTP codes are displayed in the Django console/terminal. Check your
            backend terminal for the generated codes.
          </p>
        </div>
      </div>
    </div>
  );
}
