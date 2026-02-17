import { socket } from "@/lib/api/socket";
import { useEffect } from "react";

export const useSocketError = (socketId: string) => {
  const func = (data: any) => console.log("Error Message from server:", data);
  socket.on(`${socketId}msg`, func);

  useEffect(() => {
    if (!socketId) return;
    // Trigger time sync
    return () => {
      socket.off(`${socketId}msg`, func);
    };
  }, [socketId]);
};
