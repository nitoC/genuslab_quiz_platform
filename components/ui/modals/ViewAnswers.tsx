"use client";

import React, { useMemo } from "react";
import {
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdCheck,
  MdClose as MdX,
  MdInfoOutline,
} from "react-icons/md";
import { cn } from "@/lib/utils/cn";

type OptionTuple = [string, string];

type ReviewItem = {
  number: number;
  question: string;
  options: Record<string, string> | OptionTuple[];

  // Your API shape (most important):
  answer?: string; // ✅ correct option key e.g. "B"
  your_answer?: string; // ✅ user answer (often starts with key) e.g. "B Surge Protector"
  yourAnswer?: string;

  // Optional variants (kept for compatibility)
  correct_answer?: string;
  correctAnswer?: string;
  correct?: string;

  expert_insight?: string;
  expertInsight?: string;
  explanation?: string;

  episode?: number;
  day?: string;
  time?: string;
};

type Props = {
  reviewData: ReviewItem[];
  onClose: () => void;
  episodeLabel?: string;
  dayTimeLabel?: string;
};

function normalizeOptions(
  options: Record<string, string> | OptionTuple[] | undefined,
): OptionTuple[] {
  if (!options) return [];
  if (Array.isArray(options)) return options as OptionTuple[];
  return Object.entries(options) as OptionTuple[];
}

function pickFirstDefined<T>(
  ...vals: Array<T | undefined | null>
): T | undefined {
  return vals.find((v) => v !== undefined && v !== null) as T | undefined;
}

function normalizeKey(k?: string) {
  return (k ?? "").trim().toUpperCase();
}

function firstLetterKey(v?: string | null) {
  return (v ?? "").trim().charAt(0).toUpperCase();
}

