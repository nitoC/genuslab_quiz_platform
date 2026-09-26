"use client";

import { useCallback, useState } from "react";
import Layout from "@/components/layouts/Layout";

// import QuizReviewModal from "@/components/ui/modals/ViewAnswers";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getDemoQuestions, getDemoResult } from "@/lib/api/apis";
import QuizOptions from "@/features/quiz/components/QuizOptions";
import Timer from "@/features/quiz/components/QuizTimer";
import QuizFooter from "@/features/quiz/components/QuizFooter";
import SubmitUI from "@/features/quiz/components/SubmitUI";
import QuizSkeleton from "@/features/quiz/components/skeletons/QuizSkeleton";
import CalculatingScore from "@/features/quiz/components/CalculatingScore";
import { useTimeStore } from "@/features/quiz/store/time.store";
import { useRouter } from "next/navigation";
import ActiveSessionModal from "@/features/quiz/components/modals/SessionConflict";
import SessionFailureModal from "@/features/quiz/components/modals/SessionError";
import useUser from "@/hooks/useUser";
import {
  MobileQuizHeader,
  QuizHeader,
} from "@/features/quiz/components/QuizHeader";

// Data Structure interface matching your real JSON payload
interface QuizQuestion {
  id: string;
  questionText: string;
  difficulty: string;
  rankId: string;
  options: string[];
  hint: string;
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
  // Output: "3min: 5sec"
  return s;
};

const QuizPage = () => {
  const router = useRouter();
  const { resetTime: setTime } = useTimeStore((state) => state);
  const [speed, setspeed] = useState("_min: _sec");
  // setTime();
  // 1. Fetching logic using React Query
  const { data: userData, isLoading: userIsLoading } = useUser();
  const {
    data: questions = [],
    isLoading,
    refetch,
    error,
    isError,
  } = useQuery<QuizQuestion[]>({
    queryKey: ["fetch demo questions"],
    queryFn: async () => {
      const res = await getDemoQuestions();
      return res.data?.payload ?? res ?? []; // Added fallbacks based on response mapping structures
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

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // const [review, setReview] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const totalQuestions = questions?.length ?? 0;
  const currentQuestion = questions?.[currentQuestionIndex];

  //custom handleSelect

  const chooseAnswer = (id: string, answer: number) => {
    const dup = [...selectedAnswers];

    const isInRecord = dup.find((a, b) => a && a.id === id);

    if (isInRecord) {
      const updated = selectedAnswers.map((a, b) => {
        return a.id === id ? { id: a.id, answer: answer } : a;
      });
      setSelectedAnswers(updated);
    } else {
      dup.push({ id, answer });
      setSelectedAnswers(dup);
    }
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
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // Use 'auto' for an instant jump
      });
    }
  }, [currentQuestionIndex, totalQuestions]);

  const goPrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // Use 'auto' for an instant jump
      });
    }
  }, [currentQuestionIndex]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await getDemoResult({
        answers: selectedAnswers.map((a) => ({
          questionId: a.id,
          answer: a.answer,
        })),
      });
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
  }, [selectedAnswers]);

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

  if (isError || !questions || totalQuestions === 0) {
    const status = (error as any)?.response?.status;
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

      <div className="min-h-screen flex items-center justify-center p-4 font-sans selection:bg-green/30">
        {/* Main Container */}
        <div className="w-full max-w-5xl bg-(--background-dark-secondary) rounded-lg border border-white/5 p-8 md:p-12 relative overflow-hidden">
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
                  avatarUrl={userData?.user?.details?.avatar}
                />
              </section>
              {/* Question Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                  <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-black text-(--primary) leading-tight">
                      {currentQuestion?.questionText ??
                        "Waiting for question..."}
                    </h1>
                    <p className="text-grey font-medium text-sm md:text-base">
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
                      <div className="text-grey text-sm">
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
                    // attemptId="demo"
                    type="demo"
                    isError={isError}
                    handleSubmit={handleSubmit}
                  />
                  {/* Live Rivals Widget */}
                  {/* <Rivals /> */}
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
              type="demo"
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

export default QuizPage;
