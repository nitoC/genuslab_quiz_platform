"use client";
// import { socket } from "@/lib/api/socket";
import { useSocket } from "@/store/useSocket";
// import { cookies } from "next/headers";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import SocketProvider from "@/providers/SocketProvider";
import AuthProvider from "@/providers/AuthProvider";
import BottomToast from "@/components/toasts/BottomToast";
import { useBottomToast } from "@/store/useBottomToast";
import useNewQuizNotifier from "@/hooks/useNewQuizNotifier";

// Rendered inside QueryClientProvider so its useQuery call has context —
// dashLayout itself is the component that CREATES that provider, so a hook
// called directly in dashLayout's body runs one level too high to see it.
const NewQuizNotifier = () => {
  useNewQuizNotifier();
  return null;
};

const dashLayout = ({ children }: { children: React.ReactNode }) => {
  // Lazily created once per mount — creating a fresh QueryClient on every
  // render (as a plain `new QueryClient()` in the component body would)
  // wipes the entire cache each time this layout re-renders.
  const { isOpen, updateOpen, data } = useBottomToast();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
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
      <SocketProvider>
        <div className="flex-2" data-theme={"dark"}>
          <Toaster />
          <AuthProvider>{children}</AuthProvider>
          <NewQuizNotifier />
          <BottomToast
            isOpen={isOpen}
            data={data}
            onClose={() => {
              updateOpen(false, { title: "", description: "" });
            }}
          />
        </div>
      </SocketProvider>
    </QueryClientProvider>
  );
};

export default dashLayout;
