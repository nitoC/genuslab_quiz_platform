"use client";

import { MdChevronRight, MdContrast, MdAcUnit, MdGroups } from "react-icons/md";
import { cn } from "@/lib/utils/cn";

interface QuizFooterProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  submitting?: boolean;
  currentQuestion?: any;
  selectedAnswers?: any;
  submittedAnswers?: any;

  onPrev: () => void;
  onNext: () => void;
  onSubmit: (data: any) => void;
}

const QuizFooter = ({
  currentQuestionIndex,
  totalQuestions,
  submitting = false,
  currentQuestion,
  selectedAnswers,
  submittedAnswers,
  onPrev,
  onNext,
  onSubmit,
}: QuizFooterProps) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex gap-3">
        {[MdContrast, MdAcUnit, MdGroups].map((Icon, i) => (
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
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
            Potential Reward
          </p>
          <p className="text-2xl font-black text-white">+520 XP</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {currentQuestionIndex > 0 && (
            <button
              onClick={onPrev}
              className="bg-white/5 hover:bg-white/10 text-white px-5 py-4 rounded-[20px] font-black text-xs uppercase tracking-wider transition border border-white/5"
            >
              Prev
            </button>
          )}

          {currentQuestionIndex >= totalQuestions - 1 ? (
            <button
              onClick={onSubmit}
              disabled={submitting}
              className={cn(
                "bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-8 py-4 rounded-[20px]",
                "font-black text-sm uppercase tracking-wider flex items-center gap-3 transition-all transform",
                "hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.3)]",
                submitting && "opacity-60 pointer-events-none",
              )}
            >
              {submitting ? "Submitting..." : "Submit"}
              <MdChevronRight size={24} />
            </button>
          ) : (
            <button
              onClick={() => onSubmit(currentQuestion.id)}
              disabled={submitting}
              className="bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-8 py-4 rounded-[20px] font-black text-sm uppercase tracking-wider flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
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
