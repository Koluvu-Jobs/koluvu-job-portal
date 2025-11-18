// src/app/auth/login/employee/page.js

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FaEnvelope,
  FaLock,
  FaKey,
  FaGoogle,
  FaGithub,
  FaLinkedinIn,
  FaUserPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";
import SocialAuth from "@koluvu/components/auth/SocialAuth";
import { useAuth } from "@koluvu/contexts/AuthContext";
import { USER_TYPES, getRedirectPath } from "@/utils/auth";
import toast from "react-hot-toast";
import CaptchaVerification, {
  verifyCaptchaValue,
} from "@koluvu/components/auth/CaptchaVerification";
import VerificationForm from "@koluvu/app/auth/register/employee/VerificationForm";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, clearAuthData } = useAuth();

  // Apply authentication guard
  const { isAllowed, isLoading: authLoading } = useAuthGuard("employee-login", {
    enableRedirect: true,
    showError: true,
  });
  const [deviceType, setDeviceType] = useState("desktop");
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaKey, setCaptchaKey] = useState("");
  const [loginStep, setLoginStep] = useState("credentials"); // "credentials", "otp", "complete"
  const [otpSent, setOtpSent] = useState(false);

  // Clear any stale auth data when login page loads
  useEffect(() => {
    // Only clear if there's potentially stale data but no valid authentication
    if (!isAuthenticated) {
      console.log("🧹 Login page: Clearing any stale authentication data");
      clearAuthData();
    }
  }, []);

  // Redirect if already authenticated - with better logging
  useEffect(() => {
    console.log("Employee login page - auth check:", {
      isAuthenticated,
      user: user?.email,
    });
    if (isAuthenticated && user) {
      console.log(
        "User is already authenticated, redirecting to employee dashboard..."
      );
      const redirectPath = getRedirectPath(USER_TYPES.EMPLOYEE, user);
      router.replace(redirectPath);
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 480) {
        setDeviceType("mobile");
      } else if (width <= 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    // Only fade in the video when it's ready
    const handleCanPlay = () => {
      setIsVideoLoaded(true);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError("");

    try {
      // Verify CAPTCHA first
      if (!captchaValue || !captchaKey) {
        setLoginError("Please complete the CAPTCHA verification.");
        setIsSubmitting(false);
        return;
      }

      const captchaVerification = await verifyCaptchaValue(
        captchaValue,
        captchaKey
      );
      if (!captchaVerification.valid) {
        setLoginError("Invalid CAPTCHA. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (loginStep === "credentials") {
        // Step 1: Send login OTP
        const otpResponse = await fetch(
          "http://127.0.0.1:8000/api/auth/send-otp/",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: email,
              type: "login",
            }),
          }
        );

        const otpData = await otpResponse.json();
        if (otpData.success) {
          setLoginStep("otp");
          setOtpSent(true);
          toast.success("Login OTP sent to your email!");
        } else {
          setLoginError(otpData.message || "Failed to send login OTP.");
        }
      }
    } catch (error) {
      console.error("Login step failed:", error);
      setLoginError("An unexpected error occurred.");
      toast.error("Login step failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPVerified = async () => {
    setIsSubmitting(true);
    setLoginError("");

    try {
      const response = await fetch("/api/employee/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          captcha_value: captchaValue,
          captcha_key: captchaKey,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.error && data.error.toLowerCase().includes("not verified")) {
          setLoginError(
            "Email not verified. Please check your inbox for a verification link."
          );
        } else {
          setLoginError(data.error || "Login failed.");
        }
        return;
      }

      // Use the auth context login function
      login(data);
      toast.success("Login successful!");

      // Get the redirect URL from query params or default to dashboard
      const params = new URLSearchParams(window.location.search);
      const from =
        params.get("from") || getRedirectPath(USER_TYPES.EMPLOYEE, data.user);
      router.push(from);
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("An unexpected error occurred.");
      toast.error("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password/employee");
  };

  const handleForgotEmail = () => {
    router.push("/auth/forgot-email");
  };

  const handleRegister = () => {
    router.push("/auth/register/employee");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCaptchaChange = (value, key) => {
    setCaptchaValue(value);
    setCaptchaKey(key);
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
          ? "1.5rem"
          : "2rem",
      position: "relative",
      overflow: "hidden",
    },
    videoBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0,
      opacity: isVideoLoaded ? 1 : 0,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      zIndex: 1,
    },
    loginBox: {
      width: "100%",
      maxWidth:
        deviceType === "mobile"
          ? "320px"
          : deviceType === "tablet"
          ? "400px"
          : "440px",
      backgroundColor: "rgba(30, 41, 59, 0.6)",
      backdropFilter: "blur(8px)",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      padding:
        deviceType === "mobile"
          ? "1.25rem"
          : deviceType === "tablet"
          ? "1.5rem"
          : "1.75rem",
      margin:
        deviceType === "mobile"
          ? "0.5rem"
          : deviceType === "tablet"
          ? "1rem"
          : "2rem",
      zIndex: 2,
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    logoContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: deviceType === "mobile" ? "1rem" : "1.25rem",
    },
    logoImage: {
      borderRadius: "50%",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      border: "2px solid rgba(255,255,255,0.1)",
    },
    title: {
      textAlign: "center",
      marginBottom: deviceType === "mobile" ? "0.5rem" : "0.75rem",
      fontSize:
        deviceType === "mobile"
          ? "1.35rem"
          : deviceType === "tablet"
          ? "1.5rem"
          : "1.65rem",
      color: "#fff",
      fontWeight: "600",
    },
    subtitle: {
      textAlign: "center",
      marginBottom: deviceType === "mobile" ? "1.1rem" : "1.4rem",
      color: "#cbd5e1",
      fontSize:
        deviceType === "mobile"
          ? "0.85rem"
          : deviceType === "tablet"
          ? "0.9rem"
          : "0.95rem",
    },
    socialLogin: {
      display: "flex",
      justifyContent: "center",
      gap: deviceType === "mobile" ? "0.6rem" : "0.8rem",
      marginBottom: deviceType === "mobile" ? "1.1rem" : "1.4rem",
      flexWrap: "wrap",
    },
    socialBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: deviceType === "mobile" ? "0.5rem 0.8rem" : "0.6rem 1rem",
      borderRadius: "8px",
      border: "1px solid rgba(148, 163, 184, 0.3)",
      backgroundColor: "rgba(30, 41, 59, 0.5)",
      cursor: "pointer",
      transition: "all 0.3s ease",
      minWidth: deviceType === "mobile" ? "auto" : "90px",
      height: deviceType === "mobile" ? "38px" : "42px",
      color: "#fff",
      fontSize: deviceType === "mobile" ? "0.85rem" : "0.9rem",
      ":hover": {
        backgroundColor: "rgba(51, 65, 85, 0.6)",
      },
    },
    divider: {
      display: "flex",
      alignItems: "center",
      margin: deviceType === "mobile" ? "1.1rem 0" : "1.4rem 0",
      color: "#94a3b8",
    },
    dividerLine: {
      flex: 1,
      border: "none",
      borderTop: "1px solid rgba(148, 163, 184, 0.3)",
    },
    dividerText: {
      padding: "0 0.75rem",
      fontSize: deviceType === "mobile" ? "0.8rem" : "0.85rem",
    },
    inputGroup: {
      position: "relative",
      marginBottom: deviceType === "mobile" ? "0.8rem" : "1rem",
    },
    inputIcon: {
      position: "absolute",
      left: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#94a3b8",
      fontSize: deviceType === "mobile" ? "0.95rem" : "1rem",
      zIndex: 1,
    },
    input: {
      width: "100%",
      padding:
        deviceType === "mobile"
          ? "0.7rem 3rem 0.7rem 2.75rem"
          : "0.8rem 3.5rem 0.8rem 3rem",
      borderRadius: "8px",
      border: "1px solid rgba(148, 163, 184, 0.3)",
      backgroundColor: "rgba(30, 41, 59, 0.4)",
      fontSize: deviceType === "mobile" ? "0.9rem" : "0.95rem",
      transition: "all 0.3s ease",
      outline: "none",
      color: "#fff",
      fontWeight: "400",
      ":focus": {
        borderColor: "#60a5fa",
        boxShadow: "0 0 0 3px rgba(96, 165, 250, 0.2)",
        backgroundColor: "rgba(30, 41, 59, 0.6)",
      },
    },
    eyeIcon: {
      position: "absolute",
      right: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#94a3b8",
      cursor: "pointer",
      fontSize: deviceType === "mobile" ? "0.95rem" : "1rem",
      zIndex: 1,
    },
    loginBtn: {
      width: "100%",
      padding: deviceType === "mobile" ? "0.7rem" : "0.8rem",
      borderRadius: "8px",
      border: "none",
      background: "linear-gradient(to right, #3b82f6, #6366f1)",
      color: "#fff",
      fontSize: deviceType === "mobile" ? "0.9rem" : "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      ":hover": {
        opacity: 0.9,
      },
      ":active": {
        transform: "scale(0.98)",
      },
    },
    forgotOptions: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: deviceType === "mobile" ? "1.1rem" : "1.3rem",
      flexWrap: "wrap",
      gap: "0.75rem",
    },
    forgotLink: {
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      color: "#cbd5e1",
      fontSize: deviceType === "mobile" ? "0.8rem" : "0.85rem",
      cursor: "pointer",
      textDecoration: "none",
      transition: "color 0.3s ease",
      ":hover": {
        color: "#93c5fd",
      },
    },
    registerLink: {
      textAlign: "center",
    },
    registerText: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.4rem",
      color: "#cbd5e1",
      fontSize: deviceType === "mobile" ? "0.85rem" : "0.9rem",
      cursor: "pointer",
      textDecoration: "none",
      transition: "color 0.3s ease",
      ":hover": {
        color: "#93c5fd",
      },
    },
    registerHighlight: {
      fontWeight: "600",
      color: "#93c5fd",
    },
  };

  // Show loading or redirect if not allowed
  if (!isAllowed) {
    return null; // Auth guard handles redirect
  }

  return (
    <div style={styles.pageContainer}>
      <Header />
      <div style={styles.contentWrapper}>
        <div style={styles.mainContainer}>
          <video
            ref={videoRef}
            style={{
              ...styles.videoBackground,
              opacity: isVideoLoaded ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source src="/videos/employee-login.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div style={styles.overlay} />

          <div style={styles.loginBox}>
            <div style={styles.logoContainer}>
              <Image
                src="/images/koluvu_logo.jpg"
                alt="Koluvu Logo"
                width={
                  deviceType === "mobile"
                    ? 60
                    : deviceType === "tablet"
                    ? 65
                    : 70
                }
                height={
                  deviceType === "mobile"
                    ? 60
                    : deviceType === "tablet"
                    ? 65
                    : 70
                }
                priority
                style={styles.logoImage}
              />
            </div>
            <div>
              <h2 style={styles.title}>Welcome Back 👋</h2>
              <p style={styles.subtitle}>
                Login to continue to{" "}
                <strong style={{ color: "#fff" }}>Koluvu</strong>
              </p>

              <div style={styles.socialLogin}>
                <SocialAuth userType={USER_TYPES.EMPLOYEE} />
              </div>

              <div style={styles.divider}>
                <hr style={styles.dividerLine} />
                <span style={styles.dividerText}>OR</span>
                <hr style={styles.dividerLine} />
              </div>

              {loginStep === "credentials" && (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    marginBottom: deviceType === "mobile" ? "1.1rem" : "1.3rem",
                  }}
                >
                  <div style={styles.inputGroup}>
                    <FaEnvelope style={styles.inputIcon} />
                    <input
                      type="email"
                      placeholder="Email ID"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      aria-label="Email address"
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <FaLock style={styles.inputIcon} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      aria-label="Password"
                      style={styles.input}
                    />
                    <div
                      style={styles.eyeIcon}
                      onClick={togglePasswordVisibility}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && togglePasswordVisibility()
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>

                  {/* CAPTCHA Verification */}
                  <CaptchaVerification
                    onCaptchaChange={handleCaptchaChange}
                    captchaValue={captchaValue}
                    deviceType={deviceType}
                    required={true}
                  />

                  {loginError && (
                    <div
                      style={{
                        color: "#ef4444",
                        fontSize:
                          deviceType === "mobile" ? "0.8rem" : "0.85rem",
                        marginBottom: "0.75rem",
                        textAlign: "center",
                        padding: "0.5rem",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        borderRadius: "6px",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                      }}
                    >
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    style={{
                      ...styles.loginBtn,
                      ...(isSubmitting
                        ? { opacity: 0.7, cursor: "not-allowed" }
                        : {}),
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Sending Login OTP..."
                      : "Continue to Login"}
                  </button>
                </form>
              )}

              {loginStep === "otp" && (
                <div
                  style={{
                    marginBottom: deviceType === "mobile" ? "1.1rem" : "1.3rem",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "1rem",
                      color: "#cbd5e1",
                    }}
                  >
                    <p
                      style={{
                        fontSize:
                          deviceType === "mobile" ? "0.85rem" : "0.9rem",
                      }}
                    >
                      We've sent a login verification code to
                      <br />
                      <strong style={{ color: "#fff" }}>{email}</strong>
                    </p>
                  </div>

                  <VerificationForm
                    fieldName="loginOTP"
                    fieldLabel="Login OTP"
                    placeholder="Enter 6-digit verification code"
                    verificationType="login"
                    captchaVerified={true}
                    onVerificationChange={handleOTPVerified}
                    inputStyle={`${styles.input} text-center text-lg tracking-wider`}
                    btnStyle={styles.loginBtn}
                    hideEmailInput={true}
                    presetEmail={email}
                  />

                  {loginError && (
                    <div
                      style={{
                        color: "#ef4444",
                        fontSize:
                          deviceType === "mobile" ? "0.8rem" : "0.85rem",
                        marginTop: "0.75rem",
                        textAlign: "center",
                        padding: "0.5rem",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        borderRadius: "6px",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                      }}
                    >
                      {loginError}
                    </div>
                  )}

                  <button
                    onClick={() => setLoginStep("credentials")}
                    style={{
                      ...styles.forgotLink,
                      marginTop: "1rem",
                      textAlign: "center",
                      width: "100%",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    ← Back to Login
                  </button>
                </div>
              )}

              <div style={styles.forgotOptions}>
                <a
                  onClick={handleForgotPassword}
                  role="button"
                  tabIndex={0}
                  style={styles.forgotLink}
                >
                  <FaKey />
                  {deviceType !== "mobile" && "Forgot Password?"}
                </a>
              </div>

              <div style={styles.registerLink}>
                <a
                  onClick={handleRegister}
                  role="button"
                  tabIndex={0}
                  style={styles.registerText}
                >
                  <FaUserPlus />
                  {deviceType !== "mobile" ? "Don't have an account? " : ""}
                  {deviceType !== "mobile" ? (
                    <span style={styles.registerHighlight}>Register here</span>
                  ) : (
                    "Register"
                  )}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
