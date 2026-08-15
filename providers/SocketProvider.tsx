"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/store/useUser";
import { useSocket } from "@/store/useSocket";
import { UseNotificationSocket } from "@/hooks/useSocket";

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

  return <div>{children}</div>;
};

export default SocketProvider;
