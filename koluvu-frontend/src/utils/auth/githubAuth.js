// GitHub OAuth Authentication Utility

const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

export const initiateGitHubOAuth = async (userType = "employee") => {
  try {
    console.log("Starting GitHub OAuth flow for userType:", userType);
    console.log("GitHub Client ID check:", GITHUB_CLIENT_ID);

    if (!GITHUB_CLIENT_ID) {
      throw new Error(
        "GitHub Client ID is missing. Please check your environment variables."
      );
    }

    // Call backend to get GitHub OAuth URL with state parameter
    // Temporarily bypassing Next.js proxy to test direct connection
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/api/auth/github/initiate/?user_type=${userType}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to initiate GitHub OAuth");
    }

    const data = await response.json();
    console.log("GitHub OAuth URL received:", data.auth_url);

    // Store state in localStorage for verification during callback
    if (data.state) {
      localStorage.setItem("github_oauth_state", data.state);
      localStorage.setItem("github_oauth_user_type", userType);
    }

    // Redirect to GitHub OAuth page
    window.location.href = data.auth_url;
  } catch (error) {
    console.error("GitHub OAuth initiation error:", error);
    throw error;
  }
};

export const handleGitHubCallback = async () => {
  try {
    // Get code and state from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (!code) {
      throw new Error("No authorization code received from GitHub");
    }

    // Verify state from localStorage
    const storedState = localStorage.getItem("github_oauth_state");
    const storedUserType = localStorage.getItem("github_oauth_user_type") || "employee";

    if (storedState && state !== storedState) {
      throw new Error("State mismatch - possible CSRF attack");
    }

    console.log("Processing GitHub callback with code:", code?.substring(0, 10) + "...");

    // Send code to backend with user_type
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'}/api/auth/github/callback/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        code: code,
        state: state,
        user_type: storedUserType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "GitHub authentication failed" }));
      
      // Clean up localStorage
      localStorage.removeItem("github_oauth_state");
      localStorage.removeItem("github_oauth_user_type");
      
      // Return error data with existing_user_type if available
      return {
        error: errorData.error || "GitHub authentication failed",
        existing_user_type: errorData.existing_user_type
      };
    }

    const data = await response.json();
    console.log("GitHub authentication successful:", data);
    console.log("User type returned:", data.user_type);

    // Clean up localStorage
    localStorage.removeItem("github_oauth_state");
    localStorage.removeItem("github_oauth_user_type");

    return data;
  } catch (error) {
    console.error("GitHub callback error:", error);
    // Clean up localStorage on error too
    localStorage.removeItem("github_oauth_state");
    localStorage.removeItem("github_oauth_user_type");
    throw error;
  }
};
