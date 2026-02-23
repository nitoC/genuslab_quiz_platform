"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MdVolumeUp,
  MdChevronRight,
  MdLocalFireDepartment,
  MdContrast,
  MdAcUnit,
  MdGroups,
} from "react-icons/md";
import { cn } from "@/lib/utils/cn";
import Layout from "@/components/layouts/Layout";

import useQuestion from "@/hooks/useQuestion";
import useScore from "@/hooks/useScore";
import { useUser } from "@/store/useUser";
import { useSocketError } from "@/hooks/useErrorSocket";
import getSessionStorage from "@/lib/utils/getSessionStorage";
import QuizReviewModal from "@/components/ui/modals/ViewAnswers";
import { toast } from "react-toastify";

type OptionTuple = [string, string];

const formatMMSS = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const getTimerColor = (seconds: number) => {
  if (seconds <= 60) return "text-rose-500";
  if (seconds <= 300) return "text-amber-400";
  return "text-emerald-500";
};

const QuizPage = () => {
  const router = useRouter();
  const { socketId } = useParams<{ socketId: string }>();

  const sid = useUser((s: any) => s.socketId);

  const [quizHandler, setQuizHandler] = useState<any | null>(null);
  const [scoreHandler, setScoreHandler] = useState<any | null>(null);

  const [quizData, setQuizData] = useState<any[] | null>(null);
  const [scoreData, setScoreData] = useState<any[] | null>(null);

  const [userData, setUserData] = useState<any | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [review, setReview] = useState(false);

  // answers map: questionNumber -> optionKey
  const [answers, setAnswers] = useState<Map<number, string>>(new Map());

  // ---- guards / socket errors ----
  useSocketError(socketId as string);

  // Login guard (page-level)
  useEffect(() => {
    const user = getSessionStorage("user");
    if (!user) {
      toast.error("You must be logged in to take this quiz.");
      router.push("/login");
      return;
    }
    try {
      setUserData(JSON.parse(user));
    } catch {
      toast.error("Session error. Please login again.");
      router.push("/login");
    }
  }, [router]);

  // Setup socket handlers
  useEffect(() => {
    if (!socketId) return;

    const qHandler = useQuestion(socketId, sid);
    const sHandler = useScore(socketId);

    console.log(qHandler, "qhandler");

    setQuizHandler(qHandler);
    setScoreHandler(sHandler);

    return () => {
      try {
        if (typeof (qHandler as any)?.handleDisconnect === "function")
          qHandler.handleDisconnect();
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketId, sid]);

  // Connect quiz handler
  useEffect(() => {
    if (!quizHandler) return;
    quizHandler.handleConnection((val: any) => setQuizData(val));
    quizHandler.handleEvent?.();
    return () => {
      quizHandler.handleDisconnect?.();
    };
  }, [quizHandler]);

  // Connect score handler
  useEffect(() => {
    if (!scoreHandler) return;
    const cleanup = scoreHandler.handleConnection((val: any) =>
      setScoreData(val),
    );
    return () => cleanup?.();
  }, [scoreHandler]);

  const totalQuestions = quizData?.length ?? 0;
  const currentQuestion = quizData?.[currentQuestionIndex];

  // normalize options => [key,label][]
  const optionEntries: OptionTuple[] = useMemo(() => {
    if (!currentQuestion?.options) return [];
    if (Array.isArray(currentQuestion.options))
      return currentQuestion.options as OptionTuple[];
    return Object.entries(currentQuestion.options) as OptionTuple[];
  }, [currentQuestion]);

  const answeredKeyForCurrent = useMemo(() => {
    if (!currentQuestion) return null;
    return answers.get(currentQuestion.number) ?? null;
  }, [answers, currentQuestion]);

  const selectedLabelForCurrent = useMemo(() => {
    if (!answeredKeyForCurrent) return null;
    const found = optionEntries.find((o) => o[0] === answeredKeyForCurrent);
    return found ? found[1] : null;
  }, [answeredKeyForCurrent, optionEntries]);

  const handleSelect = (labelOrKey: string) => {
    if (!currentQuestion) return;

    setAnswers((prev) => {
      const next = new Map(prev);

      // match either by label or key
      const found = optionEntries.find(
        (e) => e[1] === labelOrKey || e[0] === labelOrKey,
      );
      const key = found ? found[0] : labelOrKey;

      next.set(currentQuestion.number, key);
      return next;
    });
  };

  const goNext = () => {
    if (!currentQuestion) return;

    if (!answers.has(currentQuestion.number)) {
      toast.info("Select an option before continuing.");
      return;
    }
    setCurrentQuestionIndex((p) =>
      Math.min(p + 1, Math.max(0, (quizData?.length ?? 1) - 1)),
    );
  };

  const goPrev = () => setCurrentQuestionIndex((p) => Math.max(p - 1, 0));

  const retry = () => {
    setAnswers(new Map());
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setSubmitting(false);
    setTimeLeft(300);
    setReview(false);
  };

  const handleSubmit = useCallback(async () => {
    if (!scoreHandler) return;

    const userStr = getSessionStorage("user");
    if (!userStr) {
      toast.error("You must be logged in to submit.");
      router.push("/login");
      return;
    }

    let user: any = null;
    try {
      user = JSON.parse(userStr);
    } catch {
      toast.error("Session error. Please login again.");
      router.push("/login");
      return;
    }

    setSubmitting(true);
    try {
      const payload = Array.from(answers.entries()).map(([number, key]) => ({
        number,
        answer: key,
      }));

      await scoreHandler.handleScore(payload, user?.email, user?.api_key);
      setIsSubmitted(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      toast.error("Failed to submit answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [answers, router, scoreHandler]);

  // Timer effect (auto-submit)
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, handleSubmit]);

  // ---- guards / states ----
  if (!userData) {
    return (
      <Layout type="quiz">
        <div className="min-h-screen flex items-center justify-center p-6 text-slate-200">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!quizHandler) {
    return (
      <Layout type="quiz">
        <div className="min-h-screen flex items-center justify-center p-6 text-slate-200">
          Connecting to quiz...
        </div>
      </Layout>
    );
  }

  if (!quizHandler.isId) {
    return (
      <Layout type="quiz">
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#0f1933] border border-white/5 rounded-[28px] p-8 text-center">
            <p className="text-white font-black text-xl mb-2">Unauthorized</p>
            <p className="text-slate-400 text-sm mb-6">
              You don&apos;t have access to this live quiz room.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-6 py-3 rounded-[16px] font-black text-xs uppercase tracking-wider transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const progressSegments = Math.max(1, Math.min(10, totalQuestions || 10));
  const activeSeg = totalQuestions
    ? Math.min(
        progressSegments - 1,
        Math.floor(
          (currentQuestionIndex / Math.max(1, totalQuestions - 1)) *
            (progressSegments - 1),
        ),
      )
    : 0;

  // timer ring calculations (SVG)
  const totalSeconds = 600;
  const pct = Math.max(0, Math.min(1, timeLeft / totalSeconds));
  const r = 58;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - pct);

  const score =
    scoreData && scoreData.length
      ? (scoreData[scoreData.length - 1]?.your_score ?? 0)
      : 0;

  return (
    <Layout type="quiz">
      {review && (
        <QuizReviewModal
          reviewData={scoreData && scoreData.length ? [...scoreData] : []}
          onClose={() => setReview(false)}
        />
      )}

      <div className="min-h-screen flex items-center justify-center p-4 font-sans selection:bg-emerald-500/30">
        {/* Main Container */}
        <div className="w-full max-w-5xl bg-[#0f1933] rounded-[40px] border border-white/5 p-8 md:p-12 relative overflow-hidden shadow-2xl">
          {/* Top Header Bar */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
              <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-sm rotate-45" />
              </div>
              <span className="text-slate-300 text-xs font-bold tracking-tight">
                Episode: {currentQuestion?.episode ?? 1}
              </span>
            </div>

            {/* Progress Indicators */}
            <div className="hidden md:flex flex-col items-center gap-2">
              <div className="flex gap-1.5">
                {[...Array(progressSegments)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 w-8 rounded-full transition-all",
                      i === activeSeg
                        ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        : "bg-white/10",
                    )}
                  />
                ))}
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                Question{" "}
                {Math.min(
                  currentQuestionIndex + 1,
                  Math.max(1, totalQuestions),
                )}{" "}
                of {Math.max(1, totalQuestions)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                <MdLocalFireDepartment className="text-orange-500 text-lg" />
                <span className="text-white font-bold text-sm">12</span>
              </div>
              <div className="bg-emerald-500/10 text-emerald-500 px-3 py-2 rounded-xl border border-emerald-500/20 text-xs font-black">
                +15 XP
              </div>
              <img
                src="https://i.pravatar.cc/150?u=my"
                className="w-10 h-10 rounded-xl border-2 border-white/10"
                alt="avatar"
              />
            </div>
          </div>

          {!isSubmitted ? (
            <>
              {/* Question Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                        {currentQuestion?.question ?? "Waiting for question..."}
                      </h1>
                      <button className="p-3 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                        <MdVolumeUp size={24} />
                      </button>
                    </div>
                    <p className="text-slate-500 font-medium text-sm md:text-base">
                      Identify the critical hardware component from the elite
                      options below.
                    </p>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {optionEntries.length ? (
                      optionEntries.map(([key, label]) => {
                        const selected =
                          answeredKeyForCurrent === key ||
                          selectedLabelForCurrent === label;

                        return (
                          <div
                            key={key}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ")
                                handleSelect(label);
                            }}
                            onClick={() => !submitting && handleSelect(label)}
                            className={cn(
                              "relative p-6 rounded-[24px] border-2 transition-all cursor-pointer flex items-center justify-between group select-none",
                              selected
                                ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                : "bg-white/[0.03] border-white/5 hover:border-white/10 hover:bg-white/[0.05]",
                            )}
                            aria-pressed={selected}
                            aria-disabled={submitting}
                          >
                            <span
                              className={cn(
                                "font-bold text-base",
                                selected ? "text-white" : "text-slate-400",
                              )}
                            >
                              {label}
                            </span>
                            <div
                              className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                selected
                                  ? "bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                  : "border-slate-700",
                              )}
                            >
                              {selected && (
                                <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white -rotate-45 mb-0.5" />
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-slate-400 text-sm">
                        Loading options…
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                  {/* Timer Widget */}
                  <div className="bg-[#11192e] border border-white/5 rounded-[32px] p-8 flex flex-col items-center justify-center text-center">
                    <div className="relative w-32 h-32 mb-4">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r={r}
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-white/5"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r={r}
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={c}
                          strokeDashoffset={dashOffset}
                          className="text-emerald-500"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span
                          className={cn(
                            "text-2xl font-black",
                            getTimerColor(timeLeft),
                          )}
                        >
                          {formatMMSS(timeLeft)}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          Minutes
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Auto-submit at 00:00
                    </div>
                  </div>

                  {/* Live Rivals Widget (kept UI, static list unless you provide live data later) */}
                  <div className="bg-[#11192e] border border-white/5 rounded-[32px] p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Rivals
                      </h3>
                      <span className="text-rose-500 text-[8px] font-black uppercase">
                        Watch Live
                      </span>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          name: "Alex M.",
                          xp: "12,450 XP",
                          img: "https://i.pravatar.cc/150?u=1",
                        },
                        {
                          name: "Sarah K.",
                          xp: "11,820 XP",
                          img: "https://i.pravatar.cc/150?u=2",
                        },
                        {
                          name: "Chris W.",
                          xp: "10,705 XP",
                          img: "https://i.pravatar.cc/150?u=3",
                        },
                      ].map((rival, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between group cursor-default"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={rival.img}
                              className="w-8 h-8 rounded-lg grayscale group-hover:grayscale-0 transition-all"
                              alt=""
                            />
                            <span className="text-xs font-bold text-slate-300">
                              {rival.name}
                            </span>
                          </div>
                          <span className="text-[10px] font-black text-emerald-500/80">
                            {rival.xp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex gap-3">
                  {[MdContrast, MdAcUnit, MdGroups].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Icon size={20} />
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                      Potential Reward
                    </p>
                    <p className="text-2xl font-black text-white">+520 XP</p>
                  </div>

                  {/* Prev/Next/Submit maintains your CTA style */}
                  <div className="flex items-center gap-3">
                    {currentQuestionIndex > 0 && (
                      <button
                        onClick={goPrev}
                        className="bg-white/5 hover:bg-white/10 text-white px-5 py-4 rounded-[20px] font-black text-xs uppercase tracking-wider transition border border-white/5"
                      >
                        Prev
                      </button>
                    )}

                    {currentQuestionIndex >= (quizData?.length ?? 1) - 1 ? (
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={cn(
                          "bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-8 py-4 rounded-[20px]",
                          "font-black text-sm uppercase tracking-wider flex items-center gap-3 transition-all transform",
                          "hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.3)]",
                          submitting && "opacity-60 pointer-events-none",
                        )}
                      >
                        {submitting ? "Submitting..." : "Submit"}
                        <MdChevronRight size={24} />
                      </button>
                    ) : (
                      <button
                        onClick={goNext}
                        className="bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-8 py-4 rounded-[20px] font-black text-sm uppercase tracking-wider flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
                      >
                        Next Question
                        <MdChevronRight size={24} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Submitted UI (keeps same container vibe)
            <div className="py-10">
              <div className="max-w-xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-2xl border border-emerald-500/20 text-xs font-black uppercase tracking-widest">
                  Completed
                </div>

                <h2 className="mt-6 text-4xl md:text-5xl font-black text-white">
                  Your score
                </h2>

                <p className="mt-4 text-7xl md:text-8xl font-black text-emerald-400">
                  {score}%
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => setReview(true)}
                    className="bg-white/5 hover:bg-white/10 text-white px-7 py-3 rounded-[18px] font-black text-xs uppercase tracking-wider transition border border-white/5"
                  >
                    View answers
                  </button>

                  <button
                    onClick={retry}
                    className="bg-emerald-500 hover:bg-emerald-400 text-[#020617] px-7 py-3 rounded-[18px] font-black text-xs uppercase tracking-wider transition"
                  >
                    Try Again
                  </button>

                  <button
                    onClick={() => router.push("/dashboard")}
                    className="bg-white/5 hover:bg-white/10 text-white px-7 py-3 rounded-[18px] font-black text-xs uppercase tracking-wider transition border border-white/5"
                  >
                    Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Background Decorative Blurs */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/5 blur-[120px] rounded-full" />
        </div>
      </div>
    </Layout>
  );
};

export default QuizPage;
