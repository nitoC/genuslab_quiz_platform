"use client";
import { cn } from "@/lib/utils/cn";
import { formatMMSS, getTimerColor, QUIZ_DURATION } from "@/lib/utils/timer";
import { memo, useEffect, useRef } from "react";
import { useTimeStore } from "../store/time.store";
import { useQuizCountdownTime } from "@/hooks/useTime";
import handleQuizStorage from "@/lib/utils/handleQuizStorage";
import { submitLiveQuestion } from "@/lib/api/apis";

interface TimerProps {
  isLoading?: boolean;
  isSubmitted?: boolean;
  isError?: boolean;
  handleSubmit: (id?: string) => void;
  currentQuestion?: { id: string };
  attemptId?: string;
  type?: "demo" | "live";
}

const Timer = ({
  isLoading,
  isSubmitted,
  isError,
  handleSubmit,
  currentQuestion,
  attemptId,
  type = "live",
}: TimerProps) => {
  const submitTracker = useRef(0);
  const attemptRef = useRef<string | null>(null);
  const { resetTime } = useTimeStore();
  const timeLeft = useQuizCountdownTime(
    isSubmitted ?? false,
    isLoading ?? false,
    isError ?? false,
  );

  // SVG calculations
  const totalSeconds = QUIZ_DURATION;
  const pct = Math.max(0, Math.min(1, timeLeft / totalSeconds));
  const r = 58;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - pct);

  // Consolidated session key to keep refs sync'd
  const sessionKey = type === "demo" ? "demo" : attemptId;

  // 1. Auto-submit countdown effect
  useEffect(() => {
    // Stop execution if loading, failed, or already submitted
    if (isLoading || isError || isSubmitted) return;

    // Trigger auto-submit when countdown hits zero
    if (timeLeft === 0) {
      handleSubmit(currentQuestion?.id);
    }
  }, [
    timeLeft,
    isSubmitted,
    handleSubmit,
    isLoading,
    isError,
    currentQuestion?.id,
  ]);

  // 2. Session state reset effect
  useEffect(() => {
    if (!sessionKey) return;

    if (sessionKey !== attemptRef.current) {
      attemptRef.current = sessionKey;
      resetTime();
      submitTracker.current = 0;
    }
  }, [sessionKey, resetTime]);

  // 3. Background sync effect (Only active for live attempts)
  useEffect(() => {
    if (
      type === "demo" ||
      !attemptId ||
      isLoading ||
      isError ||
      isSubmitted ||
      attemptRef.current !== attemptId
    ) {
      return;
    }

    const syncAnswersInBackground = () => {
      const data = handleQuizStorage(attemptId);
      if (!data?.data) return;

      submitLiveQuestion({
        attemptId: data.attemptId,
        answers: data.data.map((a: { id: string; answer: number }) => ({
          questionId: a.id,
          selectedAnswer: a.answer,
        })),
      });
    };

    if (timeLeft <= 180 && timeLeft > 60 && submitTracker.current < 1) {
      submitTracker.current = 1;
      void syncAnswersInBackground();
    }

    if (timeLeft <= 60 && timeLeft > 0 && submitTracker.current < 2) {
      submitTracker.current = 2;
      void syncAnswersInBackground();
    }
  }, [timeLeft, attemptId, type, isLoading, isError, isSubmitted]);

  return (
    <div className="bg-(--background-dark-secondary) border border-white/5 rounded-lg p-8 flex flex-col items-center justify-center text-center">
      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={r}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          <circle
            cx="64"
            cy="64"
            r={r}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={c}
            strokeDashoffset={dashOffset}
            className="text-green"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-black", getTimerColor(timeLeft))}>
            {formatMMSS(timeLeft)}
          </span>
          <span className="text-[14px] text-grey font-bold uppercase tracking-widest">
            Minutes
          </span>
        </div>
      </div>

      <div className="text-[14px] font-black uppercase tracking-widest text-grey">
        Auto-submit at 00:00
      </div>
    </div>
  );
};

export default memo(Timer);
