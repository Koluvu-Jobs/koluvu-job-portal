// src/components/auth/OTPVerification.js

"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const OTPVerification = ({
  email,
  phone,
  type = "email",
  onVerified,
  onBack,
}) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendOTP = async () => {
    if (isResending) return;

    setIsResending(true);
    try {
      const payload = {
        type: type,
        ...(type === "email" ? { email } : { phone }),
      };

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://127.0.0.1:8000";
      const response = await fetch(`${backendUrl}/api/auth/send-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setCountdown(60); // 1 minute countdown
        setAttempts(0);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        otp: otp,
        type: type,
        ...(type === "email" ? { email } : { phone }),
      };

      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://127.0.0.1:8000";
      const response = await fetch(`${backendUrl}/api/auth/verify-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success && data.verified) {
        toast.success("OTP verified successfully!");
        onVerified && onVerified();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= maxAttempts) {
          toast.error("Maximum attempts reached. Please request a new OTP.");
          setOtp("");
        } else {
          toast.error(data.message || "Invalid OTP. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-send OTP when component mounts
  useEffect(() => {
    sendOTP();
  }, []);

  const formatIdentifier = () => {
    if (type === "email") return email;
    if (type === "phone") return phone;
    return "";
  };

  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            {type === "email" ? (
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your {type === "email" ? "Email" : "Phone"}
          </h2>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-semibold text-gray-900 mt-1">
            {formatIdentifier()}
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={verifyOTP} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter verification code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="000000"
              maxLength="6"
              autoComplete="one-time-code"
              disabled={isLoading || attempts >= maxAttempts}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6 || attempts >= maxAttempts}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Verifying...
              </div>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>

        {/* Attempts Warning */}
        {attempts > 0 && attempts < maxAttempts && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Invalid code. {maxAttempts - attempts} attempts remaining.
            </p>
          </div>
        )}

        {attempts >= maxAttempts && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ❌ Maximum attempts reached. Please request a new code.
            </p>
          </div>
        )}

        {/* Resend Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Didn't receive the code?</p>
          {countdown > 0 ? (
            <p className="text-sm font-medium text-gray-500 mt-1">
              Resend available in {formatCountdown()}
            </p>
          ) : (
            <button
              onClick={sendOTP}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm mt-1 disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          )}
        </div>

        {/* Back Button */}
        {onBack && (
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-700 text-sm font-medium"
            >
              ← Change {type === "email" ? "Email" : "Phone Number"}
            </button>
          </div>
        )}

        {/* Development Notice */}
        <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            🔧 <strong>Development Mode:</strong> Check your terminal/console
            for the OTP code
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
