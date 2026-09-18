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
        "relative p-4 sm:p-5 md:p-6 rounded-lg border-2 transition-colors cursor-pointer flex items-center justify-between group select-none min-h-[3.5rem] sm:min-h-[4rem]",
        selected
          ? "bg-green/10 border-green/50"
          : "bg-white/[0.03] border-white/5 hover:border-white/10 hover:bg-white/5",
        submitting && "opacity-60 cursor-not-allowed",
      )}
      aria-pressed={selected}
      aria-disabled={submitting}
    >
      <span
        className={cn(
          "font-bold text-sm sm:text-base leading-snug break-words pr-8",
          selected ? "text-(--primary)" : "text-grey",
        )}
      >
        {label}
      </span>

      {/* Selection indicator */}
      <div
        className={cn(
          "w-4 h-4 rounded-full border-2 absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-colors flex-shrink-0",
          selected ? "bg-green border-green" : "border-grey/40",
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
