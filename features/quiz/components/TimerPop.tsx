"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import { getNextTime } from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { LuTimer } from "react-icons/lu";

interface TimerPopProps {
  pop: boolean;
  refetchQuiz: () => void;
}

const TimerPop = ({ pop, refetchQuiz }: TimerPopProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [countdown, setCountdown] = useState("00Hrs 00Min 00Secs");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["nextTime"],
    queryFn: async () => {
      const res = await getNextTime();
      return res.data.payload;
    },
    refetchInterval: 60000,
  });

  // 1. Prevent Hydration mismatch by marking component mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Manage Countdown Interval safely
  useEffect(() => {
    if (!data?.nextTime || !data?.currentTime) return;

    const serverTimeOffset = Date.now() - data.currentTime;

    const updateTimer = () => {
      const now = Date.now() - serverTimeOffset;
      const timeRemaining = data.nextTime - now;

      if (timeRemaining <= 0) {
        setCountdown("00Hrs 00Min 00Secs");
        refetch();
        refetchQuiz();
        return;
      }

      const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
      const seconds = Math.floor((timeRemaining / 1000) % 60);

      const formattedHours = String(hours).padStart(2, "0");
      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");

      setCountdown(
        `${formattedHours}Hrs ${formattedMinutes}Min ${formattedSeconds}Secs`,
      );
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, [data, refetch]);

  // Don't render until mounted on client and data is ready
  if (!isMounted || isLoading || !data?.nextTime) return null;

  return (
    <section
      className={clsx(
        pop ? "opacity-100" : "opacity-0 pointer-events-none",
        "px-4 duration-300 md:px-8 py-4 sticky bottom-0 z-10 transition-opacity",
      )}
    >
      <GlassCard>
        <div className="p-4 md:p-6 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue/20 p-3 rounded-xl">
              <LuTimer size={24} className="text-blue" />
            </div>
            <div className="flex flex-col">
              <span className="text-blue text-[10px] uppercase tracking-wider font-bold">
                Next Event Starts In {data.episode ? `(${data.episode})` : ""}
              </span>
              <h2 className="text-white text-xl md:text-2xl font-bold font-mono">
                {countdown}
              </h2>
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  );
};

export default TimerPop;
