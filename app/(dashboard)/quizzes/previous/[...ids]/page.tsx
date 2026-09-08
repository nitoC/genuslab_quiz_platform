"use client";

import { Suspense } from "react";

import { cn } from "@/lib/utils/cn";
import Layout from "@/components/layouts/Layout";
import Link from "next/link";
import {
  MdArrowBack,
  MdCancel,
  MdCheckCircle,
  MdEmojiEvents,
  MdInfo,
  MdReplay,
} from "react-icons/md";
import Header from "@/components/layouts/Header";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAttemptsAnswers } from "@/lib/api/apis";
import GlassCard from "@/components/ui/cards/GlassCard";
import { format } from "date-fns";

// Interfaces for structured type-safety matching review properties
interface OptionReview {
  letter: string;
  text: string;
}

interface QuestionReviewData {
  id: string;
  questionNumber: string;
  questionText: string;
  options: OptionReview[];
  userAnswerLetter: string;
  correctAnswerLetter: string;
  isCorrect: boolean;
  insightText?: string;
}

// Simulated dynamic dataset extracted directly from the design mockup parameters
const MOCK_REVIEW_DATA: QuestionReviewData[] = [
  {
    id: "q-01",
    questionNumber: "Question 01",
    questionText:
      "Which device protects the computer from power surges and provides temporary power during an outage?",
    isCorrect: true,
    userAnswerLetter: "B",
    correctAnswerLetter: "B",
    insightText:
      "A UPS provides both surge protection and battery backup. While a standard surge protector only handles voltage spikes, the UPS ensures the computer stays running long enough for a safe shutdown during a total power loss.",
    options: [
      { letter: "A", text: "Voltage Regulator" },
      { letter: "B", text: "Uninterruptible Power Supply (UPS)" },
      { letter: "C", text: "Surge Protector" },
      { letter: "D", text: "Circuit Breaker" },
    ],
  },
  {
    id: "q-02",
    questionNumber: "Question 02",
    questionText: "What is the primary function of the CPU's Control Unit?",
    isCorrect: false,
    userAnswerLetter: "A",
    correctAnswerLetter: "B",
    options: [
      { letter: "A", text: "Perform arithmetic calculations" },
      { letter: "B", text: "Direct the operation of the processor" },
      { letter: "C", text: "Store permanent system data" },
      { letter: "D", text: "Manage the computer's physical cooling" },
    ],
  },
];

