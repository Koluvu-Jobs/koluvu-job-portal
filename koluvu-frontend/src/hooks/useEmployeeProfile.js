// src/hooks/useEmployeeProfile.js
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useEmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, accessToken } = useAuth();

  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      if (!user || !accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employee/profile/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else if (response.status === 404) {
          // Profile doesn't exist yet, this is normal for new users
          setProfile(null);
        } else {
          throw new Error("Failed to fetch employee profile");
        }
      } catch (err) {
        console.error("Error fetching employee profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeProfile();
  }, [user, accessToken]);

  const updateProfile = async (profileData) => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employee/profile/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        return updatedProfile;
      } else {
        throw new Error("Failed to update employee profile");
      }
    } catch (err) {
      console.error("Error updating employee profile:", err);
      setError(err.message);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: () => {
      if (user && accessToken) {
        setLoading(true);
        fetchEmployeeProfile();
      }
    },
  };
};
