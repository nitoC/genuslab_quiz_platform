"use client";

import Layout from "@/components/layouts/Layout";
import QuizFooter from "@/features/quiz/components/QuizFooter";
import QuizHeader from "@/features/quiz/components/QuizHeader";
import QuizQuestion from "@/features/quiz/components/QuizQuestion";
import QuizResult from "@/features/quiz/components/QuizResult";
import Rivals from "@/features/quiz/components/QuizRivals";
import Timer from "@/features/quiz/components/QuizTimer";
import { useQuiz } from "@/hooks/useQuiz";
import { useQuizTimer } from "@/hooks/useQuizTimer";
import { getDemoQuestions } from "@/lib/api/apis";
import { QUIZ_DURATION } from "@/lib/utils/timer";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();

  const {
    data: questions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["demo-questions"],
    queryFn: async () => {
      const res = await getDemoQuestions();
      return res.data?.payload ?? [];
    },
  });

  const quiz = useQuiz(questions);

  const { timeLeft, reset } = useQuizTimer({
    duration: QUIZ_DURATION,
    paused: quiz.isSubmitted,
    onExpire: () => {
      quiz.setIsSubmitted(true);
    },
  });

  if (isLoading) {
    return <p>loading...</p>;
    // return <QuizLoading />;
  }

  if (isError || questions.length === 0) {
    return <p>an error occurred</p>;
    // return <QuizError />;
  }

  return (
    <Layout type="quiz">
      {!quiz.isSubmitted ? (
        <>
          <QuizHeader
            currentQuestionIndex={quiz.currentQuestionIndex}
            totalQuestions={quiz.totalQuestions}
            difficulty={quiz.currentQuestion?.difficulty}
          />

          <QuizQuestion
            question={quiz.currentQuestion}
            selectedAnswer={quiz.selectedAnswers[quiz.currentQuestion.id]}
            onSelect={(value) =>
              quiz.selectAnswer(quiz.currentQuestion.id, value)
            }
          />

          <Timer timeLeft={timeLeft} totalSeconds={QUIZ_DURATION} />

          <Rivals />

          <QuizFooter
            currentQuestionIndex={quiz.currentQuestionIndex}
            totalQuestions={quiz.totalQuestions}
            //   submitting={submitting}
            onPrev={quiz.prevQuestion}
            onNext={quiz.nextQuestion}
            onSubmit={quiz.submitQuiz}
          />
        </>
      ) : (
        <QuizResult
          score={quiz.score}
          onRetry={() => {
            quiz.retry();
            reset();
          }}
          onReview={() => {}}
        />
      )}
    </Layout>
  );
}
