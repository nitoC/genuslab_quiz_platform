"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

const CountdownCircle = ({ initialSeconds = 60 }) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  // Constants for the SVG circle
  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  // Calculate the progress: 1 is full, 0 is empty
  const progress = timeLeft / initialSeconds;
  const strokeDashoffset = circumference * (1 - progress);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Helper to format 75 seconds -> "01:15"
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative flex items-center justify-center w-48 h-48 bg-[#0a0c14] rounded-full">
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background Track */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="#1e293b"
          strokeWidth="4"
          fill="transparent"
        />
        {/* Animated Progress Path */}
        <circle
          cx="96"
          cy="96"
          r={radius}
          stroke="#10b981" // Emerald Green
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={circumference}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 1s linear",
          }}
          strokeLinecap="round"
        />
      </svg>

      {/* Center Text */}
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-mono font-bold text-white tracking-tighter">
          {formatTime(timeLeft)}
        </span>
        <span className="text-[14px] uppercase tracking-widest text-slate-500 font-semibold">
          Remaining
        </span>
      </div>
    </div>
  );
};

export default CountdownCircle;
