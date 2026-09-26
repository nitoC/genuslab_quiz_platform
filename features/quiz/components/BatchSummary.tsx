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
          <p className="text-sm text-blue-100 mt-0.5">
            {summary.totalQuizzes > 0
              ? `Pending processing of ${summary.totalQuizzes}+ episodes`
              : "No batch loaded"}
          </p>
        </div>

        <div className="p-5 space-y-4 bg-white text-slate-800">
          {/* Total Quizzes Row */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <HiOutlineCollection className="text-blue-600 text-base" />
              <span>Total Quizzes</span>
            </div>
            <span className="text-lg font-bold text-slate-900">
              {summary.totalQuizzes}
            </span>
          </div>

          {/* Questions are optional per quiz. */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <HiOutlineDocumentText className="text-blue-600 text-base" />
              <span>Questions attached</span>
            </div>
            <span className="text-lg font-bold text-slate-900">
              {summary.totalCapacity}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {summary.totalCapacity
              ? "Quizzes with questions start as Upcoming; any without stay Drafts."
              : "No questions attached: quizzes will be saved as Drafts. Add questions to each afterwards."}
          </p>

          {/* Titles Preview Block */}
          {summary.titles.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[14px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                Titles Preview
              </span>
              <ul className="text-sm space-y-1.5 font-medium text-slate-700">
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
        <span>Review and Create Quizzes</span>
        <HiLightningBolt className="text-base" />
      </button>
    </div>
  );
}
