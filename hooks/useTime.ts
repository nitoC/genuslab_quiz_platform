import { socket } from "@/lib/api/socket";
import { useQuizHours } from "@/store/useQuizHours";
import { useEffect } from "react";

export const useTime = (
  socketId: string,
  handleTimerUpdate: (data: number) => void
) => {
  const updateEpoch = useQuizHours((state: any) => state.updateEpoch);
  const timeListener = (epoch: number) => {
    console.log("Server Time Epoch:", epoch);
    handleTimerUpdate(epoch);
    updateEpoch(epoch);
  };

  socket.on(`${socketId}time`, timeListener);

  useEffect(() => {
    if (!socketId) return;

    // Trigger time sync
    socket.emit("time", socketId);

    return () => {
      socket.off(`${socketId}time`, timeListener);
    };
  }, [socketId]);
};
