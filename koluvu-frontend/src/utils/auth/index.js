// Authentication utility functions and constants

export const AUTH_ROUTES = {
  LOGIN_EMPLOYEE: "/auth/login/employee",
  LOGIN_EMPLOYER: "/auth/login/employer",
  LOGIN_PARTNER: "/auth/login/partner",
  REGISTER_EMPLOYEE: "/auth/register/employee",
  REGISTER_EMPLOYER: "/auth/register/employer",
  REGISTER_PARTNER: "/auth/register/partner",
  LOGOUT: "/auth/logout",
};

export const DASHBOARD_ROUTES = {
  EMPLOYEE: "/dashboard/employee",
  EMPLOYER: "/dashboard/employer",
  PARTNER: "/dashboard/partner",
};

export const API_ENDPOINTS = {
  GOOGLE_AUTH: "/api/auth/google",
  VERIFY_TOKEN: "/api/auth/verify-token",
  REFRESH_TOKEN: "/api/auth/refresh-token",
  LOGOUT: "/api/auth/logout/",
};

export const USER_TYPES = {
  EMPLOYEE: "employee",
  EMPLOYER: "employer",
  PARTNER: "partner",
};

export const STORAGE_KEYS = {
  USER: "user",
  USER_TYPE: "userType",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
};

// Utility functions for token management
export const getStoredAuth = () => {
  if (typeof window === "undefined") return null;

  try {
    const userString = localStorage.getItem(STORAGE_KEYS.USER);
    const userType = localStorage.getItem(STORAGE_KEYS.USER_TYPE);
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    // Check if we have the essential data
    if (!userString || !userType || !accessToken) {
      return null;
    }

    // Handle undefined or empty user string
    let user = null;
    if (userString && userString !== "undefined" && userString !== "null") {
      user = JSON.parse(userString);
    }

    return {
      user,
      userType,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error("Error reading stored auth:", error);
    // Clear corrupted data
    clearStoredAuth();
    return null;
  }
};

export const setStoredAuth = (authData) => {
  if (typeof window === "undefined") return;

  const { user, userType, accessToken, refreshToken } = authData;

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.USER_TYPE, userType);
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

export const clearStoredAuth = () => {
  if (typeof window === "undefined") return;

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    // Clear any additional auth-related items
    const authRelatedKeys = [
      "sb-auth-token",
      "google-auth-user",
      "auth-session",
    ];
    authRelatedKeys.forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing stored auth:", error);
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

export const getRedirectPath = (userType, username = null) => {
  switch (userType) {
    case USER_TYPES.EMPLOYEE:
      return username
        ? `/dashboard/employee/${username}`
        : DASHBOARD_ROUTES.EMPLOYEE;
    case USER_TYPES.EMPLOYER:
      return username
        ? `/dashboard/employer/${username}`
        : DASHBOARD_ROUTES.EMPLOYER;
    case USER_TYPES.PARTNER:
      return username
        ? `/dashboard/partner/${username}`
        : DASHBOARD_ROUTES.PARTNER;
    default:
      return username
        ? `/dashboard/employee/${username}`
        : DASHBOARD_ROUTES.EMPLOYEE;
  }
};
