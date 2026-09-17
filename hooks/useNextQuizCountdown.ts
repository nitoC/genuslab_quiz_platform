"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNextTime } from "@/lib/api/apis";

interface NextQuizCountdown {
  hours: number;
  minutes: number;
  seconds: number;
  remainingMs: number | null;
  /** 0 -> 1, fraction of the current waiting window that has elapsed. */
  progress: number;
  episode: string | null;
  isLoading: boolean;
  isReady: boolean;
  refetch: () => void;
}

// Shared by TimerPop and the quiz status bar so both read the exact same
// server-driven countdown instead of drifting duplicate implementations.
const useNextQuizCountdown = (refetchQuiz?: () => void): NextQuizCountdown => {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  // Snapshot of remainingMs the first time each waiting window is observed —
  // the denominator for the progress ring, since the API only ever gives us
  // a target time, not the total length of the window. Kept in state (not a
  // ref) so it's never read during render — ref reads outside effects/events
  // can tear under concurrent rendering.
  const [initialRemainingMs, setInitialRemainingMs] = useState<number | null>(
    null,
  );

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["nextTime"],
    queryFn: async () => {
      const res = await getNextTime();
      return res.data.payload;
    },
    refetchInterval: 60000,
  });

  const nextTime = data?.nextTime;
  const currentTime = data?.currentTime;

  // Guards against re-triggering refetch() for the SAME stale nextTime.
  // Without this, once the countdown hits zero: tick() calls refetch() ->
  // refetch resolves with a new `data` object -> if the effect below
  // depended on the whole `data` object, that new reference would
  // re-trigger the effect immediately (not waiting for the 1s interval) ->
  // tick() runs again -> still <= 0 (a slow/failed refetch, or the server
  // briefly re-returning the same already-passed time) -> refetch() again
  // -> loop, bounded only by promise-resolution speed, not by time. This
  // was observed hammering the endpoint fast enough to trip the backend's
  // per-second rate limiter. Tracking the exact nextTime we've already
  // fired a refetch for — and depending on the primitive nextTime/
  // currentTime values below instead of the `data` object — closes both
  // the immediate re-trigger and the every-tick repeat.
  const hasTriggeredRefetchRef = useRef<number | null>(null);

  useEffect(() => {
    setInitialRemainingMs(null);
    hasTriggeredRefetchRef.current = null;
  }, [nextTime]);

  useEffect(() => {
    if (!nextTime || !currentTime) {
      setRemainingMs(null);
      return;
    }

    const serverTimeOffset = Date.now() - currentTime;

    const tick = () => {
      const now = Date.now() - serverTimeOffset;
      const remaining = Math.max(0, nextTime - now);

      setRemainingMs(remaining);
      setInitialRemainingMs((prev) => (prev === null ? remaining : prev));

      if (remaining <= 0 && hasTriggeredRefetchRef.current !== nextTime) {
        hasTriggeredRefetchRef.current = nextTime;
        refetch();
        refetchQuiz?.();
      }
    };

    tick();
    const timerId = setInterval(tick, 1000);
    return () => clearInterval(timerId);
  }, [nextTime, currentTime, refetch, refetchQuiz]);

  const hours =
    remainingMs !== null ? Math.floor(remainingMs / (1000 * 60 * 60)) % 24 : 0;
  const minutes =
    remainingMs !== null ? Math.floor(remainingMs / (1000 * 60)) % 60 : 0;
  const seconds = remainingMs !== null ? Math.floor(remainingMs / 1000) % 60 : 0;

  const rawProgress =
    remainingMs !== null && initialRemainingMs
      ? 1 - remainingMs / initialRemainingMs
      : 0;

  return {
    hours,
    minutes,
    seconds,
    remainingMs,
    progress: Math.min(1, Math.max(0, rawProgress)),
    episode: data?.episode ?? null,
    isLoading,
    isReady: !isLoading && remainingMs !== null,
    refetch,
  };
};

export default useNextQuizCountdown;
