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
  const content = (
    <span className="inline-flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50">
      {/* Play icon */}
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700"
      >
        <MdOutlinePlayCircle size={19} />
      </span>

      {/* Label */}
      <span className="text-sm font-semibold tracking-[-0.01em]">
        Join Demo
      </span>

      {/* Arrow */}
      <MdArrowForward
        aria-hidden="true"
        size={18}
        className="shrink-0 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </span>
  );

  const wrapperClasses = [
    "group",
    "fixed",
    "bottom-5",
    "right-5",
    "z-50",
    "sm:bottom-6",
    "sm:right-6",
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
