"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/store/useUser";

const BASE_SERVER_PRODUCTION = "https://genuslab-quiz-backend.onrender.com";

// Same server the API talks to (it used to always hit production, even in dev).
const socketOrigin = () => {
  try {
    return new URL(process.env.NEXT_PUBLIC_BASE_URL || "").origin;
  } catch {
    return BASE_SERVER_PRODUCTION;
  }
};

export const UseNotificationSocket = (userId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socketInstance = io(`${socketOrigin()}/notification-events`, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      // Read on every (re)connect so a refreshed token is picked up.
      auth: (cb) => cb({ token: useUser.getState().user?.accessToken }),
    });

    socketInstance.on("disconnect", (reason) => {
      console.warn("⚠️ Disconnected:", reason);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
    };
  }, [userId]);

  return socket;
};
