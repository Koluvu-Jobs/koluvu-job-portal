"use client";

import { useState, useEffect } from "react";
import { FaShieldAlt, FaRedo, FaCheck } from "react-icons/fa";

export default function CaptchaVerification({
  onCaptchaChange,
  captchaValue,
  deviceType = "desktop",
  required = true,
  style = {},
  className = "",
}) {
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState(captchaValue || "");
  const [captchaKey, setCaptchaKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Generate simple CAPTCHA (minimum 8 characters)
  const generateSimpleCaptcha = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let newCaptcha = "";
    for (let i = 0; i < 8; i++) {
      newCaptcha += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptcha(newCaptcha);
    setCaptchaKey("simple_" + Date.now());
    setCaptchaInput("");
    setIsVerified(false);
    setError("");

    if (onCaptchaChange) {
      onCaptchaChange("", "simple_" + Date.now());
    }
  };

  useEffect(() => {
    generateSimpleCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setCaptchaInput(value);
    setIsVerified(false);
    setError("");
  };

  const refreshCaptcha = () => {
    generateSimpleCaptcha();
  };

  const verifyCaptcha = async () => {
    if (!captchaInput.trim()) {
      setError("Please enter the CAPTCHA code");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Simple verification for the generated CAPTCHA
    const isValid = captchaInput.toUpperCase() === captcha.toUpperCase();

    setTimeout(() => {
      if (isValid) {
        setIsVerified(true);
        if (onCaptchaChange) {
          onCaptchaChange(captchaInput, captchaKey);
        }
      } else {
        setError("Invalid CAPTCHA. Please try again.");
        generateSimpleCaptcha();
      }
      setIsVerifying(false);
    }, 500); // Small delay to show verification animation
  };

  const isMobile = deviceType === "mobile";

  return (
    <div
      style={{ marginBottom: isMobile ? "0.8rem" : "1rem", ...style }}
      className={className}
    >
      {/* Label */}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: isMobile ? "0.5rem" : "0.75rem",
          color: isVerified ? "#10b981" : "#cbd5e1",
          fontSize: isMobile ? "0.8rem" : "0.9rem",
          fontWeight: "500",
        }}
      >
        {isVerified ? <FaCheck /> : <FaShieldAlt />}
        Security Verification {required && "*"} {isVerified && "(Verified)"}
      </label>

      {/* Error Message */}
      {error && (
        <div
          style={{
            color: "#ef4444",
            fontSize: isMobile ? "0.75rem" : "0.8rem",
            marginBottom: "0.5rem",
          }}
        >
          {error}
        </div>
      )}

      {/* CAPTCHA Display and Refresh Button */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "0.5rem",
          alignItems: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            minHeight: isMobile ? "40px" : "45px",
            background: "linear-gradient(to right, #3b82f6, #6366f1)",
            color: "#fff",
            fontFamily: "monospace",
            fontSize: isMobile ? "1rem" : "1.1rem",
            fontWeight: "bold",
            textAlign: "center",
            letterSpacing: "0.2em",
            borderRadius: "8px",
            border: isVerified
              ? "2px solid #10b981"
              : "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
          }}
        >
          {captcha}
        </div>

        <button
          type="button"
          onClick={refreshCaptcha}
          disabled={isLoading}
          style={{
            padding: isMobile ? "0.4rem" : "0.5rem",
            backgroundColor: "rgba(30, 41, 59, 0.6)",
            border: "1px solid rgba(148, 163, 184, 0.3)",
            borderRadius: "8px",
            color: "#cbd5e1",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: isMobile ? "36px" : "40px",
            height: isMobile ? "40px" : "45px",
          }}
          title="Refresh CAPTCHA"
        >
          <FaRedo size={isMobile ? 12 : 14} />
        </button>
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={captchaInput}
        onChange={handleInputChange}
        placeholder="Enter the above code *"
        required={required}
        maxLength={8}
        style={{
          width: "100%",
          padding: isMobile ? "0.6rem 1rem" : "0.7rem 1.25rem",
          borderRadius: "8px",
          border: isVerified
            ? "2px solid #10b981"
            : "1px solid rgba(148, 163, 184, 0.3)",
          backgroundColor: "rgba(30, 41, 59, 0.4)",
          fontSize: isMobile ? "0.9rem" : "0.95rem",
          color: "#fff",
          fontFamily: "monospace",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          transition: "all 0.3s ease",
          outline: "none",
          marginBottom: "0.5rem",
        }}
      />

      {/* Verify Button */}
      <button
        type="button"
        onClick={verifyCaptcha}
        disabled={isVerifying || !captchaInput.trim() || isVerified}
        style={{
          width: "100%",
          padding: isMobile ? "0.6rem" : "0.7rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: isVerified ? "#10b981" : "#3b82f6",
          color: "#fff",
          fontSize: isMobile ? "0.8rem" : "0.9rem",
          fontWeight: "600",
          cursor: isVerifying || isVerified ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          opacity: isVerifying ? 0.7 : 1,
        }}
      >
        {isVerifying ? (
          <>
            <div
              style={{
                width: "14px",
                height: "14px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            Verifying...
          </>
        ) : isVerified ? (
          <>
            <FaCheck size={14} />
            Verified!
          </>
        ) : (
          "Verify CAPTCHA"
        )}
      </button>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

// Export a verification function for forms
export const verifyCaptchaValue = async (captchaValue, captchaKey) => {
  try {
    if (captchaKey.startsWith("simple_")) {
      return { valid: true, error: null };
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${backendUrl}/api/auth/captcha/verify/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        captcha_value: captchaValue,
        captcha_key: captchaKey,
      }),
    });

    const data = await response.json();
    return { valid: data.valid || false, error: data.error };
  } catch (error) {
    console.error("CAPTCHA verification error:", error);
    return { valid: false, error: "Verification failed" };
  }
};
