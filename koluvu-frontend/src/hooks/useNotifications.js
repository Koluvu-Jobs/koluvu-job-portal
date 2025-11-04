// src/hooks/useNotifications.js

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, accessToken } = useAuth();

  // Base API URL - replace with your actual backend URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Fetch notifications from backend
  const fetchNotifications = useCallback(async () => {
    if (!user || !accessToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/employer/notifications/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(err.message);

      // Fallback to mock data for development
      const mockNotifications = [
        {
          id: 1,
          title: "New Job Application",
          message: "John Doe applied for Software Engineer position",
          notification_type: "application",
          is_read: false,
          created_at: new Date().toISOString(),
          sender: { first_name: "John", last_name: "Doe" },
        },
        {
          id: 2,
          title: "Interview Scheduled",
          message: "Interview scheduled for tomorrow at 10 AM",
          notification_type: "interview",
          is_read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          sender: { first_name: "Jane", last_name: "Smith" },
        },
        {
          id: 3,
          title: "Profile Updated",
          message: "Your company profile has been successfully updated",
          notification_type: "system",
          is_read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          sender: null,
        },
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter((n) => !n.is_read).length);
    } finally {
      setIsLoading(false);
    }
  }, [user, accessToken, API_BASE_URL]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId) => {
      if (!user || !accessToken) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/employer/notifications/${notificationId}/read/`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update local state
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );

        setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
      } catch (err) {
        console.error("Error marking notification as read:", err);

        // Fallback: update local state even if API call fails
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );

        setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
      }
    },
    [user, accessToken, API_BASE_URL]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user || !accessToken) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/employer/notifications/mark-all-read/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);

      // Fallback: update local state even if API call fails
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
      setUnreadCount(0);
    }
  }, [user, accessToken, API_BASE_URL]);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId) => {
      if (!user || !accessToken) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/employer/notifications/${notificationId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update local state
        setNotifications((prevNotifications) => {
          const updatedNotifications = prevNotifications.filter(
            (n) => n.id !== notificationId
          );
          const wasUnread = prevNotifications.find(
            (n) => n.id === notificationId && !n.is_read
          );
          if (wasUnread) {
            setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
          }
          return updatedNotifications;
        });
      } catch (err) {
        console.error("Error deleting notification:", err);
        setError(err.message);
      }
    },
    [user, accessToken, API_BASE_URL]
  );

  // Add new notification (for real-time updates)
  const addNotification = useCallback((newNotification) => {
    setNotifications((prevNotifications) => [
      newNotification,
      ...prevNotifications,
    ]);
    if (!newNotification.is_read) {
      setUnreadCount((prevCount) => prevCount + 1);
    }
  }, []);

  // Format time ago
  const getTimeAgo = useCallback((dateString) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return notificationDate.toLocaleDateString();
  }, []);

  // Initialize notifications when user logs in
  useEffect(() => {
    if (user && accessToken) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, accessToken, fetchNotifications]);

  // Set up polling for real-time updates
  useEffect(() => {
    if (!user || !accessToken) return;

    const pollInterval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, [user, accessToken, fetchNotifications]);

  // Set up WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user || !accessToken) return;

    // WebSocket connection (implement when backend supports it)
    // const wsUrl = `${API_BASE_URL.replace('http', 'ws')}/ws/notifications/`;
    // const socket = new WebSocket(`${wsUrl}?token=${accessToken}`);

    // socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'notification') {
    //     addNotification(data.notification);
    //   }
    // };

    // socket.onerror = (error) => {
    //   console.error('WebSocket error:', error);
    // };

    // return () => {
    //   socket.close();
    // };
  }, [user, accessToken, addNotification]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    getTimeAgo,
  };
};
