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
  getDemoQuestions,
  getDemoResult,
  getQuizSession,
  getUserDetails,
  submitLiveQuestion,
} from "@/lib/api/apis";
import QuizOptions from "@/features/quiz/components/QuizOptions";
import Timer from "@/features/quiz/components/QuizTimer";
import Rivals from "@/features/quiz/components/QuizRivals";
import QuizFooter from "@/features/quiz/components/QuizFooter";
import SubmitUI from "@/features/quiz/components/SubmitUI";
import QuizSkeleton from "@/features/quiz/components/skeletons/QuizSkeleton";
import CalculatingScore from "@/features/quiz/components/CalculatingScore";
import { formatMMSS } from "@/lib/utils/timer";
import { useQuizCountdownTime } from "@/hooks/useTime";
import { useTimeStore } from "@/features/quiz/store/time.store";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import getLocalStorage from "@/lib/utils/getLocalStorage";

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

// const formatMMSS = (s: number) => {
//   const m = Math.floor(s / 60);
//   const sec = s % 60;
//   return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
// };

// const getTimerColor = (seconds: number) => {
//   if (seconds <= 60) return "text-rose-500";
//   if (seconds <= 300) return "text-amber-400";
//   return "text-emerald-500";
// };

const speedCalc = (startTime: number, endTime: number) => {
  // 1. Get total difference in milliseconds
  const diffMs = endTime - startTime;

  // 2. Convert to total seconds
  const totalSeconds = Math.floor(diffMs / 1000);

  // 3. Extract minutes and remaining seconds
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const s = `${minutes}m: ${seconds}s`;
  // 4. Print the result
  console.log(s);
  // Output: "3min: 5sec"
  return s;
};

