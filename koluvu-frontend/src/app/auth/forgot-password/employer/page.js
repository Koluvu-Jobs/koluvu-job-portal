"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaEnvelope, FaKey, FaSpinner } from "react-icons/fa";
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";
import toast, { Toaster } from "react-hot-toast";

export default function EmployerForgotPasswordPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/forgot-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Password reset code sent to your email!");
        // Redirect to reset password page with email
        router.push(
          `/auth/reset-password/employer?email=${encodeURIComponent(email)}`
        );
      } else {
        if (data.social_only) {
          toast.error(
            "This account uses social login. Please sign in with your social account and set a password in settings."
          );
        } else {
          toast.error(data.error || "Failed to send password reset email");
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          >
            <source src="/videos/employer-login.mp4" type="video/mp4" />
            <source src="/videos/employer-login.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-md mx-4">
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-700/50">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                <FaKey className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Forgot Password
              </h1>
              <p className="text-gray-300 text-sm">
                Enter your email address and we'll send you a verification code
                to reset your password
              </p>
            </div>

            <div className="mb-6 p-4 bg-blue-900/30 border border-blue-700/30 rounded-lg text-center">
              <p className="text-blue-300 text-sm flex items-center justify-center">
                <FaEnvelope className="mr-2" />
                We'll send a 6-digit verification code to your registered email
                address
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/70 text-white placeholder-gray-400"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <FaEnvelope />
                    Send Reset Code
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login/employer"
                className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <FaArrowLeft />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Toaster position="top-right" />
    </>
  );
}
