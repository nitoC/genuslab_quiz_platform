"use client";
import { cn } from "@/lib/utils/cn";
import { formatMMSS, getTimerColor } from "@/lib/utils/timer";
// import { useTime } from "motion/react";
import { memo, useEffect, useRef, useState } from "react";
import { useTimeStore } from "../store/time.store";
import { useQuizCountdownTime } from "@/hooks/useTime";
import handleQuizStorage from "@/lib/utils/handleQuizStorage";
import { submitLiveQuestion } from "@/lib/api/apis";

const timeCountDown = 300;

const Timer = ({
  isLoading,
  isSubmitted,
  isError,
  handleSubmit,
  currentQuestion,
  attemptId,
}: any) => {
  const submitTracker = useRef(0);
  const timeLeft = useQuizCountdownTime(isSubmitted, isLoading, isError);
  // const [timeLeft, setTimeLeft] = useState<number>(timeCountDown); // 5 minutes default
  // const [submitTracker, setSubmitTracker] = useState({
  //   state: 0,
  //   maxState: 2,
  // });

  // Timer ring calculations (SVG)
  const totalSeconds = timeCountDown;
  const pct = Math.max(0, Math.min(1, timeLeft / totalSeconds));
  const r = 58;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - pct);

  // 3. Simple countdown timer side-effect
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted) {
      handleSubmit(currentQuestion.id);
    }
  }, [timeLeft, isSubmitted, handleSubmit]);

  useEffect(() => {
    // ~2 minutes elapsed
    const syncAnswersInBackground = () => {
      const data = handleQuizStorage(attemptId);
      console.log(data, "quiz data", submitTracker.current);
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

    // ~4 minutes elapsed
    if (timeLeft <= 60 && timeLeft > 0 && submitTracker.current < 2) {
      submitTracker.current = 2;
      void syncAnswersInBackground();
    }
  }, [timeLeft]);

  return (
    <div className="bg-[#11192e] border border-white/5 rounded-[32px] p-8 flex flex-col items-center justify-center text-center">
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
            className="text-emerald-500"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-black", getTimerColor(timeLeft))}>
            {formatMMSS(timeLeft)}
          </span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Minutes
          </span>
        </div>
      </div>

      <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        Auto-submit at 00:00
      </div>
    </div>
  );
};

export default memo(Timer);
