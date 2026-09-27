"use client";

import React from "react";
import Link from "next/link";
import { MdArrowForward, MdOutlinePlayCircle } from "react-icons/md";

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
  // Sit on top of the countdown bar when it's showing: TimerPop publishes its
  // height in --timer-bar-h (0 or unset when hidden, so we drop to the bottom).
  const style: React.CSSProperties = {
    bottom: "max(1.25rem, calc(var(--timer-bar-h, 0px) + 0.5rem))",
  };

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
    // Same side inset as the countdown bar (px-4 md:px-8).
    "right-4",
    "md:right-8",
        // Below the mobile sidebar (z-30), above the header (z-10).
    "z-20",
    "transition-[bottom]",
    "duration-300",
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
        style={style}
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
      style={style}
      aria-label="Join demo"
    >
      {content}
    </Link>
  );
};
