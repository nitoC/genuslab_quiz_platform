"use client";
import { socket } from "@/lib/api/socket";
import { useSocket } from "@/store/useSocket";
// import { cookies } from "next/headers";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const dashLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  // const updateSocketId = useSocket((state: any) => state.updateSocketId);
  // const theme = (await cookies()).get("theme")?.value ?? "dark";

  // // --- Load theme preference from localStorage ---
  // useEffect(() => {
  //   // const savedTheme = localStorage.getItem("theme");
  //   socket.connect();
  //   socket.on("connect", () => {
  //     // console.log("Connected to server. Your Socket ID:", socket.id);
  //     // updateSocketId(socket.id);
  //     console.log("id added to state");
  //     // Save this ID for future communication
  //   });

  //   socket.on("disconnect", () => {
  //     console.log(
  //       "Disconnected from server. Handle reconnect or cleanup here.",
  //     );
  //   });
  // }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex-2" data-theme={"dark"}>
        {children}
      </div>
    </QueryClientProvider>
  );
};

export default dashLayout;
