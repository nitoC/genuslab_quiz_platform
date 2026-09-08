"use client";

import React from "react";
import { HiOutlineEye } from "react-icons/hi";

interface QuizPreviewProps {
  questions: any[];
  isValid: boolean;
  handlePreview: () => void;
}

export default function QuizPreview({
  questions,
  isValid,
  handlePreview,
}: QuizPreviewProps) {
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 -bottom-10 bg-black/40 backdrop-blur-[2px] z-40" />

      {/* Modal */}
      <section className="fixed inset-4 md:inset-8 z-50 flex items-center justify-center">
        <div className="w-full max-w-7xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {!isValid ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center shadow-sm">
                  <HiOutlineEye className="text-2xl text-slate-400" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-800">
                  Quiz Preview
                </h3>

                <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
                  Validate your JSON above to see a live preview of your quiz
                  questions and answer flow.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <HiOutlineEye className="text-blue-600 text-xl" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      Live Quiz Preview
                    </h3>

                    <p className="text-sm text-slate-500">
                      {questions.length} Question
                      {questions.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Questions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4"
                    >
                      {/* Badge */}
                      <div className="flex justify-between items-center">
                        <span className="text-[14px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          Question {idx + 1}
                        </span>

                        <span className="text-[14px] uppercase text-slate-500 font-semibold">
                          {(q.difficulty || "easy").toUpperCase()}
                        </span>
                      </div>

                      {/* Question */}
                      <h4 className="font-semibold text-slate-900 leading-6">
                        {q.questionText}
                      </h4>

                      {/* Hint */}
                      {q.hint && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-sm text-amber-700">
                            💡 <strong>Hint:</strong> {q.hint}
                          </p>
                        </div>
                      )}

                      {/* Options */}
                      <div className="space-y-2">
                        {q.options?.map(
                          (option: string, optionIndex: number) => (
                            <div
                              key={optionIndex}
                              className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                                optionIndex === q.answer
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold"
                                  : "border-slate-200 bg-white text-slate-700"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span>{option}</span>

                                {optionIndex === q.answer && (
                                  <span className="text-sm font-bold text-emerald-600">
                                    ✓ Correct
                                  </span>
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>

                      {/* Explanation */}
                      {q.answerDescription && (
                        <div className="rounded-lg border border-slate-200 bg-white p-3">
                          <p className="text-sm leading-5 text-slate-600">
                            <span className="font-semibold">Explanation:</span>{" "}
                            {q.answerDescription}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 bg-white p-5">
            <div className="flex justify-end">
              <button
                onClick={handlePreview}
                className="cursor-pointer rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium px-8 py-3"
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
