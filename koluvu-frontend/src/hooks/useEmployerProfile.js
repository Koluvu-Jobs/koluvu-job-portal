// src/hooks/useEmployerProfile.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const useEmployerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, accessToken, isEmployer } = useAuth();

  const fetchProfile = async () => {
    if (!user || !accessToken || !isEmployer) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/employer/profile/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Employer profile data:", data);
        setProfile(data);
      } else if (response.status === 404) {
        // Profile doesn't exist yet, create it
        console.log("No profile found, creating new profile");
        setProfile(null);
      } else {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching employer profile:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user, accessToken, isEmployer]);

  const syncSocialMediaData = async () => {
    if (!user || !accessToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}/employer/profile/sync/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        return data;
      }
    } catch (err) {
      console.error("Error syncing social media data:", err);
    }
  };

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    syncSocialMediaData,
  };
};
