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
  //   console.log({ id: currId, answer: index }, " in option");
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
        "relative p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between group select-none",
        selected
          ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          : "bg-white/3 border-white/5 hover:border-white/10 hover:bg-white/5",
      )}
      aria-pressed={selected}
      aria-disabled={submitting}
    >
      <span
        className={cn(
          "font-bold text-base",
          selected ? "text-white" : "text-slate-400",
        )}
      >
        {label}
      </span>
      <div
        className={cn(
          "w-4 h-4 rounded-full border-2 absolute z-2 right-4 flex items-center justify-center transition-all",
          selected
            ? "bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
            : "border-slate-700",
        )}
      >
        {selected && (
          <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white -rotate-45 mb-0.5" />
        )}
      </div>
    </div>
  );
};

export default memo(QuizOptions);
