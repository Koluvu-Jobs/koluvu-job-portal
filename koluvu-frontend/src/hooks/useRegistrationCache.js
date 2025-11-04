// src/hooks/useRegistrationCache.js
"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

/**
 * Custom hook for managing registration cache
 * Provides automatic save/load functionality for multi-step registration
 */
export function useRegistrationCache(userType = "employee") {
  const [sessionId, setSessionId] = useState(null);
  const [cachedData, setCachedData] = useState({});
  const [currentStep, setCurrentStep] = useState("initial");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load session ID from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSessionId = localStorage.getItem(
        `registration_session_${userType}`
      );
      if (storedSessionId) {
        setSessionId(storedSessionId);
        // Try to load cached data
        loadCachedData(null, storedSessionId);
      }
    }
  }, [userType]);

  /**
   * Load cached registration data from server
   */
  const loadCachedData = useCallback(
    async (email = null, session = null) => {
      setIsLoading(true);
      setError(null);

      try {
        const sid = session || sessionId;
        if (!email && !sid) {
          setIsLoading(false);
          return null;
        }

        const result = await api.getRegistrationCache(email, sid);

        if (result.success && result.data) {
          setCachedData(result.data);
          setCurrentStep(result.current_step || "initial");
          setSessionId(result.session_id);

          // Store session ID in localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem(
              `registration_session_${userType}`,
              result.session_id
            );
          }

          return result.data;
        }

        return null;
      } catch (err) {
        console.error("Error loading cached data:", err);
        setError(err.message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, userType]
  );

  /**
   * Save registration data to server cache
   */
  const saveToCache = useCallback(
    async (email, data, step = "initial") => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await api.saveRegistrationCache(
          email,
          sessionId,
          data,
          step
        );

        if (result.success) {
          setCachedData((prev) => ({ ...prev, ...data }));
          setCurrentStep(step);
          setSessionId(result.session_id);

          // Store session ID in localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem(
              `registration_session_${userType}`,
              result.session_id
            );
          }

          return result;
        }

        throw new Error(result.error || "Failed to save cache");
      } catch (err) {
        console.error("Error saving to cache:", err);
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, userType]
  );

  /**
   * Clear registration cache from server and localStorage
   */
  const clearCache = useCallback(
    async (email = null) => {
      setIsLoading(true);
      setError(null);

      try {
        await api.clearRegistrationCache(email, sessionId);

        // Clear local state
        setCachedData({});
        setCurrentStep("initial");
        setSessionId(null);

        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem(`registration_session_${userType}`);
        }

        return true;
      } catch (err) {
        console.error("Error clearing cache:", err);
        setError(err.message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, userType]
  );

  /**
   * Update cached data locally (without saving to server yet)
   */
  const updateLocalCache = useCallback((newData) => {
    setCachedData((prev) => ({ ...prev, ...newData }));
  }, []);

  /**
   * Get a specific field from cached data
   */
  const getCachedField = useCallback(
    (fieldName, defaultValue = "") => {
      return cachedData[fieldName] ?? defaultValue;
    },
    [cachedData]
  );

  return {
    // State
    sessionId,
    cachedData,
    currentStep,
    isLoading,
    error,

    // Methods
    loadCachedData,
    saveToCache,
    clearCache,
    updateLocalCache,
    getCachedField,
  };
}

export default useRegistrationCache;
