"use client";

import Link from "next/link";
import React from "react";
import { HiPlusCircle, HiOutlineDocumentText } from "react-icons/hi2";
import { LuFileQuestion } from "react-icons/lu";

interface EmptyQuizStateProps {
  onCreateNew?: () => void;
  onImportBatch?: () => void;
  title?: string;
}

export default function EmptyQuizState({
  //   onCreateNew,
  //   onImportBatch,
  title,
}: EmptyQuizStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-12 px-4 bg-transparent font-sans">
      <div className="w-16 h-16 mb-6 rounded-xl bg-slate-100 flex items-center justify-center">
        <LuFileQuestion className="text-3xl text-slate-500" />
      </div>

      {/* Primary Messaging Stack */}
      <div className="max-w-md mb-8 space-y-3">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          No Quizzes Added Yet
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          Start building by creating your first quiz or importing a batch.
        </p>
      </div>

      {/* Button Action Trigger Container */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
        {/* Create New Quiz Action */}
        <Link
          href={"/genuslab/quizzes/create-quiz"}
          //   onClick={onCreateNew}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold rounded-xl text-sm border border-transparent"
        >
          <HiPlusCircle className="text-lg" />
          Create New Quiz
        </Link>

        {/* Import Batch Action */}
        <Link
          href={"/genuslab/quizzes/create-quiz/json/live"}
          //   onClick={onImportBatch}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm border border-slate-200 transition-colors"
        >
          <HiOutlineDocumentText className="text-lg text-slate-500" />
          Create Batch
        </Link>
      </div>
    </div>
  );
}
