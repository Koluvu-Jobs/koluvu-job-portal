"use client";

import React, { useState } from "react";
import { FaGoogle, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { signInWithGoogle } from "@/utils/auth/googleAuth";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getRedirectPath, USER_TYPES } from "@/utils/auth";
import toast from "react-hot-toast";
import AccountTypeConflictModal from "./AccountTypeConflictModal";

const SocialAuth = ({ userType = USER_TYPES.EMPLOYEE }) => {
  const [loading, setLoading] = useState(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleGoogleAuth = async () => {
    setLoading("google");
    try {
      console.log("Starting Google authentication for userType:", userType);
      const result = await signInWithGoogle(userType);
      console.log("Google authentication result:", result);

      // Check if there's an account type conflict error
      if (result.error && result.existing_user_type) {
        console.log("Account type conflict detected:", result);
        setConflictData({
          error: result.error,
          existingUserType: result.existing_user_type,
          attemptedUserType: userType,
        });
        setShowConflictModal(true);
        toast.error("Account type mismatch detected");
        return;
      }

      // Check for other errors
      if (result.error) {
        console.error("Google authentication error:", result.error);
        toast.error(result.error);
        return;
      }

      console.log("Authentication successful, result:", result);
      console.log("User type from result:", result.user_type);

      // Call login to set auth state
      login(result);

      // Use the user_type from the backend response for redirect
      const actualUserType = result.user_type || userType;
      const redirectPath = getRedirectPath(actualUserType, result.username);

      console.log(
        "Redirecting to:",
        redirectPath,
        "for user type:",
        actualUserType
      );

      toast.success("Successfully signed in with Google!");

      // Use router.replace to avoid adding to history and wait a bit for auth state to settle
      setTimeout(() => {
        router.replace(redirectPath);
      }, 300);
    } catch (error) {
      console.error("Google authentication error:", error);
      toast.error(`Failed to sign in with Google: ${error.message}`);
    } finally {
      setLoading(null);
    }
  };

  const handleGitHubAuth = () => {
    // Initiate GitHub OAuth by redirecting to backend initiate endpoint
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      window.location.href = `${backendUrl}/api/auth/github/initiate/`;
    } catch (e) {
      console.error("Failed to start GitHub OAuth", e);
      toast.error("Unable to start GitHub authentication");
    }
  };

  const handleLinkedInAuth = () => {
    // Initiate LinkedIn OAuth by redirecting to backend initiate endpoint
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
      window.location.href = `${backendUrl}/api/auth/linkedin/initiate/`;
    } catch (e) {
      console.error("Failed to start LinkedIn OAuth", e);
      toast.error("Unable to start LinkedIn authentication");
    }
  };

  const socialButtons = [
    {
      name: "Google",
      icon: FaGoogle,
      color: "#db4437",
      handler: handleGoogleAuth,
      loadingKey: "google",
    },
    {
      name: "GitHub",
      icon: FaGithub,
      color: "#333",
      handler: handleGitHubAuth,
      loadingKey: "github",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      color: "#0077b5",
      handler: handleLinkedInAuth,
      loadingKey: "linkedin",
    },
  ];

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      width: "100%",
    },
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      padding: "12px 16px",
      border: "1px solid #e1e5e9",
      borderRadius: "8px",
      backgroundColor: "#fff",
      color: "#333",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      width: "100%",
      minHeight: "44px",
    },
    buttonHover: {
      backgroundColor: "#f8f9fa",
      borderColor: "#d0d7de",
    },
    buttonLoading: {
      cursor: "not-allowed",
      opacity: 0.7,
    },
    icon: {
      fontSize: "18px",
    },
    loadingSpinner: {
      width: "18px",
      height: "18px",
      border: "2px solid #f3f3f3",
      borderTop: "2px solid #333",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
  };

  return (
    <>
      <div style={styles.container}>
        {socialButtons.map((button) => {
          const Icon = button.icon;
          const isLoading = loading === button.loadingKey;

          return (
            <button
              key={button.name}
              onClick={button.handler}
              disabled={loading !== null}
              style={{
                ...styles.button,
                ...(loading !== null ? styles.buttonLoading : {}),
              }}
              onMouseEnter={(e) => {
                if (loading === null) {
                  Object.assign(e.target.style, styles.buttonHover);
                }
              }}
              onMouseLeave={(e) => {
                if (loading === null) {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.borderColor = "#e1e5e9";
                }
              }}
            >
              {isLoading ? (
                <div style={styles.loadingSpinner} />
              ) : (
                <Icon style={{ ...styles.icon, color: button.color }} />
              )}
              {isLoading ? "Signing in..." : `Continue with ${button.name}`}
            </button>
          );
        })}

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

      {/* Account Type Conflict Modal */}
      <AccountTypeConflictModal
        isOpen={showConflictModal}
        onClose={() => {
          setShowConflictModal(false);
          setConflictData(null);
        }}
        errorMessage={conflictData?.error}
        existingUserType={conflictData?.existingUserType}
        attemptedUserType={conflictData?.attemptedUserType}
      />
    </>
  );
};

export default SocialAuth;
