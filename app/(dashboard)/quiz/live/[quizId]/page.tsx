"use client";

import { useCallback, useEffect, useState } from "react";
import Layout from "@/components/layouts/Layout";

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
import LiveQuizFooter from "@/features/quiz/components/LiveQuizFooter";
import SubmitUI from "@/features/quiz/components/SubmitUI";
import QuizSkeleton from "@/features/quiz/components/skeletons/QuizSkeleton";
import CalculatingScore from "@/features/quiz/components/CalculatingScore";
import { useTimeStore } from "@/features/quiz/store/time.store";
import { useParams, useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import ActiveSessionModal from "@/features/quiz/components/modals/SessionConflict";
import SessionFailureModal from "@/features/quiz/components/modals/SessionError";
import NotSubscribedModal from "@/features/quiz/components/modals/NotSubscribed";
import handleQuizStorage from "@/lib/utils/handleQuizStorage";
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
  return s;
};

const QuizPage = () => {
  const router = useRouter();
  const { quizId } = useParams();
  const { resetTime: setTime } = useTimeStore((state) => state);
  const [speed, setspeed] = useState("_min: _sec");

  const { data: userData, isLoading: userIsLoading, userStore } = useUser();

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
    queryKey: ["initiate quiz", quizId],
    queryFn: async () => {
      // getUserDetails expects the User id, not the UserDetails id.
      const userId = userData?.user?.id || userStore?.userId;
      if (!userId) {
        toast.error("user not found");
        throw new Error("user not found");
      }
      if (!quizId) {
        router.back();
        toast.error("quiz id not found");
        throw new Error("user not found");
      }
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
    enabled: !!userData?.user,
  });

  const data = queryResponse?.data;
  const userDetailsId = queryResponse?.userDetailsId;
  const attemptId = data?.attemptId;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    { id: string; answer: number }[]
  >([]);
  // const [submittedAnswers, setSubmittedAnswers] = useState<
  //   { id: string; answer: number }[]
  // >([]); useUser

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [xp, setXp] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const totalQuestions = data?.questions?.length ?? 0;
  const currentQuestion = data?.questions?.[currentQuestionIndex];

    // Next reuses this component when only quizId changes, so reset state here.
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setIsSubmitted(false);
    setIsReady(false);
    setXp(0);
    setScore(0);
    setspeed("_min: _sec");
  }, [quizId]);

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

      // const selectedAnswer = selectedAnswers.find((a) => a.id === id);
      // const pastSubmission = submittedAnswers.find((a) => a.id === id);

      // const needsSubmission =
      //   !pastSubmission ||
      //   (selectedAnswer && selectedAnswer.answer !== pastSubmission.answer);

      // if (!needsSubmission) {
      //   goNext();
      //   return;
      // }
      try {
        setSubmitting(true);

        attemptId && handleQuizStorage(attemptId, selectedAnswers, true);

        // send to backend
        // const res = await submitLiveQuestion({
        //   questionId: id,
        //   attemptId: attemptId,
        //   selectedAnswer: selectedAnswer?.answer ?? -1,
        // });

        // if (res) {
        //   setSubmittedAnswers((prev) => {
        //     const filtered = prev.filter((a) => a.id !== id);
        //     return [
        //       ...filtered,
        //       {
        //         id: id,
        //         answer: selectedAnswer?.answer ?? -1,
        //       },
        //     ];
        //   });
        goNext();
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
        // }
      } catch (err: any) {
        toast.error("Failed to submit answer. Check your network connection.");
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, selectedAnswers, attemptId, goNext],
  );

  const handleAttemptSubmit = useCallback(async () => {
    if (submitting) return;

    // const selectedAnswer = selectedAnswers.find((a) => a.id === id);

    try {
      setSubmitting(true);
      const res = await submitAttempt(userDetailsId as string, {
        attemptId,
        answers: selectedAnswers.map((a) => ({
          questionId: a.id,
          selectedAnswer: a.answer,
        })),
      });

      if (res) {
        // setSubmittedAnswers((prev) => {
        //   const filtered = prev.filter((a) => a.id !== id);
        //   return [
        //     ...filtered,
        //     {
        //       id: id,
        //       answer: selectedAnswer?.answer ?? -1,
        //     },
        //   ];
        // });
        setIsSubmitted(true);
        setScore(res.data.score);
        setXp(res.data.experience);
        setspeed(res.data.timeStr);
      }

      localStorage.removeItem("quiz-attempt");
    } catch (err: any) {
      toast.error("Failed to submit answer. Check your network connection.");
      console.error(err.response);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, selectedAnswers, attemptId, goNext]);

  useEffect(() => {
    async function verifyAttempt() {
      // getUserDetails expects the User id, not the UserDetails id.
      const userId = userData?.user?.id || userStore?.userId;
      if (!userId) {
        toast.error("user not found");
        throw new Error("user not found");
      }
      if (!quizId) {
        router.back();
        toast.error("quiz id not found");
        throw new Error("user not found");
      }
      const userDetails = await getUserDetails(userId);
      if (!userDetails) {
        toast.error("user not logged in");
        router.push("/login");
      }

      // userDetails?.data?.payload?.id;

      if (!userDetails?.data.payload.id) return;
      try {
        const stored = localStorage.getItem("quiz-attempt");
        if (!stored) return;

        const parsed = JSON.parse(stored);
        // Verify the saved attempt matches the active session attemptId

        // toast.info("Resuming un-submitted quiz attempt...");
        // setSelectedAnswers(parsed.answers);
        await submitAttempt(userDetails.data.payload.id as string, {
          attemptId: parsed?.attemptId,
          answers: parsed.data.map((a: any) => ({
            questionId: a.id,
            selectedAnswer: a.answer,
          })),
        });
        localStorage.removeItem("quiz-attempt");

      } catch (error) {
        console.error("Error reading stored quiz attempt:", error);
      }
    }
    verifyAttempt();
  }, [userData?.user]);

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
    const conflictReason = (error as any)?.response?.data?.message;
    const errorCode = (error as any)?.response?.data?.code;
    console.error((error as any)?.response, "error res");
    if (status === 409) {
      return (
        <Layout type="quiz">
          <ActiveSessionModal reason={conflictReason} />
        </Layout>
      );
    }
    if (status === 403 && errorCode === "SUBSCRIPTION_REQUIRED") {
      return (
        <Layout type="quiz">
          <NotSubscribedModal />
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
      <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 font-sans selection:bg-green/30">
        {/* Main Container */}
        <div className="w-full max-w-5xl bg-(--background-dark-secondary) rounded-lg border border-white/5 p-4 sm:p-6 md:p-12 relative overflow-hidden">
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
                  avatarUrl={userData?.user?.details?.avatar}
                />
              </section>

              {/* Question Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  <div className="space-y-3 md:space-y-4">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-(--primary) leading-snug break-words">
                      {currentQuestion?.questionText ??
                        "Waiting for question..."}
                    </h1>
                    <p className="text-grey font-medium text-sm sm:text-sm md:text-base leading-relaxed">
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
                      <div className="text-grey text-sm">
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
                    attemptId={attemptId}
                    // startTime={}
                  />
                  {/* <Rivals /> */}
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

export default QuizPage;
