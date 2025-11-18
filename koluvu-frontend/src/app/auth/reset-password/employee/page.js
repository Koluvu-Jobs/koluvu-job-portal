"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaKey,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
} from "react-icons/fa";
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";
import toast, { Toaster } from "react-hot-toast";

export default function EmployeeResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    // Get email from URL params
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    // Detect device type
    const detectDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) return "mobile";
      if (width < 1024) return "tablet";
      return "desktop";
    };

    setDeviceType(detectDeviceType());

    const handleResize = () => setDeviceType(detectDeviceType());
    window.addEventListener("resize", handleResize);

    // Handle video autoplay
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoLoaded(true))
          .catch((error) => {
            console.log("Video autoplay failed:", error);
            setIsVideoLoaded(false);
          });
      }
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !otp || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/reset-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp: otp,
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success(
          "Password reset successfully! You can now login with your new password."
        );
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/auth/login/employee");
        }, 2000);
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    pageContainer: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#0f172a",
    },
    contentWrapper: {
      flex: 1,
      position: "relative",
      display: "flex",
      flexDirection: "column",
    },
    mainContainer: {
      display: "flex",
      justifyContent: deviceType === "mobile" ? "center" : "flex-end",
      alignItems: "center",
      flex: 1,
      padding:
        deviceType === "mobile"
          ? "0.5rem"
          : deviceType === "tablet"
          ? "2rem"
          : "3rem",
      paddingRight: deviceType !== "mobile" ? "8%" : "0.5rem",
    },
    formCard: {
      width: "100%",
      maxWidth: deviceType === "mobile" ? "100%" : "420px",
      backgroundColor: "rgba(30, 41, 59, 0.95)",
      backdropFilter: "blur(20px)",
      borderRadius: deviceType === "mobile" ? "12px" : "20px",
      padding: deviceType === "mobile" ? "1.5rem" : "2.5rem",
      border: "1px solid rgba(148, 163, 184, 0.2)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    },
    title: {
      fontSize: deviceType === "mobile" ? "1.5rem" : "1.8rem",
      fontWeight: "700",
      color: "#ffffff",
      textAlign: "center",
      marginBottom: "0.5rem",
    },
    subtitle: {
      fontSize: deviceType === "mobile" ? "0.9rem" : "1rem",
      color: "#cbd5e1",
      textAlign: "center",
      marginBottom: "2rem",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: "600",
      color: "#e2e8f0",
    },
    input: {
      width: "100%",
      padding: deviceType === "mobile" ? "0.8rem 1rem" : "1rem 1.2rem",
      fontSize: deviceType === "mobile" ? "0.9rem" : "1rem",
      backgroundColor: "rgba(51, 65, 85, 0.6)",
      border: "1px solid rgba(148, 163, 184, 0.3)",
      borderRadius: "10px",
      color: "#ffffff",
      outline: "none",
      transition: "all 0.3s ease",
    },
    passwordContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    passwordToggle: {
      position: "absolute",
      right: "1rem",
      cursor: "pointer",
      color: "#94a3b8",
      fontSize: "1.1rem",
      transition: "color 0.3s ease",
    },
    submitBtn: {
      width: "100%",
      padding: deviceType === "mobile" ? "0.8rem" : "1rem",
      borderRadius: "10px",
      border: "none",
      background: "linear-gradient(to right, #3b82f6, #6366f1)",
      color: "#fff",
      fontSize: deviceType === "mobile" ? "0.9rem" : "1rem",
      fontWeight: "600",
      cursor: isLoading ? "not-allowed" : "pointer",
      transition: "all 0.3s ease",
      opacity: isLoading ? 0.7 : 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    },
    backLink: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.9rem",
      color: "#94a3b8",
      textDecoration: "none",
      marginTop: "1.5rem",
      justifyContent: "center",
      transition: "color 0.3s ease",
    },
    infoBox: {
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      border: "1px solid rgba(34, 197, 94, 0.3)",
      borderRadius: "10px",
      padding: "1rem",
      marginBottom: "1.5rem",
    },
    infoText: {
      fontSize: "0.85rem",
      color: "#86efac",
      textAlign: "center",
      lineHeight: "1.5",
    },
    otpInput: {
      textAlign: "center",
      letterSpacing: "0.2em",
      fontSize: "1.2rem",
      fontFamily: "monospace",
    },
  };

  return (
    <div style={styles.pageContainer}>
      <Header />

      <div style={styles.contentWrapper}>
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/employee-login.mp4" type="video/mp4" />
            <source src="/videos/employee-login.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Koluvu Text in Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/10 select-none tracking-wider">
            KOLUVU
          </h1>
        </div>

        <div style={styles.mainContainer} className="relative z-10">
          <div style={styles.formCard}>
            <div style={styles.title}>
              <FaShieldAlt className="inline mr-2" />
              Reset Password
            </div>
            <p style={styles.subtitle}>
              Enter the verification code sent to your email and create a new
              password
            </p>

            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                <FaKey className="inline mr-1" />
                Check your email ({email}) for the 6-digit verification code
              </p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={styles.input}
                  required
                  disabled={isLoading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit code"
                  style={{ ...styles.input, ...styles.otpInput }}
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>New Password</label>
                <div style={styles.passwordContainer}>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={{ ...styles.input, paddingRight: "3rem" }}
                    minLength={8}
                    required
                    disabled={isLoading}
                  />
                  <div
                    style={styles.passwordToggle}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#94a3b8";
                    }}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm New Password</label>
                <div style={styles.passwordContainer}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    style={{ ...styles.input, paddingRight: "3rem" }}
                    minLength={8}
                    required
                    disabled={isLoading}
                  />
                  <div
                    style={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#94a3b8";
                    }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={styles.submitBtn}
                disabled={isLoading}
                onMouseEnter={(e) => {
                  if (!isLoading) e.target.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) e.target.style.opacity = "1";
                }}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  <>
                    <FaShieldAlt />
                    Reset Password
                  </>
                )}
              </button>
            </form>

            <Link
              href="/auth/forgot-password/employee"
              style={styles.backLink}
              onMouseEnter={(e) => {
                e.target.style.color = "#3b82f6";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#94a3b8";
              }}
            >
              <FaArrowLeft />
              Back to Forgot Password
            </Link>
          </div>
        </div>
      </div>

      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}
