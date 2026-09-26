"use client";

import React from "react";
import Link from "next/link";
import { MdArrowForward, MdOutlinePlayCircle } from "react-icons/md";
import useNextQuizCountdown from "@/hooks/useNextQuizCountdown";

interface FloatingDemoButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export const FloatingDemoButton: React.FC<FloatingDemoButtonProps> = ({
  href,
  onClick,
  className = "",
}) => {
  // Sit above the countdown bar only when it's showing.
  const { isReady: timerBarVisible } = useNextQuizCountdown();

  const content = (
    <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 sm:gap-3 sm:px-4 sm:py-3">
      {/* Play icon */}
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700 sm:h-8 sm:w-8"
      >
        <MdOutlinePlayCircle size={16} className="sm:hidden" />
        <MdOutlinePlayCircle size={19} className="hidden sm:block" />
      </span>

      {/* Label */}
      <span className="text-xs font-semibold tracking-[-0.01em] sm:text-sm">
        Join Demo
      </span>

      {/* Arrow */}
      <MdArrowForward
        aria-hidden="true"
        size={16}
        className="shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 sm:hidden"
      />
      <MdArrowForward
        aria-hidden="true"
        size={18}
        className="hidden shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 sm:block"
      />
    </span>
  );

  const wrapperClasses = [
    "group",
    "fixed",
    "right-4",
    "sm:right-6",
        // Below the mobile sidebar (z-30), above the header (z-10).
    "z-20",
    timerBarVisible ? "bottom-27 sm:bottom-30" : "bottom-5 sm:bottom-6",
    "focus:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-slate-400",
    "focus-visible:ring-offset-2",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={wrapperClasses}
        aria-label="Join demo"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href ?? "/quiz/demo"}
      className={wrapperClasses}
      aria-label="Join demo"
    >
      {content}
    </Link>
  );
};
