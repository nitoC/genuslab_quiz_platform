"use client";

import { useCallback, useState } from "react";
import { MdTimer } from "react-icons/md";
// import { cn } from "@/lib/utils/cn";
import { MdVolumeUp, MdLocalFireDepartment } from "react-icons/md";
import { cn } from "@/lib/utils/cn";
import Layout from "@/components/layouts/Layout";

// import QuizReviewModal from "@/components/ui/modals/ViewAnswers";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import {
  getQuizSession,
  getUserDetails,
  submitAttempt,
  submitLiveQuestion,
} from "@/lib/api/apis";
import QuizOptions from "@/features/quiz/components/QuizOptions";
import Timer from "@/features/quiz/components/QuizTimer";
import Rivals from "@/features/quiz/components/QuizRivals";
import LiveQuizFooter from "@/features/quiz/components/LiveQuizFooter";
import SubmitUI from "@/features/quiz/components/SubmitUI";
import QuizSkeleton from "@/features/quiz/components/skeletons/QuizSkeleton";
import CalculatingScore from "@/features/quiz/components/CalculatingScore";
import { formatMMSS } from "@/lib/utils/timer";
import { useQuizCountdownTime } from "@/hooks/useTime";
import { useTimeStore } from "@/features/quiz/store/time.store";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import getLocalStorage from "@/lib/utils/getLocalStorage";
import ActiveSessionModal from "@/features/quiz/components/modals/SessionConflict";
import SessionFailureModal from "@/features/quiz/components/modals/SessionError";

// Data Structure interface matching your real JSON payload
interface QuizQuestion {
  id: string;
  questionText: string;
  difficulty: string;
  rankId: string;
  options: string[];
  hint: string;
}

interface IQuizData {
  activeAt: string;
  createdAt: string;
  day: number;
  episode: number;
  id: string;
  status: string;
  title: string;
  questions: QuizQuestion[];
}

const speedCalc = (startTime: number, endTime: number) => {
  const diffMs = endTime - startTime;
  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const s = `${minutes}m: ${seconds}s`;
  console.log(s);
  return s;
};