export default function QuizReviewModal({
  reviewData,
  onClose,
  episodeLabel,
  dayTimeLabel,
}: Props) {
  // if your array always ends with a summary item, keep this.
  // If not, remove this line.
  const reviewDataFormated = useMemo(
    () => reviewData.slice(0, Math.max(0, reviewData.length - 1)),
    [reviewData],
  );

  const meta = useMemo(() => {
    const first = reviewData?.[0];
    const ep =
      episodeLabel ??
      (first?.episode ? `Episode ${first.episode}` : "Episode 1");

    const dayTime =
      dayTimeLabel ??
      (first?.day || first?.time
        ? `${first?.day ?? ""}${first?.day && first?.time ? " • " : ""}${
            first?.time ?? ""
          }`.trim()
        : "Day 4: 7am – 9am");

    return { ep, dayTime };
  }, [reviewData, episodeLabel, dayTimeLabel]);

  return (
    <div className="fixed inset-0 z-[100]">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* modal shell */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "relative w-full max-w-[980px] overflow-hidden rounded-[26px]",
            "bg-[#0b142a] shadow-[0_40px_120px_rgba(0,0,0,0.55)]",
            "border border-white/5",
          )}
          role="dialog"
          aria-modal="true"
        >
          {/* top bar */}
          <div className="flex items-start justify-between gap-4 px-8 pt-7 pb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                Quiz Review: {meta.ep}
              </h2>
              <p className="mt-1 text-xs text-slate-400">{meta.dayTime}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2",
                  "bg-white/5 hover:bg-white/10 border border-white/5",
                  "text-xs font-bold text-slate-200 transition",
                )}
              >
                ← Back to Results
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-xl",
                  "bg-white/5 hover:bg-white/10 border border-white/5",
                  "text-slate-200 transition",
                )}
              >
                <MdClose size={20} />
              </button>
            </div>
          </div>

          {/* content */}
          <div className="max-h-[78vh] overflow-y-auto px-6 pb-8 md:px-8">
            <div className="space-y-6">
              {reviewDataFormated?.map((q, idx) => {
                const options = normalizeOptions(q.options);

                // ✅ CORRECT KEY:
                // Prefer your API's "answer", fallback to other variants if ever provided.
                const correctKey = normalizeKey(
                  pickFirstDefined(
                    q.answer,
                    q.correct_answer,
                    q.correctAnswer,
                    q.correct,
                  ),
                );

                // ✅ USER KEY:
                // Take first letter from "your_answer" / "yourAnswer" only (never fallback to q.answer).
                const yourKey = normalizeKey(
                  firstLetterKey(pickFirstDefined(q.your_answer, q.yourAnswer)),
                );

                const isCorrect =
                  !!correctKey && !!yourKey && correctKey === yourKey;

                const insight =
                  pickFirstDefined(
                    q.expert_insight,
                    q.expertInsight,
                    q.explanation,
                  ) ?? "";

                return (
                  <div
                    key={q.number ?? idx}
                    className={cn(
                      "rounded-[22px] p-6 md:p-7",
                      "bg-gradient-to-b from-white/[0.05] to-white/[0.02]",
                      "border border-white/5",
                    )}
                  >
                    {/* question header row */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-[11px] font-extrabold tracking-[0.25em] text-cyan-300/90 uppercase">
                          Question{" "}
                          {String(q.number ?? idx + 1).padStart(2, "0")}
                        </div>
                        <h3 className="mt-2 text-lg md:text-xl font-extrabold text-white leading-snug">
                          {q.question}
                        </h3>
                      </div>

                      {/* status pill */}
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 rounded-xl px-4 py-2",
                          "border text-xs font-extrabold",
                          isCorrect
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                            : "bg-rose-500/10 border-rose-500/20 text-rose-300",
                        )}
                      >
                        {isCorrect ? (
                          <>
                            <MdCheckCircle size={16} />
                            Correct
                          </>
                        ) : (
                          <>
                            <MdCancel size={16} />
                            Incorrect
                          </>
                        )}
                      </div>
                    </div>

                    {/* options grid */}
                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                      {options.map(([key, label]) => {
                        const k = normalizeKey(key);
                        const isYourPick = yourKey === k;
                        const isCorrectOpt = correctKey === k;

                        const cardClass = cn(
                          "relative rounded-[16px] px-4 py-4",
                          "border transition",
                          "bg-[#0b142a]/60",
                          isCorrectOpt
                            ? "border-emerald-500/40 shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_0_30px_rgba(16,185,129,0.10)]"
                            : isYourPick && !isCorrectOpt
                              ? "border-rose-500/45 shadow-[0_0_0_1px_rgba(244,63,94,0.10),0_0_26px_rgba(244,63,94,0.10)]"
                              : "border-white/6 hover:border-white/10",
                        );

                        const badgeClass = cn(
                          "grid h-7 w-7 place-items-center rounded-full text-[11px] font-extrabold",
                          isCorrectOpt
                            ? "bg-emerald-500/20 text-emerald-300"
                            : isYourPick && !isCorrectOpt
                              ? "bg-rose-500/20 text-rose-300"
                              : "bg-white/6 text-slate-400",
                        );

                        return (
                          <div key={key} className={cardClass}>
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={badgeClass}>{k}</div>
                                <div className="min-w-0">
                                  <div
                                    className={cn(
                                      "text-sm font-bold truncate",
                                      isCorrectOpt || isYourPick
                                        ? "text-white"
                                        : "text-slate-300",
                                    )}
                                  >
                                    {label}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {isCorrectOpt && (
                                  <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500/20 text-emerald-300">
                                    <MdCheck size={18} />
                                  </span>
                                )}
                                {isYourPick && !isCorrectOpt && (
                                  <span className="grid h-7 w-7 place-items-center rounded-full bg-rose-500/20 text-rose-300">
                                    <MdX size={18} />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* expert insight */}
                    {insight ? (
                      <div
                        className={cn(
                          "mt-5 rounded-[18px] p-5",
                          "bg-white/[0.03] border border-white/5",
                        )}
                      >
                        <div className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.22em] uppercase text-cyan-300/90">
                          <MdInfoOutline size={16} className="opacity-90" />
                          Expert Insight
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-slate-300/90">
                          {insight}
                        </p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0b142a] to-transparent" />
        </div>
      </div>
    </div>
  );
}
