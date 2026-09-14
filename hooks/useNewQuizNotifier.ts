"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNextTime } from "@/lib/api/apis";
import { useBottomToast } from "@/store/useBottomToast";

// Polls the server's next-quiz time and pops the bottom toast the moment a
// new quiz goes live, regardless of which (dashboard) page is open.
const useNewQuizNotifier = () => {
  const updateOpen = useBottomToast((state) => state.updateOpen);
  const notifiedForRef = useRef<number | null>(null);

  const { data } = useQuery({
    queryKey: ["nextTime"],
    queryFn: async () => {
      const res = await getNextTime();
      return res.data.payload;
    },
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (!data?.nextTime || !data?.currentTime) return;

    const serverTimeOffset = Date.now() - data.currentTime;

    const checkQuizTime = () => {
      const now = Date.now() - serverTimeOffset;
      const timeRemaining = data.nextTime - now;

      if (timeRemaining <= 0 && notifiedForRef.current !== data.nextTime) {
        notifiedForRef.current = data.nextTime;
        updateOpen(true, {
          title: "New quiz is live!",
          description: data.episode
            ? `Episode ${data.episode} has started — jump in now.`
            : "A new quiz just started — jump in now.",
        });
      }
    };

    checkQuizTime();
    const interval = setInterval(checkQuizTime, 1000);
    return () => clearInterval(interval);
  }, [data, updateOpen]);
};

export default useNewQuizNotifier;
