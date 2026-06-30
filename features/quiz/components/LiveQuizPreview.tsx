"use client";

import { QuizObject } from "@/app/genuslab/(dashboard)/quizzes/create-quiz/json/live/page";
import React from "react";
import {
  HiOutlineEye,
  HiOutlineCalendar,
  HiOutlineCollection,
} from "react-icons/hi";

// Explicit interfaces for clean data flow and strict typing
interface Question {
  questionText: string;
  hint?: string;
  options: string[];
  answer: number;
  difficulty?: string;
  answerDescription?: string;
}

interface QuizItem {
  title?: string;
  day?: string;
  episode?: string;
  activeAt?: string;
}

interface QuizPreviewProps {
  quizzes: QuizObject[] | undefined;
  isValid: boolean;
  handlePreview: () => void;
  handleSubmit: () => void;
  submitting: boolean;
}

export default function LiveQuizPreview({
  quizzes = [],
  isValid,
  handlePreview,
  handleSubmit,
  submitting,
}: QuizPreviewProps) {
  // Calculate aggregate question totals safely

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 transition-opacity"
        onClick={handlePreview}
      />

      {/* Modal */}
      <section className="fixed inset-4 md:inset-8 z-50 flex items-center justify-center">
        <div className="w-full max-w-7xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {!isValid || quizzes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                  <HiOutlineEye className="text-2xl text-slate-400" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-800">
                  Quiz Preview Empty
                </h3>

                <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
                  Validate your structural JSON format above to parse your
                  episodes, schedule milestones, and live layout.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Global Sticky-ready Header */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-white -m-6 p-6 mb-4 shadow-sm sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <HiOutlineEye className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">
                        Live Assessment Preview
                      </h3>
                      {/* <p className="text-sm text-slate-500 font-medium">
                        {quizzes.length}{" "}
                        {quizzes.length === 1 ? "Quiz Batch" : "Quiz Batches"} —{" "}
                        {totalQuestions} Total{" "}
                        {totalQuestions === 1 ? "Question" : "Questions"}
                      </p> */}
                    </div>
                  </div>
                </div>

                {/* Iterate through each structural Quiz block */}
                {quizzes.map((quiz, qIdx) => (
                  <div
                    key={qIdx}
                    className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
                  >
                    {/* Meta-Header Block for each specific Episode */}
                    <div className="bg-slate-50 border-b border-slate-200 p-5 grid grid-cols-1 md:flex md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[11px] font-bold tracking-wide rounded-md uppercase">
                            Day {quiz.day || "N/A"}
                          </span>
                          <span className="px-2.5 py-0.5 bg-slate-200 text-slate-800 text-[11px] font-bold tracking-wide rounded-md uppercase">
                            Ep. {quiz.episode || "N/A"}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mt-1">
                          {quiz.title || "Untitled Quiz"}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Component Controls */}
          <div className="border-t border-slate-200 bg-white p-5 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
            <div className="flex justify-end gap-4">
              <button
                onClick={handleSubmit}
                className="cursor-pointer rounded-xl bg-green hover:bg-green-600 active:bg-green-800 transition-colors text-white font-semibold px-8 py-3.5 text-sm tracking-wide shadow-sm"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
              <button
                onClick={handlePreview}
                className="cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors text-white font-semibold px-8 py-3.5 text-sm tracking-wide shadow-sm"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
