"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/store/useUser";
import { useSocket } from "@/store/useSocket";
import { UseNotificationSocket } from "@/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { playNotificationSound } from "@/lib/utils/playNotificationSound";
import { MdNotificationsActive } from "react-icons/md";

type SocketInstance = {
  socket: any;
  disconnect: () => void;
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useUser() as { data?: { user?: { id?: string } } } | undefined;
  const data = user?.data;
  const { updateSocket } = useSocket() as {
    updateSocket: (socket: any) => void;
  };
  const queryClient = useQueryClient();
  const [socketData, setSocketData] = useState<any>(null);
  let socketInstance: SocketInstance | null = null;

  useEffect(() => {
    if (data?.user?.id) {
      const res: any = UseNotificationSocket(data.user.id);
      const socket = res;
      //   socketInstance = { socket, disconnect: () => socket.disconnect() };
      setSocketData(socket);
      updateSocket(socket);
    }

    return () => {
      if (socketData) {
        socketData.disconnect();
      }
    };
  }, [data?.user?.id]);

  // Global "new notification" alert — fires regardless of which dashboard
  // page is open, so the user is always told about it (sound + toast),
  // and any mounted notifications list is refreshed in the background.
  useEffect(() => {
    if (!socketData) return;

    const handleIncomingNotification = (newNotice: any) => {
      playNotificationSound();

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-slate-900/95 border border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl pointer-events-auto flex gap-3 p-4 ring-1 ring-black ring-opacity-5`}
          >
            <div className="shrink-0 w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <MdNotificationsActive size={18} />
            </div>
            <div className="flex-1 w-0">
              <p className="text-sm font-bold text-blue-400">
                {newNotice.title || "New Notification"}
              </p>
              <p className="mt-1 text-sm text-slate-300 line-clamp-2">
                {newNotice.content || newNotice.message || newNotice.description}
              </p>
            </div>
          </div>
        ),
        { position: "bottom-right", duration: 5000 },
      );

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };

    socketData.on("notification", handleIncomingNotification);

    return () => {
      socketData.off("notification", handleIncomingNotification);
    };
  }, [socketData, queryClient]);

  return <div>{children}</div>;
};

export default SocketProvider;
