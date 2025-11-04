// src/app/auth/login/employer/page.js

"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, clearAuthData } = useAuth();
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaKey, setCaptchaKey] = useState("");

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
    console.log("Employer login page - auth check:", {
      isAuthenticated,
      user: user?.email,
    });
    if (isAuthenticated && user) {
      console.log(
        "User is already authenticated, redirecting to employer dashboard..."
      );
      const redirectPath = getRedirectPath(USER_TYPES.EMPLOYER, user.username);
      router.replace(redirectPath);
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = async () => {
      try {
        await video.play();
        setIsVideoLoaded(true);
      } catch (err) {
        console.error("Autoplay prevented:", err);
        video.muted = true;
        try {
          await video.play();
          setIsVideoLoaded(true);
        } catch (err2) {
          console.error("Muted playback failed:", err2);
        }
      }
    };

    if (video.readyState > 2) {
      handlePlay();
    }

    video.addEventListener("loadeddata", handlePlay);
    video.addEventListener("canplay", handlePlay);

    return () => {
      video.removeEventListener("loadeddata", handlePlay);
      video.removeEventListener("canplay", handlePlay);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      // Verify CAPTCHA first
      if (!captchaValue || !captchaKey) {
        setLoginError("Please complete the CAPTCHA verification.");
        setIsLoading(false);
        return;
      }

      const captchaVerification = await verifyCaptchaValue(
        captchaValue,
        captchaKey
      );
      if (!captchaVerification.valid) {
        setLoginError("Invalid CAPTCHA. Please try again.");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/employer/login", {
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
        params.get("from") ||
        getRedirectPath(USER_TYPES.EMPLOYER, data.user.username);
      router.push(from);
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("An unexpected error occurred.");
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  const handleForgotEmail = () => {
    router.push("/auth/forgot-email");
  };

  const handleRegister = () => {
    router.push("/auth/register/employer");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCaptchaChange = (value, key) => {
    setCaptchaValue(value);
    setCaptchaKey(key);
  };

  return (
    <>
      <Header />
      <div className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: isVideoLoaded ? 1 : 0 }}
          >
            <source src="/videos/login_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="flex-grow flex items-center justify-end p-4 relative z-10">
          <div className="w-full max-w-md p-8 bg-gray-900/60 backdrop-blur-md rounded-xl shadow-lg border border-gray-600/40 lg:mr-20">
            <div className="text-center mb-7">
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-gray-200 mt-2">
                Login to continue to{" "}
                <span className="text-blue-400 font-medium">Koluvu</span>
              </p>
            </div>

            <div className="mb-7">
              <SocialAuth userType={USER_TYPES.EMPLOYER} />
            </div>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600/40"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-sm text-gray-300 bg-gray-900/60">
                  Or login with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="text-gray-300" />
                </div>
                <input
                  type="email"
                  placeholder="Email ID"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Email address"
                  className="w-full pl-10 pr-3 py-3 text-sm bg-gray-800/60 border border-gray-600/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/70 placeholder-gray-300 text-white"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-gray-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Password"
                  className="w-full pl-10 pr-10 py-3 text-sm bg-gray-800/60 border border-gray-600/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/70 placeholder-gray-300 text-white"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-300 hover:text-white transition-colors"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* CAPTCHA Verification */}
              <CaptchaVerification
                onCaptchaChange={handleCaptchaChange}
                captchaValue={captchaValue}
                deviceType="desktop"
                required={true}
                style={{
                  marginBottom: "1rem",
                }}
              />

              {loginError && (
                <div className="text-red-400 text-xs text-center p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
                  {loginError}
                </div>
              )}
              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-3 rounded-lg hover:opacity-90 transition-opacity ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div className="flex justify-between mt-5 text-sm">
              <button
                onClick={handleForgotPassword}
                className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FaKey className="mr-2" /> Forgot Password?
              </button>
              <button
                onClick={handleForgotEmail}
                className="flex items-center text-gray-300 hover:text-blue-400 transition-colors"
              >
                <FaEnvelope className="mr-2" /> Forgot Email?
              </button>
            </div>

            <div className="mt-7 text-center">
              <button
                onClick={handleRegister}
                className="flex items-center justify-center text-gray-300 hover:text-blue-400 transition-colors w-full"
              >
                <FaUserPlus className="mr-2" />
                {"Don't have an account?"}{" "}
                <span className="text-blue-400 ml-1 font-medium">
                  Register here
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
