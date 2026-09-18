"use client";

import { MdChevronRight } from "react-icons/md";
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
    <div className="mt-12 flex items-center justify-end gap-3">
      {currentQuestionIndex > 0 && (
        <button
          onClick={onPrev}
          disabled={submitting}
          className="bg-white/5 hover:bg-white/10 text-(--primary) px-5 py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors border border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
      )}

      {currentQuestionIndex >= totalQuestions - 1 ? (
        <button
          onClick={() => onSubmit(currentQuestion?.id)}
          disabled={submitting}
          className={cn(
            "px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center gap-3 transition-colors",
            "bg-red hover:bg-red/90 text-[#020617]",
            "disabled:bg-white/5 disabled:text-grey disabled:border disabled:border-white/10 disabled:cursor-not-allowed",
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
            "px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center gap-3 transition-colors",
            "bg-green hover:bg-green/90 text-[#020617]",
            "disabled:bg-white/5 disabled:text-grey disabled:border disabled:border-white/10 disabled:cursor-not-allowed",
          )}
        >
          {submitting ? "Submitting..." : "Next Question"}
          <MdChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default QuizFooter;
