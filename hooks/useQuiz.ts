import { useState } from "react";
import { toast } from "react-toastify";
// import type { QuizQuestion } from "../types.ts";

export const useQuiz = (questions: any[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [score, setScore] = useState(0);

  const totalQuestions = questions.length;

  const currentQuestion = questions[currentQuestionIndex];

  const selectAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitQuiz = () => {
    const totalAnswered = Object.keys(selectedAnswers).length;

    const score =
      totalQuestions > 0
        ? Math.round((totalAnswered / totalQuestions) * 100)
        : 0;

    setScore(score);
    setIsSubmitted(true);

    toast.success("Quiz completed!");
  };

  const retry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setIsSubmitted(false);
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    selectedAnswers,
    totalQuestions,
    isSubmitted,
    score,

    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitQuiz,
    retry,
    setIsSubmitted,
  };
};
