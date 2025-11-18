// Client-side authentication guard hook
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Client-side authentication guard for login/register pages
 * Prevents authenticated users from accessing these pages
 * @param {string} pageType - Type of page ('employee-login', 'employer-login', etc.)
 * @param {Object} options - Configuration options
 * @returns {Object} - Guard status and utilities
 */
export const useAuthGuard = (pageType, options = {}) => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    enableRedirect = true,
    showError = true,
    customRedirectUrl = null,
    onRedirect = null,
    onError = null,
  } = options;

  useEffect(() => {
    // Don't check while auth is still loading
    if (loading) return;

    // If user is authenticated, determine if they should be redirected
    if (isAuthenticated && user) {
      const result = checkAccessPermission(pageType, user);

      if (!result.allowed) {
        setShouldRedirect(true);
        setRedirectUrl(result.redirectUrl);
        setErrorMessage(result.errorMessage);

        if (showError && result.errorMessage) {
          console.warn(`🚫 Access denied: ${result.errorMessage}`);
          if (onError) onError(result.errorMessage);
        }

        if (enableRedirect && result.redirectUrl) {
          console.log(`🔄 Redirecting to: ${result.redirectUrl}`);
          if (onRedirect) onRedirect(result.redirectUrl);

          // Add slight delay to prevent flash
          setTimeout(() => {
            router.replace(result.redirectUrl);
          }, 100);
        }
      }
    }
  }, [
    isAuthenticated,
    user,
    loading,
    pageType,
    router,
    enableRedirect,
    showError,
    onRedirect,
    onError,
  ]);

  // Check additional browser storage for authentication
  useEffect(() => {
    if (loading || isAuthenticated) return;

    const checkBrowserAuth = () => {
      try {
        // Check localStorage
        const localUser = localStorage.getItem("user");
        const localToken =
          localStorage.getItem("access_token") || localStorage.getItem("token");

        // Check sessionStorage
        const sessionUser = sessionStorage.getItem("user");
        const sessionToken =
          sessionStorage.getItem("access_token") ||
          sessionStorage.getItem("token");

        if (localUser && localToken) {
          const userData = JSON.parse(localUser);
          const result = checkAccessPermission(pageType, userData);

          if (!result.allowed) {
            console.log("🔄 Browser storage auth detected, redirecting...");
            if (enableRedirect && result.redirectUrl) {
              router.replace(result.redirectUrl);
            }
          }
        }

        if (sessionUser && sessionToken) {
          const userData = JSON.parse(sessionUser);
          const result = checkAccessPermission(pageType, userData);

          if (!result.allowed) {
            console.log("🔄 Session storage auth detected, redirecting...");
            if (enableRedirect && result.redirectUrl) {
              router.replace(result.redirectUrl);
            }
          }
        }
      } catch (error) {
        console.error("Browser auth check error:", error);
      }
    };

    checkBrowserAuth();
  }, [loading, isAuthenticated, pageType, router, enableRedirect]);

  return {
    shouldRedirect,
    redirectUrl,
    errorMessage,
    isLoading: loading,
    isAllowed: !shouldRedirect && !loading,
  };
};

/**
 * Check if user has permission to access a specific page type
 * @param {string} pageType - Type of page being accessed
 * @param {Object} user - User object with type and other info
 * @returns {Object} - Permission result with redirect info
 */
function checkAccessPermission(pageType, user) {
  const userType = user.user_type || user.userType || user.type;
  const username = user.username;

  // Define page type mappings
  const pageTypeMap = {
    "employee-login": "employee",
    "employee-register": "employee",
    "employer-login": "employer",
    "employer-register": "employer",
    "partner-login": "partner",
    "partner-register": "partner",
    "admin-login": "admin",
  };

  // Define dashboard URLs
  const dashboardUrls = {
    employee: username
      ? `/dashboard/employee/${username}`
      : "/dashboard/employee",
    employer: "/dashboard/employer",
    partner: "/dashboard/partner",
    admin: "/dashboard/admin",
  };

  const targetUserType = pageTypeMap[pageType];

  if (!targetUserType) {
    return {
      allowed: true,
      redirectUrl: null,
      errorMessage: "",
    };
  }

  // If user is trying to access their own role's login/register page
  if (targetUserType === userType) {
    return {
      allowed: false,
      redirectUrl: dashboardUrls[userType] || "/dashboard",
      errorMessage: `You are already logged in as ${userType}. Redirecting to dashboard.`,
    };
  }

  // If user is trying to access different role's login/register page
  if (targetUserType !== userType) {
    const redirectUrl = new URL(
      dashboardUrls[userType] || "/dashboard",
      window.location.origin
    );
    redirectUrl.searchParams.set("error", "unauthorized_role_access");
    redirectUrl.searchParams.set(
      "message",
      `You cannot access ${targetUserType} pages while logged in as ${userType}`
    );

    return {
      allowed: false,
      redirectUrl: redirectUrl.toString(),
      errorMessage: `Access denied: You are logged in as ${userType} and cannot access ${targetUserType} authentication pages.`,
    };
  }

  return {
    allowed: true,
    redirectUrl: null,
    errorMessage: "",
  };
}

/**
 * Higher-order component for protecting login/register pages
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {string} pageType - Type of page ('employee-login', etc.)
 * @param {Object} guardOptions - Guard configuration options
 * @returns {React.Component} - Protected component
 */
export const withAuthGuard = (
  WrappedComponent,
  pageType,
  guardOptions = {}
) => {
  return function AuthGuardedComponent(props) {
    const { isAllowed, isLoading, errorMessage } = useAuthGuard(
      pageType,
      guardOptions
    );

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-white">Checking authentication...</p>
          </div>
        </div>
      );
    }

    // Show error message if access denied (optional - usually just redirects)
    if (!isAllowed && errorMessage && guardOptions.showErrorPage) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-red-900/20 rounded-lg border border-red-500">
            <div className="text-red-400 text-xl mb-4">Access Denied</div>
            <p className="text-red-300">{errorMessage}</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    // Render the component if allowed
    if (isAllowed) {
      return <WrappedComponent {...props} />;
    }

    // Default: show loading (redirect in progress)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Redirecting...</p>
        </div>
      </div>
    );
  };
};

/**
 * API endpoint checker for real-time authentication validation
 * @returns {Object} - Authentication status from server
 */
export const checkServerAuthStatus = async () => {
  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        isAuthenticated: true,
        user: data.user,
        source: "server",
      };
    } else {
      return {
        isAuthenticated: false,
        user: null,
        source: "server",
        error: response.statusText,
      };
    }
  } catch (error) {
    console.error("Server auth check failed:", error);
    return {
      isAuthenticated: false,
      user: null,
      source: "server",
      error: error.message,
    };
  }
};

export default useAuthGuard;
