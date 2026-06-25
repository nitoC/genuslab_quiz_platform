import { useEffect, useState } from "react";

interface Props {
  duration: number;
  onExpire: () => void;
  paused?: boolean;
}

export const useQuizTimer = ({ duration, onExpire, paused }: Props) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (paused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onExpire();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, paused, onExpire]);

  const reset = () => setTimeLeft(duration);

  return {
    timeLeft,
    reset,
  };
};
