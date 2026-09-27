"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import useNextQuizCountdown from "@/hooks/useNextQuizCountdown";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { LuTimer } from "react-icons/lu";

interface TimerPopProps {
  pop: boolean;
  refetchQuiz?: () => void;
}

// Height of the fixed bar, read by FloatingDemoButton so it can sit on top.
// 0px (or unset) means the bar isn't showing.
export const TIMER_BAR_VAR = "--timer-bar-h";

const TimerPop = ({ pop, refetchQuiz }: TimerPopProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const [barHeight, setBarHeight] = useState(0);

  const { hours, minutes, seconds, isLoading, isReady, episode } =
    useNextQuizCountdown(refetchQuiz);

  const countdown = isReady
    ? `${String(hours).padStart(2, "0")}Hrs ${String(minutes).padStart(2, "0")}Min ${String(seconds).padStart(2, "0")}Secs`
    : "00Hrs 00Min 00Secs";

  // Prevent Hydration mismatch by marking component mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const visible = isMounted && !isLoading && isReady;

  // Track the bar's real height (it wraps on small screens).
  useEffect(() => {
    const el = barRef.current;
    if (!visible || !el) {
      setBarHeight(0);
      return;
    }
    const measure = () => setBarHeight(el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  // Share it with the demo button; clear it when hidden or unmounted.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(TIMER_BAR_VAR, `${pop ? barHeight : 0}px`);
    return () => {
      root.style.removeProperty(TIMER_BAR_VAR);
    };
  }, [barHeight, pop]);

  if (!visible) return null;

  return (
    <>
      {/* Keeps the page's last content from hiding behind the fixed bar. */}
      <div aria-hidden="true" style={{ height: pop ? barHeight : 0 }} />
      <section
        ref={barRef}
        className={clsx(
          pop ? "opacity-100" : "opacity-0 pointer-events-none",
          // Pinned to the bottom of the screen, lined up with the page
          // content (the desktop sidebar is 70 wide, see Layout).
          "fixed bottom-0 left-0 right-0 cu-lg:left-70 z-10",
          "px-4 duration-300 md:px-8 py-4 transition-opacity",
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
    </>
  );
};

export default TimerPop;
