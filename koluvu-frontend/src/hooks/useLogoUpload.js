// src/hooks/useLogoUpload.js

"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useLogoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const { user, accessToken } = useAuth();

  // Base API URL - replace with your actual backend URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Upload logo to backend
  const uploadLogo = useCallback(
    async (file) => {
      if (!user || !accessToken) {
        throw new Error("User not authenticated");
      }

      setIsUploading(true);
      setUploadError(null);

      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("logo", file);

        const response = await fetch(
          `${API_BASE_URL}/api/employer/profile/upload-logo/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              // Don't set Content-Type for FormData, let browser set it
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        return {
          success: true,
          logoUrl: data.logo_url || data.profile_picture_url,
          message: data.message || "Logo uploaded successfully",
        };
      } catch (err) {
        console.error("Error uploading logo:", err);
        setUploadError(err.message);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [user, accessToken, API_BASE_URL]
  );

  // Delete logo from backend
  const deleteLogo = useCallback(async () => {
    if (!user || !accessToken) {
      throw new Error("User not authenticated");
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/employer/profile/delete-logo/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message || "Logo deleted successfully",
      };
    } catch (err) {
      console.error("Error deleting logo:", err);
      setUploadError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [user, accessToken, API_BASE_URL]);

  // Update profile with new logo URL
  const updateProfileLogo = useCallback(
    async (logoUrl) => {
      if (!user || !accessToken) {
        throw new Error("User not authenticated");
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/employer/profile/update/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              profile_picture_url: logoUrl,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        return data;
      } catch (err) {
        console.error("Error updating profile logo:", err);
        throw err;
      }
    },
    [user, accessToken, API_BASE_URL]
  );

  // Validate image file
  const validateImageFile = useCallback((file, maxSize = 5 * 1024 * 1024) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Please upload a valid image file (JPEG, PNG, or WebP)",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size must be less than ${Math.round(
          maxSize / (1024 * 1024)
        )}MB`,
      };
    }

    return { isValid: true };
  }, []);

  // Generate image preview
  const generatePreview = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  // Compress image if needed
  const compressImage = useCallback(
    (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
      return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
          // Calculate new dimensions
          let { width, height } = img;
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(resolve, file.type, quality);
        };

        img.src = URL.createObjectURL(file);
      });
    },
    []
  );

  return {
    uploadLogo,
    deleteLogo,
    updateProfileLogo,
    validateImageFile,
    generatePreview,
    compressImage,
    isUploading,
    uploadError,
    setUploadError,
  };
};
