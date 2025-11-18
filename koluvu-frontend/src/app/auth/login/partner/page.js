// src/app/auth/login/partner/page.js

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

export default function LoginPage() {
  const router = useRouter();
  const [deviceType, setDeviceType] = useState("desktop");
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const video = videoRef.current; // Store in variable immediately
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

    const handlePlay = async () => {
      try {
        await video.play();
        setIsVideoLoaded(true);
      } catch (err) {
        console.error("Autoplay prevented:", err);
        try {
          video.muted = true;
          await video.play();
          setIsVideoLoaded(true);
        } catch (err2) {
          console.error("Muted playback failed:", err2);
        }
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    // Use the stored video reference
    video.addEventListener("loadeddata", handlePlay);
    video.addEventListener("canplay", handlePlay);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      // Use the same stored video reference in cleanup
      video.removeEventListener("loadeddata", handlePlay);
      video.removeEventListener("canplay", handlePlay);
    };
  }, []);

  const handleSocialLogin = async (provider) => {
    try {
      switch (provider) {
        case "google":
          const { signInWithGoogle } = await import(
            "@koluvu/utils/auth/googleAuth"
          );
          const result = await signInWithGoogle("partner");

          if (result.error) {
            console.error("Google OAuth error:", result.error);
            alert(`Authentication failed: ${result.error}`);
            return;
          }

          console.log("Partner login successful:", result);

          // Redirect to training dashboard (used for partners)
          router.push("/dashboard/training");
          break;

        case "github":
          const { signInWithGitHub } = await import(
            "@koluvu/utils/auth/githubAuth"
          );
          const githubResult = await signInWithGitHub("partner");

          if (githubResult.error) {
            console.error("GitHub OAuth error:", githubResult.error);
            alert(`Authentication failed: ${githubResult.error}`);
            return;
          }

          console.log("Partner GitHub login successful:", githubResult);

          // Redirect to training dashboard (used for partners)
          router.push("/dashboard/training");
          break;

        case "linkedin":
          const { signInWithLinkedIn } = await import(
            "@koluvu/utils/auth/linkedinAuth"
          );
          const linkedinResult = await signInWithLinkedIn("partner");

          if (linkedinResult.error) {
            console.error("LinkedIn OAuth error:", linkedinResult.error);
            alert(`Authentication failed: ${linkedinResult.error}`);
            return;
          }

          console.log("Partner LinkedIn login successful:", linkedinResult);

          // Redirect to training dashboard (used for partners)
          router.push("/dashboard/training");
          break;

        default:
          console.warn("Unknown provider:", provider);
          break;
      }
    } catch (error) {
      console.error(`${provider} authentication error:`, error);
      alert(`Authentication failed: ${error.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // TODO: Implement email/password login for partners
      setTimeout(() => {
        router.push("/dashboard/training");
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password/partner");
  };

  const handleForgotEmail = () => {
    router.push("/auth/forgot-email");
  };

  const handleRegister = () => {
    router.push("/auth/register/partner");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      backgroundColor: "rgba(0, 0, 0, 0.4)",
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

  return (
    <div style={styles.pageContainer}>
      <Header />
      <div style={styles.contentWrapper}>
        <div style={styles.mainContainer}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            style={styles.videoBackground}
          >
            <source src="/videos/employer_login.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div style={styles.overlay}></div>

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
                <button
                  onClick={() => handleSocialLogin("google")}
                  aria-label="Login with Google"
                  style={styles.socialBtn}
                >
                  <FaGoogle />
                  {deviceType !== "mobile" && "Google"}
                </button>
                <button
                  onClick={() => handleSocialLogin("github")}
                  aria-label="Login with GitHub"
                  style={styles.socialBtn}
                >
                  <FaGithub />
                  {deviceType !== "mobile" && "GitHub"}
                </button>
                <button
                  onClick={() => handleSocialLogin("linkedin")}
                  aria-label="Login with LinkedIn"
                  style={styles.socialBtn}
                >
                  <FaLinkedinIn />
                  {deviceType !== "mobile" && "LinkedIn"}
                </button>
              </div>

              <div style={styles.divider}>
                <hr style={styles.dividerLine} />
                <span style={styles.dividerText}>OR</span>
                <hr style={styles.dividerLine} />
              </div>

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
                <button type="submit" style={styles.loginBtn}>
                  Login
                </button>
              </form>

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
