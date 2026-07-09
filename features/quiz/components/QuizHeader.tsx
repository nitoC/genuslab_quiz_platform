"use client";

import React from "react";
import { MdLocalFireDepartment } from "react-icons/md";
import { cn } from "@/lib/utils/cn";

interface QuizHeaderProps {
  difficulty?: string;
  currentQuestionIndex: number;
  totalQuestions: number;
}

const QuizHeader = ({
  difficulty,
  currentQuestionIndex,
  totalQuestions,
}: QuizHeaderProps) => {
  const progressSegments = Math.max(1, Math.min(10, totalQuestions || 10));

  const activeSegment = totalQuestions
    ? Math.min(
        progressSegments - 1,
        Math.floor(
          (currentQuestionIndex / Math.max(1, totalQuestions - 1)) *
            (progressSegments - 1),
        ),
      )
    : 0;

  return (
    <div className="flex items-center justify-between mb-12">
      {/* Difficulty */}
      <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
        <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-sm rotate-45" />
        </div>

        <span className="text-slate-300 text-xs font-bold">
          Difficulty:
          <span className="ml-1 capitalize text-emerald-400">
            {difficulty || "Unknown"}
          </span>
        </span>
      </div>

      {/* Progress */}
      <div className="hidden md:flex flex-col items-center gap-2">
        <div className="flex gap-1.5">
          {[...Array(progressSegments)].map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-1.5 w-8 rounded-full transition-all",
                index === activeSegment
                  ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  : "bg-white/10",
              )}
            />
          ))}
        </div>

        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* User Stats */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
          <MdLocalFireDepartment className="text-orange-500 text-lg" />
          <span className="text-white font-bold text-sm">12</span>
        </div>

        <div className="bg-emerald-500/10 text-emerald-500 px-3 py-2 rounded-xl border border-emerald-500/20 text-xs font-black">
          +10 XP
        </div>

        <img
          src="https://i.pravatar.cc/150?u=my"
          alt="avatar"
          className="w-10 h-10 rounded-xl border-2 border-white/10"
        />
      </div>
    </div>
  );
};

export default QuizHeader;
