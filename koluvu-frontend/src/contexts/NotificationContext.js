"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export { NotificationContext };

export const NotificationProvider = ({ children }) => {
  const { accessToken, isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 5;
  const reconnectAttemptRef = useRef(0);
  const subscriptionsRef = useRef(new Map()); // Store topic subscriptions

  // Connect to real-time notifications
  const connectToNotifications = () => {
    if (!isAuthenticated || !accessToken) {
      console.log("Not authenticated, skipping notification connection");
      return;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      console.log("🔔 Connecting to real-time notifications...");
      setConnectionStatus("connecting");

      const eventSource = new EventSource(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/stream/?token=${accessToken}`,
        {
          withCredentials: true,
        }
      );

      eventSource.onopen = () => {
        console.log("✅ Connected to notifications");
        setConnectionStatus("connected");
        reconnectAttemptRef.current = 0; // Reset reconnect attempts
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 Real-time data received:", data);

          if (data.type === "heartbeat") {
            // Just keep alive, don't add to notifications
            return;
          }

          if (data.type === "connection") {
            // Connection confirmation
            return;
          }

          // Handle topic-based subscriptions (for real-time settings updates)
          if (data.topic && subscriptionsRef.current.has(data.topic)) {
            const callbacks = subscriptionsRef.current.get(data.topic);
            callbacks.forEach((callback) => {
              try {
                callback(data);
              } catch (error) {
                console.error(
                  `Error in subscription callback for topic ${data.topic}:`,
                  error
                );
              }
            });
            // Don't add topic-based messages to general notifications
            return;
          }

          // Add new notification for general notifications
          const notification = {
            ...data,
            id: data.id || `notif_${Date.now()}`,
            read: false,
            receivedAt: new Date().toISOString(),
          };

          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Show browser notification if permission granted
          if (Notification.permission === "granted") {
            new Notification(data.message || "New Notification", {
              icon: "/favicon.ico",
              tag: notification.id,
            });
          }

          // Show toast notification (you can customize this)
          if (typeof window !== "undefined" && window.showNotificationToast) {
            window.showNotificationToast(data);
          }
        } catch (error) {
          console.error("Error parsing notification:", error);
        }
      };

      eventSource.onerror = (error) => {
        console.error("❌ Notification connection error:", {
          error,
          readyState: eventSource.readyState,
          url: eventSource.url,
          type: error.type || "unknown",
          target: error.target,
        });
        setConnectionStatus("error");
        eventSource.close();

        // Implement exponential backoff for reconnection
        if (reconnectAttemptRef.current < maxReconnectAttempts) {
          const delay = Math.pow(2, reconnectAttemptRef.current) * 1000; // 1s, 2s, 4s, 8s, 16s
          console.log(
            `⏳ Reconnecting in ${delay / 1000}s... (attempt ${
              reconnectAttemptRef.current + 1
            })`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptRef.current++;
            connectToNotifications();
          }, delay);
        } else {
          console.error("Max reconnection attempts reached");
          setConnectionStatus("disconnected");
        }
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error("Failed to connect to notifications:", error);
      setConnectionStatus("error");
    }
  };

  // Disconnect from notifications
  const disconnectFromNotifications = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setConnectionStatus("disconnected");
    console.log("🔌 Disconnected from notifications");
  };

  // Send notification (for testing or admin purposes)
  const sendNotification = async (notificationData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notifications/stream/send/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationData),
        }
      );

      if (response.ok) {
        console.log("✅ Notification sent successfully");
        return true;
      } else {
        console.error("❌ Failed to send notification");
        return false;
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Check if we should ask for notification permission
  const shouldAskForPermission = () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }

    // Check current browser permission
    const currentPermission = Notification.permission;

    // Don't ask if already granted or denied
    if (currentPermission === "granted" || currentPermission === "denied") {
      return false;
    }

    // Check if we've already asked this user before (localStorage)
    const hasAskedBefore = localStorage.getItem("koluvu_notification_asked");

    // Check if user dismissed the prompt recently (within 7 days)
    const lastDismissed = localStorage.getItem("koluvu_notification_dismissed");
    if (lastDismissed) {
      const daysSinceDismissed =
        (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return false; // Don't ask again for 7 days
      }
    }

    return !hasAskedBefore;
  };

  // Request notification permission (only when appropriate)
  const requestNotificationPermission = async (forceAsk = false) => {
    if (!forceAsk && !shouldAskForPermission()) {
      return Notification.permission === "granted";
    }

    if ("Notification" in window) {
      try {
        // Mark that we've asked before
        localStorage.setItem("koluvu_notification_asked", "true");
        localStorage.setItem(
          "koluvu_notification_asked_time",
          Date.now().toString()
        );

        const permission = await Notification.requestPermission();

        if (permission === "denied") {
          // User denied, remember this and don't ask again for a while
          localStorage.setItem(
            "koluvu_notification_dismissed",
            Date.now().toString()
          );
        } else if (permission === "granted") {
          // User granted, remove any dismissal timestamps
          localStorage.removeItem("koluvu_notification_dismissed");
          console.log("🔔 Notification permission granted!");
        }

        return permission === "granted";
      } catch (error) {
        console.error("Error requesting notification permission:", error);
        return false;
      }
    }
    return false;
  };

  // Connect when authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      connectToNotifications();
    } else {
      disconnectFromNotifications();
    }

    // Cleanup on unmount
    return () => {
      disconnectFromNotifications();
    };
  }, [isAuthenticated, accessToken]);

  // Smart notification permission request - only ask when appropriate
  useEffect(() => {
    if (isAuthenticated && user) {
      // Only ask authenticated users, and only if we should
      if (shouldAskForPermission()) {
        // Delay the request slightly to avoid interrupting the login flow
        const timeout = setTimeout(() => {
          requestNotificationPermission();
        }, 2000); // Wait 2 seconds after authentication

        return () => clearTimeout(timeout);
      }
    }
  }, [isAuthenticated, user]);

  // Get current notification permission status
  const getNotificationPermission = () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }
    return Notification.permission;
  };

  // Reset notification preferences (for testing or user settings)
  const resetNotificationPreferences = () => {
    localStorage.removeItem("koluvu_notification_asked");
    localStorage.removeItem("koluvu_notification_asked_time");
    localStorage.removeItem("koluvu_notification_dismissed");
    console.log("🔄 Notification preferences reset");
  };

  // Subscribe to topic-based real-time updates (for settings sync, etc.)
  const subscribe = (topic, callback) => {
    if (!subscriptionsRef.current.has(topic)) {
      subscriptionsRef.current.set(topic, new Set());
    }
    subscriptionsRef.current.get(topic).add(callback);

    console.log(`🔔 Subscribed to topic: ${topic}`);

    // Return unsubscribe function
    return () => {
      const callbacks = subscriptionsRef.current.get(topic);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          subscriptionsRef.current.delete(topic);
        }
      }
      console.log(`🔕 Unsubscribed from topic: ${topic}`);
    };
  };

  // Unsubscribe from a topic
  const unsubscribe = (topic, callback) => {
    const callbacks = subscriptionsRef.current.get(topic);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        subscriptionsRef.current.delete(topic);
      }
    }
    console.log(`🔕 Unsubscribed from topic: ${topic}`);
  };

  // Get active subscriptions (for debugging)
  const getActiveSubscriptions = () => {
    return Array.from(subscriptionsRef.current.keys());
  };

  const value = {
    notifications,
    unreadCount,
    connectionStatus,
    sendNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    requestNotificationPermission,
    getNotificationPermission,
    resetNotificationPreferences,
    shouldAskForPermission,
    connectToNotifications,
    disconnectFromNotifications,
    // Real-time subscription methods
    subscribe,
    unsubscribe,
    getActiveSubscriptions,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
