"use client";

import React from "react";
import {
  HiOutlineCollection,
  HiOutlineDocumentText,
  HiLightningBolt,
} from "react-icons/hi";

interface BatchSummaryProps {
  handlePreview: () => void;
  summary: {
    totalQuizzes: number;
    questionsPerQuiz: number;
    totalCapacity: number;
    titles: string[];
  };
}

export default function BatchSummary({
  summary,
  handlePreview,
}: BatchSummaryProps) {
  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="bg-blue-600 text-white rounded-xl shadow-md overflow-hidden">
        <div className="p-5 bg-blue-700/40">
          <h2 className="text-lg font-bold">Batch Summary</h2>
          <p className="text-xs text-blue-100 mt-0.5">
            {summary.totalQuizzes > 0
              ? `Pending processing of ${summary.totalQuizzes}+ episodes`
              : "No batch loaded"}
          </p>
        </div>

        <div className="p-5 space-y-4 bg-white text-slate-800">
          {/* Total Quizzes Row */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <HiOutlineCollection className="text-blue-600 text-base" />
              <span>Total Quizzes</span>
            </div>
            <span className="text-lg font-bold text-slate-900">
              {summary.totalQuizzes}
            </span>
          </div>

          {/* Questions/Quiz Row */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <HiOutlineDocumentText className="text-blue-600 text-base" />
              <span>Questions / Quiz</span>
            </div>
            <span className="text-lg font-bold text-slate-900">
              {summary.questionsPerQuiz}
            </span>
          </div>

          {/* Capacity Progress Segment */}
          <div className="pt-2">
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
              <span>Total Capacity</span>
              <span className="font-bold text-slate-900">
                {summary.totalCapacity} Questions
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{
                  width: `${Math.min((summary.totalCapacity / 200) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Titles Preview Block */}
          {summary.titles.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                Titles Preview
              </span>
              <ul className="text-xs space-y-1.5 font-medium text-slate-700">
                {summary.titles.slice(0, 3).map((title, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span className="truncate">{title}</span>
                  </li>
                ))}
                {summary.titles.length > 3 && (
                  <li className="text-slate-400 italic pl-3.5">
                    ... and {summary.titles.length - 3} others
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handlePreview}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-blue-200 transition-colors"
      >
        <span>Create and Assign Questions</span>
        <HiLightningBolt className="text-base" />
      </button>
    </div>
  );
}
