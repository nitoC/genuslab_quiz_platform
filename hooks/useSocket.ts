"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const BASE_SERVER = "http://localhost:8000";

export const UseNotificationSocket = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // 1. Guard against missing userId
    if (!userId) return;

    // 2. Initialize the socket connection inside useEffect
    const socketInstance = io(`${BASE_SERVER}/notification-events`, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: { userId },
      auth: {
        userAgent: "Custom Ws Client",
      },
    });

    // 3. Attach standard connection listeners
    socketInstance.on("connect", () => {
      console.log(`🚀 Connected with session ID: ${socketInstance.id}`);
    });

    socketInstance.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected:", reason);
      if (reason === "io server disconnect") {
        socketInstance.connect();
      }
    });

    setSocket(socketInstance);

    // 4. Clean up connection on component unmount / userId change
    return () => {
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
    };
  }, [userId]);

  // Return the raw socket instance directly
  return socket;
};
