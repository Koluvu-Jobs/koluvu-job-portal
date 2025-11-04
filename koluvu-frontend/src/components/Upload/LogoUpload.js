// src/components/Upload/LogoUpload.js

"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export const LogoUpload = ({
  currentLogo = null,
  onUpload,
  onDelete,
  isLoading = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  className = "",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [error, setError] = useState(null);
  const [cropMode, setCropMode] = useState(false);
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle file input change
  const handleFileInput = useCallback((e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  // Validate and process file
  const handleFile = useCallback(
    (file) => {
      setError(null);

      // Validate file type
      if (!acceptedFormats.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or WebP)");
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        setError(
          `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`
        );
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage({
          file,
          url: e.target.result,
          name: file.name,
          size: file.size,
        });
        setShowConfirmDialog(true);
      };
      reader.readAsDataURL(file);
    },
    [acceptedFormats, maxSize]
  );

  // Handle upload confirmation
  const handleUploadConfirm = async () => {
    if (!previewImage) return;

    setShowConfirmDialog(false);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Call the onUpload callback
      if (onUpload) {
        await onUpload(previewImage.file);
      }

      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Reset states after successful upload
      setTimeout(() => {
        setPreviewImage(null);
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
      setUploadProgress(0);
    }
  };

  // Handle upload cancellation
  const handleUploadCancel = () => {
    setShowConfirmDialog(false);
    setPreviewImage(null);
    setError(null);
  };

  // Handle logo deletion
  const handleDelete = async () => {
    if (onDelete) {
      await onDelete();
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Current Logo Display */}
      {currentLogo && !previewImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={currentLogo}
                  alt="Current logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">Current Logo</p>
                <p className="text-sm text-gray-500">Company logo image</p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      {/* Upload Area */}
      <motion.div
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="px-6 py-8 text-center">
          <motion.div
            animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <svg
              className={`mx-auto h-12 w-12 mb-4 ${
                dragActive
                  ? "text-blue-500"
                  : error
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {dragActive ? "Drop your logo here" : "Upload Company Logo"}
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            Drag and drop your logo, or{" "}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              browse files
            </button>
          </p>

          <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-white rounded-full border">JPEG</span>
            <span className="px-2 py-1 bg-white rounded-full border">PNG</span>
            <span className="px-2 py-1 bg-white rounded-full border">WebP</span>
            <span className="px-2 py-1 bg-white rounded-full border">
              Max {Math.round(maxSize / (1024 * 1024))}MB
            </span>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={acceptedFormats.join(",")}
          onChange={handleFileInput}
        />

        {/* Upload Progress Overlay */}
        <AnimatePresence>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <svg
                    className="w-16 h-16 transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${uploadProgress}, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Uploading logo...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Preview Header */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirm Logo Upload
                </h3>
                <p className="text-sm text-gray-600">
                  Please review your logo before uploading
                </p>
              </div>

              {/* Preview Image */}
              <div className="p-6">
                <div className="relative w-full h-48 mb-4 bg-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src={previewImage.url}
                    alt="Logo preview"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* File Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      File Name:
                    </span>
                    <span className="text-sm text-gray-600 truncate max-w-32">
                      {previewImage.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      File Size:
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatFileSize(previewImage.size)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-gray-50 flex space-x-3">
                <button
                  onClick={handleUploadCancel}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadConfirm}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Uploading..." : "Upload Logo"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
