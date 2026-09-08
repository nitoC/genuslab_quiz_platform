"use client";

import { MdChevronRight, MdGroups } from "react-icons/md";
import { cn } from "@/lib/utils/cn";

interface QuizFooterProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  submitting?: boolean;
  currentQuestion?: any;

  onPrev: () => void;
  onNext: (data: any) => void;
  onSubmit: (data: any) => void;
}

const QuizFooter = ({
  currentQuestionIndex,
  totalQuestions,
  submitting = false,
  currentQuestion,
  onPrev,
  onNext,
  onSubmit,
}: QuizFooterProps) => {
  return (
    <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex gap-3">
        {[MdGroups].map((Icon, i) => (
          <button
            key={i}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Icon size={20} />
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="text-right">
          <p className="text-[14px] text-slate-500 font-black uppercase tracking-widest">
            Potential Reward
          </p>
          <p className="text-2xl font-black text-white">+100 XP</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {currentQuestionIndex > 0 && (
            <button
              onClick={onPrev}
              disabled={submitting}
              className="bg-white/5 hover:bg-white/10 text-white px-5 py-4 rounded-[20px] font-black text-sm uppercase tracking-wider transition border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
          )}

          {currentQuestionIndex >= totalQuestions - 1 ? (
            <button
              onClick={() => onSubmit(currentQuestion?.id)}
              disabled={submitting}
              className={cn(
                "px-8 py-4 rounded-[20px] font-black text-sm uppercase tracking-wider flex items-center gap-3 transition-all transform",
                // Active / Default styles
                "bg-red-500 hover:bg-red-400 text-[#020617] hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(239,68,68,0.3)]",
                // Disabled / Submitting state styles
                "disabled:bg-slate-700 disabled:text-slate-400 disabled:border disabled:border-slate-600 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:hover:bg-slate-700",
              )}
            >
              {submitting ? "Submitting..." : "Submit"}
              <MdChevronRight size={24} />
            </button>
          ) : (
            <button
              onClick={() => onNext(currentQuestion?.id)}
              disabled={submitting}
              className={cn(
                "px-8 py-4 rounded-[20px] font-black text-sm uppercase tracking-wider flex items-center gap-3 transition-all transform",
                // Active / Default styles
                "bg-emerald-500 hover:bg-emerald-400 text-[#020617] hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.3)]",
                // Disabled / Submitting state styles
                "disabled:bg-slate-700 disabled:text-slate-400 disabled:border disabled:border-slate-600 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:hover:bg-slate-700",
              )}
            >
              {submitting ? "Submitting..." : "Next Question"}
              <MdChevronRight size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizFooter;
