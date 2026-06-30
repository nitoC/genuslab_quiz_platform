import React from "react";

const QuizMatrix = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="border border-slate-100 bg-white rounded-xl p-5 space-y-5 animate-pulse"
        >
          {/* Header Badge Block Shape */}
          <div className="w-10 h-10 bg-slate-200 rounded-lg" />

          {/* Typography Lines Row Blocks */}
          <div className="space-y-2.5 pt-1">
            <div className="h-4 bg-slate-200 rounded-md w-3/4" />
            <div className="h-3 bg-slate-200 rounded-md w-11/12" />
            <div className="h-3 bg-slate-200 rounded-md w-1/2" />
          </div>

          <div className="w-full h-px bg-slate-100 pt-1" />

          {/* Subtext Footer Controls Meta Elements */}
          <div className="flex justify-between items-center pt-1">
            <div className="h-3 bg-slate-200 rounded-md w-12" />
            <div className="h-6 bg-slate-200 rounded-md w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizMatrix;
