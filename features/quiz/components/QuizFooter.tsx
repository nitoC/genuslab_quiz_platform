"use client";

import React from "react";
import { MdChevronRight } from "react-icons/md";
import { cn } from "@/lib/utils/cn";

interface QuizFooterProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  submitting?: boolean;

  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const QuizFooter = ({
  currentQuestionIndex,
  totalQuestions,
  submitting = false,
  onPrev,
  onNext,
  onSubmit,
}: QuizFooterProps) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="mt-12 flex items-center justify-end gap-3">
      {currentQuestionIndex > 0 && (
        <button
          onClick={onPrev}
          className="bg-white/5 hover:bg-white/10 text-(--primary) px-5 py-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors border border-white/5"
        >
          Prev
        </button>
      )}

      {currentQuestionIndex >= totalQuestions - 1 ? (
        <button
          onClick={onSubmit}
          disabled={submitting}
          className={cn(
            "bg-green hover:bg-green/90 text-[#020617] px-8 py-4 rounded-lg",
            "font-bold text-sm uppercase tracking-wider flex items-center gap-3 transition-colors",
            submitting && "opacity-60 pointer-events-none",
          )}
        >
          {submitting ? "Submitting..." : "Submit"}
          <MdChevronRight size={24} />
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={submitting}
          className={cn(
            "bg-green hover:bg-green/90 text-[#020617] px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-wider flex items-center gap-3 transition-colors",
            submitting && "opacity-40 pointer-events-none",
          )}
        >
          {submitting ? "submitting..." : "Next Question"}
          <MdChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default QuizFooter;
