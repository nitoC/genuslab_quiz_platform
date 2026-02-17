import { socket } from "@/lib/api/socket";
import { useEffect } from "react";

export const useData = (
  socketId: string,
  handleDataUpdate: (data: number) => void
) => {
  const dataListener = (data: any) => {
    console.log("Data stream received:", data);
    // Handle data from the server
  };

  useEffect(() => {
    if (!socketId) return;

    socket.on(socketId, dataListener);
    const request = {
      action: "getUserInfo",
      userId: socketId,
    };
    socket.emit("server", request);

    return () => {
      socket.off(socketId, dataListener);
    };
  }, [socketId]);
};
