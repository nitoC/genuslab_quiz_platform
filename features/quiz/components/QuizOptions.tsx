import { cn } from "@/lib/utils/cn";
import React, { memo } from "react";

const QuizOptions = ({
  index,
  handleSelect,
  label,
  currId,
  selected,
  submitting,
}: any) => {
  return (
    <div
      key={index}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleSelect(currId, index);
      }}
      onClick={() => !submitting && handleSelect(currId, index)}
      className={cn(
        // Fluid padding (p-4 on mobile to save vertical viewport real estate)
        // Fluid rounded corners to match the main outer container changes
        "relative p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between group select-none min-h-[3.5rem] sm:min-h-[4rem]",
        selected
          ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          : "bg-white/3 border-white/5 hover:border-white/10 hover:bg-white/5",
        submitting && "opacity-60 cursor-not-allowed",
      )}
      aria-pressed={selected}
      aria-disabled={submitting}
    >
      {/* 
        Fluid typography (text-sm on mobile scaling to text-base on screens >640px).
        Added pr-8 padding right to ensure text never collides with the absolute indicator ring.
      */}
      <span
        className={cn(
          "font-bold text-sm sm:text-base leading-snug break-words pr-8",
          selected ? "text-white" : "text-slate-400",
        )}
      >
        {label}
      </span>

      {/* Absolute positioning centered vertically relative to dynamic option height context */}
      <div
        className={cn(
          "w-4 h-4 rounded-full border-2 absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all flex-shrink-0",
          selected
            ? "bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
            : "border-slate-700",
        )}
      >
        {selected && (
          <div className="w-2 h-1.5 border-l-2 border-b-2 border-white -rotate-45 mb-0.5" />
        )}
      </div>
    </div>
  );
};

export default memo(QuizOptions);
