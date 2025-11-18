"use client";

import { useState, useCallback } from "react";

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((options) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      title: options.title || "",
      description: options.description || "",
      variant: options.variant || "default",
      ...options,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);

    return newToast;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
};

export { useToast };
