"use client";
import { useEffect, useRef, useState } from "react";
import { ReconnectingWS } from "@/lib/realtime/socket";

export type NotificationEvent = {
  type: string;
  [k: string]: any;
};

export function useNotificationsWS(token?: string) {
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const wsRef = useRef<ReconnectingWS | null>(null);

  useEffect(() => {
    wsRef.current = new ReconnectingWS({
      path: "/ws/notifications/",
      token,
      onMessage: (data) => {
        setEvents((prev) => [data as NotificationEvent, ...prev]);
      },
    });
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [token]);

  return { events };
}
