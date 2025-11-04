"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { handleGitHubCallback } from "@/utils/auth/githubAuth";

export default function GitHubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          throw new Error(`GitHub OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error("No authorization code received from GitHub");
        }

        console.log("Processing GitHub callback...");

        // Handle the GitHub callback
        const result = await handleGitHubCallback();

        console.log("GitHub authentication result:", result);

        // Check for errors first (multi-user-type registration)
        if (result.error) {
          if (result.existing_user_type === 'employee') {
            setError("This account is already registered as an employee. Redirecting to employee login...");
            setTimeout(() => {
              router.push("/auth/login/employee");
            }, 3000);
          } else if (result.existing_user_type === 'employer') {
            setError("This account is already registered as an employer. Redirecting to employer login...");
            setTimeout(() => {
              router.push("/auth/login/employer");
            }, 3000);
          } else {
            throw new Error(result.error);
          }
          setProcessing(false);
          return;
        }

        if (result.access_token) {
          // Store authentication data
          localStorage.setItem("access_token", result.access_token);
          localStorage.setItem("refresh_token", result.refresh_token);
          localStorage.setItem("user_type", result.user_type);
          localStorage.setItem("user", JSON.stringify(result.user));

          // Redirect based on user type
          if (result.user_type === "employer") {
            console.log("Redirecting to employer dashboard...");
            router.push("/dashboard/employer");
          } else if (result.user_type === "employee") {
            console.log("Redirecting to employee dashboard...");
            router.push("/dashboard/employee");
          } else {
            console.log("Unknown user type, redirecting to home...");
            router.push("/");
          }
        } else {
          throw new Error("Authentication failed: No access token received");
        }
      } catch (error) {
        console.error("GitHub callback error:", error);
        setError(error.message);
        setProcessing(false);

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    };

    processCallback();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="bg-gray-800/50 backdrop-blur-lg border border-red-500/50 rounded-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Authentication Failed
            </h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <p className="text-gray-400 text-sm">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="bg-gray-800/50 backdrop-blur-lg border border-purple-500/50 rounded-xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="animate-spin text-purple-500 text-5xl mb-4">⚙️</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {processing ? "Completing GitHub Authentication..." : "Success!"}
          </h2>
          <p className="text-gray-300 mb-6">
            {processing
              ? "Please wait while we set up your account..."
              : "Redirecting to your dashboard..."}
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