const QuizPage = () => {
  const router = useRouter();
  const { quizId } = useParams();
  const { resetTime: setTime } = useTimeStore((state) => state);
  const [speed, setspeed] = useState("_min: _sec");
  // setTime();
  // 1. Fetching logic using React Query
  const { data, isLoading, refetch, error, isError } = useQuery<IQuizData>({
    queryKey: ["initiate quiz"],
    queryFn: async () => {
      const userStr = getLocalStorage("user");
      console.log(userStr, "user");
      if (!userStr) {
        // router.push("/");
        toast.error("user not found");
        throw new Error("user not found");
      }
      if (!quizId) {
        router.back();
        toast.error("quiz id not found");
        throw new Error("user not found");
      }
      const { userId } = JSON.parse(userStr);
      console.log(userId, "user id");
      const userDetails = await getUserDetails(userId);
      console.log(userDetails.data.payload.id, "details");
      const quizIdStr = Array.isArray(quizId) ? quizId[0] : quizId;
      const res = await getQuizSession(
        quizIdStr,
        userDetails?.data?.payload?.id,
      );
      console.log(res);
      return res.data?.payload; // Added fallbacks based on response mapping structures
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });

  // 2. Functional States
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

  // const [review, setReview] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const totalQuestions = data?.questions?.length ?? 0;
  const currentQuestion = data?.questions?.[currentQuestionIndex];

  //custom handleSelect

  const chooseAnswer = (id: string, answer: number) => {
    const dup = [...selectedAnswers];

    console.log({ id, answer }, "option");
    const isInRecord = dup.find((a, b) => a && a.id === id);

    if (isInRecord) {
      const updated = selectedAnswers.map((a, b) => {
        console.log(a.id, "a id");
        console.log(id, "the id");
        return a.id === id ? { id: a.id, answer: answer } : a;
      });
      setSelectedAnswers(updated);
    } else {
      dup.push({ id, answer });
      setSelectedAnswers(dup);
    }
    console.log(selectedAnswers, "answers");
  };

  // 4. Handle Option Selection
  // const handleSelect = (optionLabel: string) => {
  //   if (!currentQuestion) return;
  //   console.log(selectedAnswers, "selected answers");
  //   setSelectedAnswers((prev) => ({
  //     ...prev,
  //     [currentQuestion.id]: optionLabel,
  //   }));
  // };

  // 5. Navigation & Submission Actions
  const goNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const goPrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleQuestionSubmit = useCallback(
    async (data: any) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        console.log(selectedAnswers, "in handlesubmit");
        const res = await submitLiveQuestion({
          questionId: data.id,
          attemptId: data?.attemptId,
          selectedAnswer: data.selectedAnswer,
        });
        if (res) {
          setSubmittedAnswers((prev) => [
            ...prev,
            {
              id: data.id,
              answer: data.selectedAnswer,
            },
          ]);
          // selectedAnswers.map((a) => ({
          //   questionId: a.id,
          //   answer: a.answer,
          // }));
        }

        //   @IsString()
        // attemptId!: string;

        // @IsString()
        // questionId!: string;

        // @IsInt()
        // selectedAnswer?: number;
        console.log(res.data.percentage, "submit data");
        const s = speedCalc(res?.data?.startTime, res?.data?.endTime);
        setScore(res.data?.percentage);
        setspeed(s);

        setIsSubmitted(true);
        toast.success("Quiz completed!");
      } catch (err) {
        toast.error("Failed to submit answers.");
      } finally {
        setSubmitting(false);
      }
    },
    [selectedAnswers],
  );

  const retry = (func: () => void) => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    // setTimeLeft(600);
    func();
    refetch();
    setIsSubmitted(false);
    setScore(0);
  };
  // console.log(setTime, "settime");

  // 6.  Progress Segments Calculations
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

  //   if (isError) {
  //   const status = (error as any)?.response?.status;

  //   return <div>Something went wrong</div>;
  // }

  if (isError || !data?.questions || totalQuestions === 0) {
    const status = (error as any)?.response?.status;
    if (status === 409) {
      return (
        <Layout type="quiz">
          <div className="flex justify-center items-center">
            <div className="text-gray-300 flex flex-col gap-2 max-w-400 p-4">
              You already have an active quiz session.
              <Link
                href={"/dashboard"}
                className="bg-red-600 text-center text-sm cursor-pointer rounded-2xl text-white px-4 py-2"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </Layout>
      );
    }
    return (
      <Layout type="quiz">
        <div className="min-h-screen flex items-center justify-center text-gray-200 font-sans font-bold">
          Failed to load questions. Please try again.
        </div>
      </Layout>
    );
  }

  return (
    <Layout type="quiz">
      {/* {review && (
        <QuizReviewModal
          reviewData={questions.map((q) => ({
            question: q.questionText,
            selected: selectedAnswers[q.id] || "No Answer",
            hint: q.hint,
          }))}
          onClose={() => setReview(false)}
        />
      )} */}

      <div className="min-h-screen flex items-center justify-center p-4 font-sans selection:bg-emerald-500/30">
        {/* Main Container */}
        <div className="w-full max-w-5xl bg-[#0f1933] rounded-[40px] border border-white/5 p-8 md:p-12 relative overflow-hidden shadow-2xl">
          {!isSubmitted ? (
            <>
              {/* Top Header Bar */}
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                        {currentQuestion?.questionText ??
                          "Waiting for question..."}
                      </h1>
                      <button className="p-3 bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                        <MdVolumeUp size={24} />
                      </button>
                    </div>
                    <p className="text-slate-500 font-medium text-sm md:text-base">
                      Hint: {currentQuestion?.hint}
                    </p>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentQuestion?.options &&
                    currentQuestion.options.length ? (
                      currentQuestion.options.map((label, index) => {
                        const selected =
                          selectedAnswers.find(
                            (a) => a.id === currentQuestion.id,
                          )?.answer === index;

                        // console.log();

                        // console.log(currentQuestion.id, "keys");
                        // console.log(id, 'keys');

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
                      <div className="text-slate-400 text-sm">
                        Loading options…
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6 hidden md:block">
                  {/* Timer Widget */}
                  <Timer
                    isLoading={isLoading}
                    isSubmitted={isSubmitted}
                    isError={isError}
                    handleSubmit={handleSubmit}
                  />
                  {/* Live Rivals Widget */}
                  <Rivals />
                </div>
              </div>

              {/* Footer Actions */}
              <QuizFooter
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                submitting={submitting}
                onPrev={goPrev}
                onNext={goNext}
                onSubmit={handleSubmit}
              />
            </>
          ) : /* Submitted UI */
          isReady ? (
            <SubmitUI
              router={router}
              score={score}
              timeTaken={speed}
              resetTime={setTime}
              // retry={retry}
              // setReview={() => {
              //   router.refresh();
              // }}
              // retry={retry}
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
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-sm rotate-45" />
          </div>
          <span className="text-slate-300 text-xs font-bold tracking-tight">
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

// const formatMMSS = (seconds: number) => {
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;

//   return `${mins.toString().padStart(2, "0")}:${secs
//     .toString()
//     .padStart(2, "0")}`;
// };

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
    <div className="md:hidden sticky top-0 z-40 ">
      <div className="px-4 py-4">
        {/* Top Row */}

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-bold">
              Question
            </p>

            <h2 className="text-lg font-black text-white">
              {currentQuestionIndex + 1}
              <span className="text-slate-500 font-semibold">
                /{totalQuestions}
              </span>
            </h2>
          </div>

          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-2xl border",
              timeLeft <= 60
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
            )}
          >
            <MdTimer className="text-lg" />

            <span className="font-black text-base">{formatMMSS(timeLeft)}</span>
          </div>
        </div>

        {/* Progress Bar */}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Quiz Progress</span>

            <span className="font-bold text-white">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
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
