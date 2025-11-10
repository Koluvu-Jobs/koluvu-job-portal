// src/app/auth/register/employee/VerificationForm.js

"use client";
import { useState, useEffect } from "react";

export default function VerificationForm({
  fieldName,
  fieldLabel,
  placeholder,
  verificationType,
  inputStyle = "",
  btnStyle = "",
  captchaVerified = false,
  onEmailChange = null,
  onVerificationChange = null,
  hideEmailInput = false,
  presetEmail = "",
}) {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);

  const [otpValue, setOtpValue] = useState("");
  const [message, setMessage] = useState("");
  const [fieldValue, setFieldValue] = useState(presetEmail || "");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  // Auto-send OTP if email is preset and input is hidden
  useEffect(() => {
    if (
      hideEmailInput &&
      presetEmail &&
      captchaVerified &&
      !showOTPField &&
      !isVerified
    ) {
      sendOTP();
    }
  }, [hideEmailInput, presetEmail, captchaVerified]);

  const sendOTP = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (!fieldValue) {
        setMessage(`Please enter your ${fieldLabel.toLowerCase()} first`);
        setMessageType("error");
        setLoading(false);
        return;
      }

      // Check if main form CAPTCHA is verified
      if (!captchaVerified) {
        setMessage(
          "Please complete the CAPTCHA verification at the bottom of the form first"
        );
        setMessageType("error");
        setLoading(false);
        return;
      }

      if (verificationType === "email") {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
          setMessage("Please enter a valid email address");
          setMessageType("error");
          setLoading(false);
          return;
        }

        // Get username from the form if available
        const usernameField = document.querySelector('input[name="username"]');
        const username = usernameField ? usernameField.value : "";

        // Send OTP via Django backend for email
        const otpType = verificationType === "login" ? "login" : "email";
        const response = await fetch(
          "http://127.0.0.1:8000/api/auth/send-otp/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: fieldValue,
              type: otpType,
              username: username,
            }),
          }
        );

        const result = await response.json();

        if (result.success) {
          setShowOTPField(true);
          setMessage("OTP sent successfully to your email!");
          setMessageType("success");
        } else {
          setMessage(result.message || "Failed to send OTP");
          setMessageType("error");
        }
      } else {
        // Mobile validation
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(fieldValue)) {
          setMessage("Please enter a valid 10-digit mobile number");
          setMessageType("error");
          setLoading(false);
          return;
        }

        // Send OTP via Django backend for mobile
        const response = await fetch(
          "http://127.0.0.1:8000/api/auth/send-otp/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: fieldValue,
              type: "phone",
            }),
          }
        );

        const result = await response.json();

        if (result.success) {
          setShowOTPField(true);
          setMessage(
            "OTP sent! Check PowerShell/Terminal for the code (development mode)"
          );
          setMessageType("success");
        } else {
          setMessage(result.message || "Failed to send OTP");
          setMessageType("error");
        }
      }
    } catch (error) {
      console.error(`${verificationType} verification failed:`, error);
      setMessage("Failed to send OTP. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setLoading(true);
    setMessage("");

    try {
      if (verificationType === "email" || verificationType === "login") {
        // Verify email or login OTP via Django backend
        const otpType = verificationType === "login" ? "login" : "email";
        const response = await fetch(
          "http://127.0.0.1:8000/api/auth/verify-otp/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: fieldValue,
              otp: otpValue,
              type: otpType,
            }),
          }
        );

        const result = await response.json();

        if (result.success) {
          setIsVerified(true);
          if (onVerificationChange) onVerificationChange(true);
          setMessage("Email verified successfully!");
          setMessageType("success");
          setShowOTPField(false);
        } else {
          setMessage(result.message || "Invalid OTP. Please try again.");
          setMessageType("error");
        }
      } else {
        // Verify mobile OTP via Django backend
        const response = await fetch(
          "http://127.0.0.1:8000/api/auth/verify-otp/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: fieldValue,
              otp: otpValue,
              type: "phone",
            }),
          }
        );

        const result = await response.json();

        if (result.success) {
          setIsVerified(true);
          if (onVerificationChange) onVerificationChange(true);
          setMessage("Mobile number verified successfully!");
          setMessageType("success");
          setShowOTPField(false);
        } else {
          setMessage(result.message || "Invalid OTP. Please try again.");
          setMessageType("error");
        }
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setMessage("Verification failed. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    setOtpValue("");
    setMessage("");
    await sendOTP();
  };

  return (
    <div className="space-y-2">
      {!hideEmailInput && (
        <div className="flex gap-2">
          <input
            className={`${inputStyle} flex-1`}
            type={
              verificationType === "email" || verificationType === "login"
                ? "email"
                : "tel"
            }
            value={fieldValue}
            onChange={(e) => {
              setFieldValue(e.target.value);
              if (onEmailChange) onEmailChange(e.target.value);
            }}
            name={fieldName}
            placeholder={placeholder}
            required
            disabled={isVerified}
          />
          <button
            type="button"
            className={`${btnStyle} whitespace-nowrap ${
              isVerified || !captchaVerified
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={sendOTP}
            disabled={loading || isVerified || !captchaVerified}
            title={
              !captchaVerified ? "Complete CAPTCHA verification first" : ""
            }
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      )}

      {showOTPField && !isVerified && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              className={`${inputStyle} flex-1`}
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otpValue}
              onChange={(e) =>
                setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              disabled={isVerified || loading}
              maxLength={6}
            />
            <button
              type="button"
              className={`${btnStyle} whitespace-nowrap ${
                !otpValue || otpValue.length !== 6
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={verifyOTP}
              disabled={
                loading || isVerified || !otpValue || otpValue.length !== 6
              }
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-blue-400 hover:text-blue-300 text-xs underline"
              onClick={resendOTP}
              disabled={loading}
            >
              Didn't receive OTP? Resend
            </button>
          </div>
        </div>
      )}

      {message && (
        <p
          className={`text-xs mt-1 flex items-center gap-1 ${
            messageType === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {messageType === "success" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {message}
        </p>
      )}

      {isVerified && (
        <input type="hidden" name={`${fieldName}Verified`} value="true" />
      )}
    </div>
  );
}
