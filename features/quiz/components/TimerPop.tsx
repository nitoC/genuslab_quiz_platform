"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import useNextQuizCountdown from "@/hooks/useNextQuizCountdown";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { LuTimer } from "react-icons/lu";

interface TimerPopProps {
  pop: boolean;
  refetchQuiz?: () => void;
}

const TimerPop = ({ pop, refetchQuiz }: TimerPopProps) => {
  const [isMounted, setIsMounted] = useState(false);

  const { hours, minutes, seconds, isLoading, isReady, episode } =
    useNextQuizCountdown(refetchQuiz);

  const countdown = isReady
    ? `${String(hours).padStart(2, "0")}Hrs ${String(minutes).padStart(2, "0")}Min ${String(seconds).padStart(2, "0")}Secs`
    : "00Hrs 00Min 00Secs";

  // Prevent Hydration mismatch by marking component mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render until mounted on client and data is ready
  if (!isMounted || isLoading || !isReady) return null;

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
              <span className="text-blue text-[14px] uppercase tracking-wider font-bold">
                Next Event Starts In {episode ? `(${episode})` : ""}
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
