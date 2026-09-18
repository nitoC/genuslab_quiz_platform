import { useTimeStore } from "@/features/quiz/store/time.store";
import { useEffect, useState } from "react";

const remainingFrom = (deadline: number) =>
  Math.max(0, Math.round((deadline - Date.now()) / 1000));

export const useQuizCountdownTime = (
  isSubmitted: boolean,
  isLoading: boolean,
  isError: boolean,
) => {
  const deadline = useTimeStore((state) => state.deadline);
  const [timeLeft, setTimeLeft] = useState(() => remainingFrom(deadline));

  // Re-sync immediately whenever the deadline itself changes (e.g. resetTime()
  // on a new attempt) rather than waiting for the next 1s tick.
  useEffect(() => {
    setTimeLeft(remainingFrom(deadline));
  }, [deadline]);

  useEffect(() => {
    if (isSubmitted || isLoading || isError) return;

    const timer = setInterval(() => {
      setTimeLeft(remainingFrom(deadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline, isSubmitted, isLoading, isError]);

  return timeLeft;
};