const QuizReviewPage = () => {
  const { ids } = useParams();
  const router = useRouter();
  // console.log(param, "params");
  const attemptId = ids?.[0];
  const detailsId = ids?.[1];

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["quiz answers", attemptId, detailsId],
    queryFn: async () => {
      const res = await getAttemptsAnswers(detailsId ?? "", attemptId ?? "");
      console.log(res, "answers");
      return res?.data?.payload;
    },
  });
  if (!data || isLoading) return <p> loading.. </p>;
  const { quizAnswers, userDetailsId, quiz } = data;

  return (
    <>
      <Layout>
        <Header title="Quiz questions results" backBtn={false} />
        <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 font-sans selection:bg-emerald-500/30 text-white relative">
          <div className="w-full max-w-5xl bg-[#090f1f] rounded-[24px] sm:rounded-[40px] border border-white/5 p-4 sm:p-6 md:p-12 relative overflow-hidden shadow-2xl space-y-8">
            {/* Header Action Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Quiz Review
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Analyze your attempt performance and read core concept
                  insights.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/dashboard"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 rounded-xl font-bold text-sm transition-all"
                >
                  <MdArrowBack size={18} />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => router.push("/quizzes")}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.2)] transition-all"
                >
                  <MdReplay size={18} />
                  <span>Retry Quiz</span>
                </button>
              </div>
            </div>

            {/* Questions Review Stack */}
            <div className="space-y-12">
              {quizAnswers &&
                quizAnswers.map((item: any) => (
                  <div
                    key={item.id}
                    className="relative bg-[#0f1933] rounded-[24px] border border-white/5 p-5 sm:p-8 space-y-6 shadow-xl"
                  >
                    {/* Question Status Banner */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm sm:text-sm text-sky-400 font-bold uppercase tracking-wider">
                        {item.questionNumber}
                      </span>

                      {item.isCorrect ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
                          <MdCheckCircle size={16} />
                          <span>Correct</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-sm font-bold">
                          <MdCancel size={16} />
                          <span>Incorrect</span>
                        </div>
                      )}
                    </div>

                    {/* Question Core Text */}
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-100 leading-snug">
                      {item?.question?.questionText}
                    </h2>

                    {/* Contextualized Options Mapping */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {item?.question?.options.map(
                        (opt: string, index: number) => {
                          const isUserChoice = item.selectedAnswer === index;
                          const isCorrectChoice =
                            item.question.answer === index;

                          return (
                            <div
                              key={index + 1}
                              className={cn(
                                "relative flex items-center gap-4 p-4 rounded-xl border transition-all text-sm sm:text-base font-semibold",
                                // Correct Choice configuration states
                                isCorrectChoice &&
                                  "bg-emerald-500/5 border-emerald-500 text-slate-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
                                // Wrong User Choice state
                                isUserChoice &&
                                  !isCorrectChoice &&
                                  "bg-red-500/5 border-red-500/80 text-slate-100",
                                // Unselected static default states
                                !isCorrectChoice &&
                                  !isUserChoice &&
                                  "bg-white/[0.02] border-white/5 text-slate-400 opacity-60",
                              )}
                            >
                              {/* Selector Letter Ring Indicator */}
                              <div
                                className={cn(
                                  "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors",
                                  isCorrectChoice &&
                                    "bg-emerald-500 text-slate-900",
                                  isUserChoice &&
                                    !isCorrectChoice &&
                                    "bg-red-500 text-white",
                                  !isCorrectChoice &&
                                    !isUserChoice &&
                                    "bg-white/5 border border-white/10 text-slate-400",
                                )}
                              >
                                {index + 1}
                              </div>

                              {/* Text Label */}
                              <span className="flex-1 break-words">{opt}</span>

                              {/* Inline Status Icon Triggers */}
                              {isCorrectChoice && (
                                <MdCheckCircle
                                  size={20}
                                  className="text-emerald-400 flex-shrink-0"
                                />
                              )}
                              {isUserChoice && !isCorrectChoice && (
                                <MdCancel
                                  size={20}
                                  className="text-red-400 flex-shrink-0"
                                />
                              )}

                              {/* Visual Segment Separator Dot Ring Matchers from the Mockup */}
                              {isUserChoice && (
                                <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#090f1f] border-4 border-pink-500 flex items-center justify-center z-10 hidden md:flex" />
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>

                    {/* Expert Insight Panel Block */}
                    {item?.question?.answerDescription && (
                      <div className="flex gap-4 p-4 sm:p-5 bg-[#0a1226] border border-sky-500/10 rounded-2xl text-slate-300">
                        <MdInfo
                          size={24}
                          className="text-sky-400 flex-shrink-0 mt-0.5"
                        />
                        <div className="space-y-1">
                          <h4 className="text-sm sm:text-sm font-black uppercase tracking-wider text-sky-400">
                            Description
                          </h4>
                          <p className="text-sm sm:text-sm font-medium leading-relaxed text-slate-400">
                            {item.question.answerDescription}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Floating Glass Button for Winners */}

          <Link
            href={`/quizzes/previous/leaderboard?date=${format(quiz?.activeDate, "dd-MM-yyyy")}&episode=${quiz?.episode}`}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full bg-blue-900/60 text-white-300 font-bold text-sm hover:bg-amber-500/20 hover:text-white-200 hover:scale-105 active:scale-95 transition-all duration-300 group"
          >
            <div className="p-1.5 rounded-full bg-white-500/20 border border-blue-500/30 text-white group-hover:bg-blue-500 group-hover:text-slate-900 transition-colors">
              <MdEmojiEvents size={20} />
            </div>
            <span className="tracking-wide">Winners</span>
          </Link>
        </div>
      </Layout>
    </>
  );
};

const PreviousQuizzes = () => {
  return (
    <Suspense fallback={<p>...loading content</p>}>
      <QuizReviewPage />
    </Suspense>
  );
};

export default PreviousQuizzes;