const QuizPage = () => {
  const router = useRouter();
  const { quizId } = useParams();
  const { resetTime: setTime } = useTimeStore((state) => state);
  const [speed, setspeed] = useState("_min: _sec");

  const {
    data: queryResponse,
    isLoading,
    refetch,
    error,
    isError,
  } = useQuery<{
    data: IQuizData & { attemptId: string };
    userDetailsId: string;
  }>({
    queryKey: ["initiate quiz"],
    queryFn: async () => {
      const userStr = getLocalStorage("user");
      if (!userStr) {
        toast.error("user not found");
        throw new Error("user not found");
      }
      if (!quizId) {
        router.back();
        toast.error("quiz id not found");
        throw new Error("user not found");
      }
      const { userId } = JSON.parse(userStr);
      const userDetails = await getUserDetails(userId);
      if (!userDetails) {
        toast.error("user not logged in");
        router.push("/login");
      }
      const quizIdStr = Array.isArray(quizId) ? quizId[0] : quizId;
      const res = await getQuizSession(
        quizIdStr,
        userDetails?.data?.payload?.id,
      );
      return {
        data: res.data?.payload,
        userDetailsId: userDetails?.data?.payload?.id,
      };
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });

  const data = queryResponse?.data;
  const userDetailsId = queryResponse?.userDetailsId;
  const attemptId = data?.attemptId;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    { id: string; answer: number }[]
  >([]);
  const [submittedAnswers, setSubmittedAnswers] = useState<
    { id: string; answer: number }[]
  >([]);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [xp, setXp] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const totalQuestions = data?.questions?.length ?? 0;
  const currentQuestion = data?.questions?.[currentQuestionIndex];

  const chooseAnswer = (id: string, answer: number) => {
    const dup = [...selectedAnswers];
    const isInRecord = dup.find((a) => a && a.id === id);

    if (isInRecord) {
      const updated = selectedAnswers.map((a) => {
        return a.id === id ? { id: a.id, answer: answer } : a;
      });
      setSelectedAnswers(updated);
    } else {
      dup.push({ id, answer });
      setSelectedAnswers(dup);
    }
  };

  const goNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const goPrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [currentQuestionIndex]);

  const handleQuestionSubmit = useCallback(
    async (id: string) => {
      if (submitting) return;

      const selectedAnswer = selectedAnswers.find((a) => a.id === id);
      const pastSubmission = submittedAnswers.find((a) => a.id === id);

      const needsSubmission =
        !pastSubmission ||
        (selectedAnswer && selectedAnswer.answer !== pastSubmission.answer);

      if (!needsSubmission) {
        goNext();
        return;
      }
      try {
        setSubmitting(true);
        const res = await submitLiveQuestion({
          questionId: id,
          attemptId: attemptId,
          selectedAnswer: selectedAnswer?.answer ?? -1,
        });

        if (res) {
          setSubmittedAnswers((prev) => {
            const filtered = prev.filter((a) => a.id !== id);
            return [
              ...filtered,
              {
                id: id,
                answer: selectedAnswer?.answer ?? -1,
              },
            ];
          });
          goNext();
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      } catch (err: any) {
        toast.error("Failed to submit answer. Check your network connection.");
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, selectedAnswers, submittedAnswers, attemptId, goNext],
  );

  const handleAttemptSubmit = useCallback(
    async (id: string) => {
      if (submitting) return;

      const selectedAnswer = selectedAnswers.find((a) => a.id === id);

      try {
        setSubmitting(true);
        const res = await submitAttempt(userDetailsId as string, {
          questionId: id,
          attemptId: attemptId,
          selectedAnswer: selectedAnswer?.answer ?? -1,
        });

        if (res) {
          setSubmittedAnswers((prev) => {
            const filtered = prev.filter((a) => a.id !== id);
            return [
              ...filtered,
              {
                id: id,
                answer: selectedAnswer?.answer ?? -1,
              },
            ];
          });
          setIsSubmitted(true);
          setScore(res.data.score);
          setXp(res.data.experience);
          setspeed(res.data.timeStr);
        }
      } catch (err: any) {
        toast.error("Failed to submit answer. Check your network connection.");
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, selectedAnswers, submittedAnswers, attemptId, goNext],
  );

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

  if (isLoading) {
    return <QuizSkeleton />;
  }

  if (isError || !data?.questions || totalQuestions === 0) {
    const status = (error as any)?.response?.status;
    console.log((error as any)?.response, "error res");
    if (status === 409) {
      return (
        <Layout type="quiz">
          <ActiveSessionModal />
        </Layout>
      );
    }
    return (
      <Layout type="quiz">
        <SessionFailureModal onRetry={refetch} />
      </Layout>
    );
  }

  return (
    <Layout type="quiz">
      <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 font-sans selection:bg-emerald-500/30">
        {/* Main Container - Adjusted padding dynamically for mobile screen efficiency */}
        <div className="w-full max-w-5xl bg-[#0f1933] rounded-[24px] sm:rounded-[40px] border border-white/5 p-4 sm:p-6 md:p-12 relative overflow-hidden shadow-2xl">
          {!isSubmitted ? (
            <>
              <section>
                <MobileQuizHeader
                  isLoading={isLoading}
                  isSubmitted={isSubmitted}
                  isError={isError}
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={totalQuestions}
                />
              </section>
              <section>
                <QuizHeader
                  currentQuestion={currentQuestion}
                  currentQuestionIndex={currentQuestionIndex}
                  totalQuestions={totalQuestions}
                  progressSegments={progressSegments}
                  activeSeg={activeSeg}
                />
              </section>

              {/* Question Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      {/* Fluid scale applied to question text from text-xl up to text-4xl */}
                      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-snug break-words flex-1">
                        {currentQuestion?.questionText ??
                          "Waiting for question..."}
                      </h1>
                      {/* <button className="p-2.5 sm:p-3 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors flex-shrink-0 mt-1">
                        <MdVolumeUp size={20} className="sm:w-6 sm:h-6" />
                      </button> */}
                    </div>
                    {/* Adjusted inline hint text parameters for mobile layouts */}
                    <p className="text-slate-500 font-medium text-xs sm:text-sm md:text-base leading-relaxed">
                      Hint: {currentQuestion?.hint}
                    </p>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {currentQuestion?.options &&
                    currentQuestion.options.length ? (
                      currentQuestion.options.map((label, index) => {
                        const selected =
                          selectedAnswers.find(
                            (a) => a.id === currentQuestion.id,
                          )?.answer === index;

                        return (
                          <QuizOptions
                            key={label}
                            index={index}
                            currId={currentQuestion.id}
                            handleSelect={chooseAnswer}
                            label={label}
                            selected={selected}
                            submitting={submitting}
                          />
                        );
                      })
                    ) : (
                      <div className="text-slate-400 text-xs sm:text-sm">
                        Loading options…
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6 hidden md:block">
                  <Timer
                    isLoading={isLoading}
                    isSubmitted={isSubmitted}
                    isError={isError}
                    handleSubmit={handleAttemptSubmit}
                    currentQuestion={currentQuestion}
                  />
                  <Rivals />
                </div>
              </div>

              <LiveQuizFooter
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                submitting={submitting}
                currentQuestion={currentQuestion}
                onPrev={goPrev}
                onNext={handleQuestionSubmit}
                onSubmit={handleAttemptSubmit}
              />
            </>
          ) : isReady ? (
            <SubmitUI
              router={router}
              score={score}
              timeTaken={speed}
              resetTime={setTime}
              type="live"
              exp={xp}
              // quizId={quizId}
              did={userDetailsId ? userDetailsId : ""}
              attemptId={attemptId}
            />
          ) : (
            <CalculatingScore onComplete={() => setIsReady(true)} />
          )}
        </div>
      </div>
    </Layout>
  );
};

// Child components

const QuizHeader = ({
  currentQuestion,
  progressSegments,
  currentQuestionIndex,
  totalQuestions,
  activeSeg,
}: {
  currentQuestion: any;
  currentQuestionIndex: number;
  totalQuestions: number;
  progressSegments: number;
  activeSeg: number;
}) => {
  return (
    <>
      {/* Changed mb-12 to a fluid mb-6 md:mb-12 to scale spatial bounds down cleanly on small screens */}
      <div className="flex items-center justify-between mb-6 md:mb-12 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 bg-white/5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border border-white/5">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded flex items-center justify-center flex-shrink-0">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-sm rotate-45" />
          </div>
          <span className="text-slate-300 text-[10px] sm:text-xs font-bold tracking-tight whitespace-nowrap">
            Difficulty:{" "}
            <span className="capitalize text-emerald-400">
              {currentQuestion?.difficulty}
            </span>
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
            {Math.min(currentQuestionIndex + 1, Math.max(1, totalQuestions))} of{" "}
            {Math.max(1, totalQuestions)}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* <div className="flex items-center gap-1 sm:gap-2 bg-white/5 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-white/5">
            <MdLocalFireDepartment className="text-orange-500 text-base sm:text-lg" />
            <span className="text-white font-bold text-xs sm:text-sm">12</span>
          </div> */}
          <div className="bg-emerald-500/10 text-emerald-500 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-emerald-500/20 text-[10px] sm:text-xs font-black whitespace-nowrap">
            +10 XP
          </div>
          <img
            src="https://i.pravatar.cc/150?u=my"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-white/10 flex-shrink-0"
            alt="avatar"
          />
        </div>
      </div>
    </>
  );
};

interface MobileQuizHeaderProps {
  isLoading: boolean;
  isSubmitted: boolean;
  isError: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export const MobileQuizHeader = ({
  currentQuestionIndex,
  totalQuestions,
  isSubmitted,
  isLoading,
  isError,
}: MobileQuizHeaderProps) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const timeLeft = useQuizCountdownTime(isSubmitted, isLoading, isError);

  return (
    <div className="md:hidden sticky top-0 z-40 bg-[#0f1933]/90 backdrop-blur-md -mx-4 -mt-4 mb-4">
      {/* Optimized wrapper container layout context for touch interaction efficiency */}
      <div className="px-4 py-3 sm:py-4">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div>
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-slate-500 font-bold">
              Question
            </p>
            <h2 className="text-base sm:text-lg font-black text-white">
              {currentQuestionIndex + 1}
              <span className="text-slate-500 font-semibold text-sm">
                /{totalQuestions}
              </span>
            </h2>
          </div>

          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border transition-all",
              timeLeft <= 60
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
            )}
          >
            <MdTimer className="text-base sm:text-lg" />
            <span className="font-black text-sm sm:text-base">
              {formatMMSS(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] sm:text-xs">
            <span className="text-slate-400">Quiz Progress</span>
            <span className="font-bold text-white">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
