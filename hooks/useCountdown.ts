import { useEffect } from "react";

const useCountdown = (
  targetEpoch: number | null,
  type: "dash" | "quiz",
  setCountdown: (
    val:
      | string
      | { days: number; hours: number; minutes: number; seconds: number },
  ) => void,
) => {
  const quizHours = [7, 9, 11, 13, 15, 17, 19];

  console.log("useCountdown initialized with targetEpoch:", targetEpoch);

  useEffect(() => {
    // Stop countdown when no target OR socket disconnected
    if (!targetEpoch) {
      setCountdown(
        type === "dash"
          ? "Next quiz in —"
          : { days: 0, hours: 0, minutes: 0, seconds: 0 },
      );
      return;
    }

    const interval = setInterval(() => {
      const now = new Date(); // real current time
      const currentHour = now.getHours();

      let nextQuizHour: number | null = null;

      // After 9 PM - count to tomorrow 7 AM
      if (currentHour >= 21) {
        const target = new Date();
        target.setDate(now.getDate() + 1);
        target.setHours(7, 0, 0, 0);
        updateCountdown(target, now);
        return;
      }

      // Before 5 AM - next quiz 7 AM
      if (currentHour < 5) {
        const target = new Date();
        target.setHours(7, 0, 0, 0);
        updateCountdown(target, now);
        return;
      }

      // Between 5 AM and 7 AM - count to 7 AM
      if (currentHour >= 5 && currentHour < 7) {
        const target = new Date();
        target.setHours(7, 0, 0, 0);
        updateCountdown(target, now);
        return;
      }

      // Between 7 AM and 9 PM
      for (let i = 0; i < quizHours.length; i++) {
        const start = quizHours[i];
        const end = start + 2;

        // Currently in a quiz
        if (currentHour >= start && currentHour < end) {
          const target = new Date();
          target.setHours(end, 0, 0, 0);
          updateCountdown(target, now);
          return;
        }

        if (currentHour < start) {
          nextQuizHour = start;
          break;
        }
      }

      // After last quiz - count to 9 PM
      if (nextQuizHour === null) {
        const target = new Date();
        target.setHours(21, 0, 0, 0);
        updateCountdown(target, now);
        return;
      }

      // Next quiz in day
      const target = new Date();
      target.setHours(nextQuizHour, 0, 0, 0);
      updateCountdown(target, now);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetEpoch]); // << FIXED: timer updates on target change

  // Core formatting logic
  const updateCountdown = (target: Date, now: Date) => {
    const diff = target.getTime() - now.getTime();
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (type === "dash") {
      setCountdown(`Next quiz in ${hours}hrs ${minutes}mins ${seconds}secs`);
    } else {
      setCountdown({ days: 0, hours, minutes, seconds });
    }
  };
};

export default useCountdown;
