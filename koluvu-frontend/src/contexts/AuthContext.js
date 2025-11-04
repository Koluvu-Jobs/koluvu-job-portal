"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { signOutFromGoogle } from "@/utils/auth/googleAuth";
import {
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  isTokenExpired,
  API_ENDPOINTS,
} from "@/utils/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedAuth = getStoredAuth();

        if (storedAuth?.user && storedAuth?.accessToken) {
          console.log("Loading stored auth data:", storedAuth);
          setUser(storedAuth.user);
          setUserType(storedAuth.userType);
          setAccessToken(storedAuth.accessToken);
          setRefreshToken(storedAuth.refreshToken);

          // Skip token verification for fresh logins (tokens less than 1 minute old)
          const tokenPayload = JSON.parse(
            atob(storedAuth.accessToken.split(".")[1])
          );
          const tokenAge = Date.now() / 1000 - tokenPayload.iat; // Token age in seconds

          if (!isTokenExpired(storedAuth.accessToken)) {
            // Only verify token if it's older than 1 minute (not a fresh login)
            if (tokenAge > 60) {
              console.log("Token is older than 1 minute, verifying...");
              verifyToken(storedAuth.accessToken);
            } else {
              console.log("Fresh token detected, skipping verification");
            }
          } else {
            console.log("Token is expired, clearing auth data");
            clearAuthData();
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const verifyToken = async (token) => {
    try {
      console.log("Verifying token...");
      const response = await fetch(API_ENDPOINTS.VERIFY_TOKEN, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log("Token verification failed with status:", response.status);
        throw new Error("Token verification failed");
      }

      const data = await response.json();
      console.log("Token verification successful:", data);
      setUser(data.user);
      setUserType(data.user_type);
    } catch (error) {
      console.error("Token verification failed:", error);

      // Try to refresh token before logging out
      if (!isLoggingOut && refreshToken) {
        try {
          console.log("Attempting to refresh token...");
          const newToken = await refreshAccessToken();
          if (newToken) {
            console.log("Token refreshed successfully");
            return; // Don't clear auth data if refresh was successful
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }

      // Only clear auth data if refresh failed or not available
      if (!isLoggingOut) {
        console.log("Clearing auth data due to failed verification");
        clearAuthData();
      }
    }
  };

  const login = (userData) => {
    console.log("Login function called with data:", userData);
    const { user, access_token, refresh_token, user_type } = userData;

    // Validate required data
    if (!user || !access_token || !user_type) {
      console.error("Invalid login data:", {
        user: !!user,
        access_token: !!access_token,
        user_type,
      });
      throw new Error("Invalid login data provided");
    }

    console.log("Setting auth state:", {
      user: user,
      userType: user_type,
      hasEmployerProfile: !!user.employer_profile,
      hasEmployeeProfile: !!user.employee_profile,
    });

    setUser(user);
    setUserType(user_type);
    setAccessToken(access_token);
    setRefreshToken(refresh_token);

    // Store in localStorage using utility function
    setStoredAuth({
      user,
      userType: user_type,
      accessToken: access_token,
      refreshToken: refresh_token,
    });

    // Also set cookie for middleware detection
    if (typeof window !== "undefined") {
      document.cookie = `accessToken=${access_token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `userType=${user_type}; path=/; max-age=86400; SameSite=Lax`;
    }

    console.log(
      "Login state updated successfully - user:",
      user?.email,
      "userType:",
      user_type
    );

    // Force re-render by updating a timestamp (this helps with React state sync issues)
    setTimeout(() => {
      console.log("Auth state after login:", {
        isAuthenticated: !!user && !!access_token,
        userType: user_type,
        hasEmployerProfile: !!user.employer_profile,
      });
    }, 50);
  };

  const logout = async (redirectTo = "/") => {
    // Prevent multiple simultaneous logout calls
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      // Call backend logout
      if (refreshToken && accessToken) {
        try {
          await fetch(
            `${
              process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"
            }${API_ENDPOINTS.LOGOUT}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                refresh_token: refreshToken,
              }),
            }
          );
        } catch (backendError) {
          console.warn("Backend logout failed:", backendError);
          // Continue with logout even if backend fails
        }
      }

      // Sign out from Google
      try {
        await signOutFromGoogle();
      } catch (googleError) {
        console.warn("Google logout failed:", googleError);
        // Continue with logout even if Google fails
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
      setIsLoggingOut(false);

      // Force navigation to login or home page
      if (typeof window !== "undefined") {
        window.location.href = redirectTo;
      }
    }
  };

  const clearAuthData = () => {
    console.log("🧹 Clearing authentication data...");

    setUser(null);
    setUserType(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsLoggingOut(false);

    clearStoredAuth();

    // Clear ALL auth cookies (including potential stale ones)
    if (typeof window !== "undefined") {
      const authCookies = [
        "accessToken",
        "access_token",
        "refreshToken",
        "refresh_token",
        "userType",
        "user_type",
        "authToken",
        "jwt",
        "token",
      ];

      authCookies.forEach((cookieName) => {
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=localhost`;
        document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      });

      // Clear registration cache from localStorage
      const registrationCacheKeys = [
        "registration_session_employee",
        "registration_session_employer",
        "registration_session_partner",
      ];

      registrationCacheKeys.forEach((key) => {
        localStorage.removeItem(key);
      });

      console.log("✅ All auth cookies and registration cache cleared");
    }
  };

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(API_ENDPOINTS.REFRESH_TOKEN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      setAccessToken(data.access_token);

      // Update stored token
      const currentAuth = getStoredAuth();
      if (currentAuth) {
        setStoredAuth({
          ...currentAuth,
          accessToken: data.access_token,
        });
      }

      return data.access_token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthData();
      throw error;
    }
  };

  const value = {
    user,
    userType,
    loading,
    accessToken,
    refreshToken,
    login,
    logout,
    clearAuthData,
    refreshAccessToken,
    isAuthenticated: !!user && !!accessToken && !isLoggingOut,
    isEmployee: userType === "employee" && !!user,
    isEmployer: userType === "employer" && !!user,
    isPartner: userType === "partner" && !!user,
    isAdmin: userType === "admin" && !!user,
    hasValidSession: !!user && !!accessToken && !isLoggingOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
