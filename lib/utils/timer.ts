export const QUIZ_DURATION = 300;

export const formatMMSS = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export const getTimerColor = (seconds: number) => {
  if (seconds <= 60) return "text-red";
  if (seconds <= 300) return "text-yellow";

  return "text-green";
};
