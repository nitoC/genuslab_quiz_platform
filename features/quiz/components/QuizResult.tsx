"use client";

import React from "react";

interface QuizResultProps {
  score: number;
  onRetry: () => void;
  onReview: () => void;
  onDashboard?: () => void;
}

const QuizResult = ({
  score,
  onRetry,
  onReview,
  onDashboard,
}: QuizResultProps) => {
  return (
    <div className="py-10">
      <div className="max-w-xl mx-auto text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-2xl border border-emerald-500/20 text-sm font-black uppercase tracking-widest">
          Completed
        </div>

        {/* Title */}
        <h2 className="mt-6 text-4xl md:text-5xl font-black text-white">
          Your Score
        </h2>

        {/* Score */}
        <p className="mt-4 text-7xl md:text-8xl font-black text-emerald-400">
          {score}%
        </p>

        {/* Message */}
        <p className="mt-4 text-slate-400">Quiz completed successfully.</p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onReview}
            className="bg-white/5 hover:bg-white/10 text-white px-7 py-3 rounded-[18px] font-black text-sm uppercase tracking-wider transition border border-white/5"
          >
            View Answers
          </button>

          <button
            onClick={onRetry}
            className="bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-7 py-3 rounded-[18px] font-black text-sm uppercase tracking-wider transition"
          >
            Try Again
          </button>

          {onDashboard && (
            <button
              onClick={onDashboard}
              className="bg-white/5 hover:bg-white/10 text-white px-7 py-3 rounded-[18px] font-black text-sm uppercase tracking-wider transition border border-white/5"
            >
              Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
