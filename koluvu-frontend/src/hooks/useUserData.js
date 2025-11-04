// src/hooks/useUserData.js
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching user data...");
      const response = await fetch("/api/employee/dashboard");

      console.log("📥 User data response status:", response.status);
      const text = await response.text();
      console.log("📥 User data response text:", text);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse user data response as JSON:", e);
        throw new Error("Invalid response from server");
      }

      if (!response.ok) {
        throw new Error(
          data?.error || `Failed to fetch user data: ${response.status}`
        );
      }

      // Ensure user data is properly populated from email login
      if (data?.user && user?.email) {
        data.user = {
          ...data.user,
          email: user.email,
          first_name: data.user.first_name || user.first_name || "",
          last_name: data.user.last_name || user.last_name || "",
          google_profile_picture:
            data.user.google_profile_picture ||
            user.google_profile_picture ||
            null,
        };
      }

      console.log("✅ User data received:", data);
      setUserData(data);
      return data;
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);

      // Fallback to AuthContext user data if available
      if (user) {
        const fallbackData = {
          user: {
            first_name: user.first_name || "User",
            last_name: user.last_name || "",
            email: user.email || "",
            google_profile_picture: user.google_profile_picture || null,
            current_designation: "Software Professional",
            location: "",
            phone_number: "",
            bio: "",
            linkedin_url: "",
          },
          profile_completion: 20,
          stats: {
            applications: 0,
            interviews: 0,
            profile_views: 0,
          },
          onboarding_complete: false,
        };
        setUserData(fallbackData);
        return fallbackData;
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (updatedData) => {
    try {
      const response = await fetch("/api/employee/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const newData = await response.json();
      setUserData((prev) => ({
        ...prev,
        user: { ...prev.user, ...newData },
      }));

      return newData;
    } catch (err) {
      console.error("Error updating user data:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return {
    userData,
    loading,
    error,
    refetch: fetchUserData,
    updateUser: updateUserData,
  };
};
