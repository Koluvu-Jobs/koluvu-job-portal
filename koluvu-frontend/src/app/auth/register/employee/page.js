// src/app/auth/register/employee/page.js

"use client";

import { useState, useRef, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FaGithub,
  FaLinkedin,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VerificationForm from "./VerificationForm";
import { registerEmployee } from "./actions";
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";
import { signInWithGoogle } from "@/utils/auth/googleAuth";
import { useAuth } from "@/contexts/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import { getRedirectPath, USER_TYPES } from "@/utils/auth";
import CaptchaVerification, {
  verifyCaptchaValue,
} from "@koluvu/components/auth/CaptchaVerification";

export default function EmployeeRegistration() {
  const router = useRouter();
  const { login, user, userType, loading: authLoading } = useAuth();
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaKey, setCaptchaKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(null);
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Redirect authenticated users to their dashboard
    if (!authLoading && user && userType) {
      const redirectPath = getRedirectPath(userType, user.username);
      console.log(
        `Authenticated ${userType} accessing employee registration. Redirecting to:`,
        redirectPath
      );
      router.push(redirectPath);
      return;
    }

    // Handle video autoplay
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoLoaded(true))
          .catch((error) => {
            console.log("Video autoplay failed:", error);
            setVideoLoaded(false);
          });
      }
    }
  }, [authLoading, user, userType, router]);

  const handleCaptchaChange = (value, key) => {
    setCaptchaValue(value);
    setCaptchaKey(key);
  };

  const generateCaptcha = () => {
    // This function is now handled by the CaptchaVerification component
    // Keep for backward compatibility but not used
  };

  const handleSubmit = async (formData) => {
    // Note: CAPTCHA verification is now handled within the CaptchaVerification component
    // The component calls onCaptchaChange when verification is successful
    if (!captchaValue || !captchaKey) {
      toast.error("Please complete and verify the CAPTCHA.");
      return;
    }

    const result = await registerEmployee(formData);
    if (result.success) {
      router.push("/registration-success");
    } else {
      toast.error(result.message || "Registration failed");
    }
  };

  const handleOAuthLogin = async (provider) => {
    if (provider === "google") {
      setLoading("google");
      try {
        console.log("Starting Google OAuth for employee registration");
        const result = await signInWithGoogle(USER_TYPES.EMPLOYEE);
        console.log("Google OAuth result:", result);

        // Check for multi-user-type error
        if (result.error) {
          if (result.existing_user_type === "employer") {
            toast.error(
              "This account is already registered as an employer. Redirecting to employer login..."
            );
            setTimeout(() => {
              router.push("/auth/login/employer");
            }, 2000);
          } else {
            toast.error(result.error);
          }
          return;
        }

        login(result);
        toast.success("Successfully signed in with Google!");

        // Redirect to employee dashboard
        const redirectPath = getRedirectPath(
          USER_TYPES.EMPLOYEE,
          result.username
        );
        console.log("Redirecting to:", redirectPath);
        router.push(redirectPath);
      } catch (error) {
        console.error("Google authentication error:", error);
        toast.error(`Failed to sign in with Google: ${error.message}`);
      } finally {
        setLoading(null);
      }
    } else if (provider === "github") {
      // Redirect to GitHub OAuth initiate endpoint
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
        window.location.href = `${backendUrl}/api/auth/github/initiate/`;
      } catch (e) {
        console.error("Failed to start GitHub OAuth", e);
        toast.error("Unable to start GitHub authentication");
      }
    } else if (provider === "linkedin") {
      // Redirect to LinkedIn OAuth initiate endpoint
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
        window.location.href = `${backendUrl}/api/auth/linkedin/initiate/`;
      } catch (e) {
        console.error("Failed to start LinkedIn OAuth", e);
        toast.error("Unable to start LinkedIn authentication");
      }
    } else {
      toast(`${provider} authentication not configured!`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow relative overflow-hidden">
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
            <source src="/videos/employee-registration.mp4" type="video/mp4" />
            <source
              src="/videos/employee-registration.webm"
              type="video/webm"
            />
            Your browser does not support the video tag.
          </video>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Koluvu Text in Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/10 select-none tracking-wider">
            KOLUVU
          </h1>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col min-h-[calc(100vh-130px)]">
          {/* Mobile Header - Appears at top on small screens */}
          <div className="lg:hidden text-center mb-4 bg-gray-900/80 p-4 rounded-lg border border-gray-700 backdrop-blur-sm">
            <h1 className="font-bold mb-2 text-white">
              <span className="text-2xl">Welcome to</span>&nbsp;
              <span className="text-2xl text-blue-400">KOLUVU</span>
            </h1>

            <p className="text-gray-200 text-sm mb-4">
              Your career journey starts here
            </p>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/40 rounded-full p-1.5 mt-0.5">
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
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm text-white">
                    Verified Employers
                  </h3>
                  <p className="text-gray-300 text-xs">
                    Connect with thousands of verified companies
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/40 rounded-full p-1.5 mt-0.5">
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
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm text-white">
                    Career Growth
                  </h3>
                  <p className="text-gray-300 text-xs">
                    Access professional development opportunities
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/40 rounded-full p-1.5 mt-0.5">
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
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm text-white">
                    Personalized Matching
                  </h3>
                  <p className="text-gray-300 text-xs">
                    Get matched with opportunities that fit your skills
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between flex-grow">
            {/* Left Content - Positioned near left edge on desktop */}
            <div className="hidden lg:flex lg:w-1/2 pl-4 xl:pl-12 2xl:pl-20 text-white mb-8 lg:mb-0 text-left">
              <div className="max-w-md">
                <h1 className="font-bold mb-2 text-white">
                  <span className="text-2xl">Welcome to</span>&nbsp;
                  <span className="text-2xl text-blue-400">KOLUVU</span>
                </h1>

                <p className="text-lg mb-6 text-white/90">
                  Your career journey starts here. Join thousands of
                  professionals building their futures.
                </p>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500/30 rounded-full p-2 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Verified Employers</h3>
                      <p className="text-white/80 text-sm">
                        Connect with thousands of verified companies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500/30 rounded-full p-2 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Career Growth</h3>
                      <p className="text-white/80 text-sm">
                        Access opportunities for professional development
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-500/30 rounded-full p-2 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Personalized Matching</h3>
                      <p className="text-white/80 text-sm">
                        Get matched with opportunities that fit your skills
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form - Responsive sizing for all screen sizes */}
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm xl:max-w-md p-4 sm:p-5 md:p-6 bg-gray-900/40 backdrop-blur-lg rounded-xl shadow-lg border border-gray-700 relative lg:mr-4 xl:mr-12 2xl:mr-20 mt-0">
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl md:text-2xl font-bold text-white">
                  Employee Registration
                </h2>
                <p className="text-gray-300 text-sm sm:text-base mt-1">
                  Create your professional profile
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:gap-3 mb-4">
                <div className="flex justify-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handleOAuthLogin("google")}
                    disabled={loading === "google"}
                    className="flex-1 border border-gray-600 bg-gray-800/40 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-gray-700/50 transition-colors text-white disabled:opacity-50"
                  >
                    {loading === "google" ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FcGoogle className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleOAuthLogin("github")}
                    className="flex-1 border border-gray-600 bg-gray-800/40 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-gray-700/50 transition-colors text-white"
                    suppressHydrationWarning
                  >
                    <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => handleOAuthLogin("linkedin")}
                    className="flex-1 border border-gray-600 bg-gray-800/40 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-gray-700/50 transition-colors text-white"
                    suppressHydrationWarning
                  >
                    <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5 text-[#0A66C2]" />
                  </button>
                </div>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">
                    Or register manually
                  </span>
                </div>
              </div>

              <form action={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Hidden inputs for CAPTCHA verification */}
                <input
                  type="hidden"
                  name="captcha"
                  value={captchaValue || ""}
                />
                <input
                  type="hidden"
                  name="captchaKey"
                  value={captchaKey || ""}
                />

                <div>
                  <input
                    name="username"
                    placeholder="Username *"
                    className="w-full text-sm sm:text-base font-medium border border-gray-700 bg-gray-800/40 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                    required
                    suppressHydrationWarning
                  />
                </div>

                <div>
                  <input
                    name="fullName"
                    placeholder="Full Name *"
                    className="w-full text-sm sm:text-base font-medium border border-gray-700 bg-gray-800/40 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                    required
                    suppressHydrationWarning
                  />
                </div>

                {/* Email Verification Field */}
                <div>
                  <VerificationForm
                    fieldName="email"
                    fieldLabel="Email Verification"
                    placeholder="Enter Email *"
                    verificationType="email"
                    captchaVerified={true}
                    inputStyle="w-full text-sm sm:text-base font-medium border border-gray-700 bg-gray-800/40 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                    btnStyle="text-sm sm:text-base font-medium border border-gray-700 bg-gray-800/40 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-gray-700/50 text-white"
                  />
                </div>

                {/* Mobile number field is now optional 
                <div>
                  <VerificationForm
                    fieldName="mobileNumber"
                    fieldLabel="Mobile Number"
                    placeholder="Enter Mobile Number (Optional)"
                    verificationType="mobile"
                    inputStyle="w-full text-sm sm:text-base font-medium border border-gray-700 bg-gray-800/40 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                    btnStyle="text-sm sm:text-base font-medium border border-gray-700 bg-gray-800/40 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-gray-700/50 text-white"
                  />
                </div>
                */}

                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password *"
                      className="w-full text-sm sm:text-base font-medium border border-gray-700 bg-gray-800/40 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password *"
                      className="w-full text-sm sm:text-base font-medium border border-gray-700 bg-gray-800/40 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <FaEye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <CaptchaVerification
                    onCaptchaChange={handleCaptchaChange}
                    captchaValue={captchaValue}
                    deviceType="desktop"
                    required={true}
                    style={{
                      marginBottom: "0.75rem",
                    }}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-4 py-2.5 sm:py-3 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
                    disabled={captchaValue && captchaKey ? false : true}
                  >
                    Register Now
                  </button>
                </div>
              </form>

              <p className="text-sm sm:text-base text-center mt-4 text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/auth/login/employee"
                  className="text-blue-400 hover:underline font-medium"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}
