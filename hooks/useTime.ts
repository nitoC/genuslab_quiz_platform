import { useTimeStore } from "@/features/quiz/store/time.store";
import { useEffect } from "react";

export const useQuizCountdownTime = (
  isSubmitted: boolean,
  isLoading: boolean,
  isError: boolean,
) => {
  const { time: timeLeft, decrementTime } = useTimeStore();
  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted || isLoading || isError) return;

    const timer = setInterval(() => {
      decrementTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, isLoading, isError]);
  return timeLeft;
};
