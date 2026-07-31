import { fetchQuizById } from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const useQuizData = (quizId: string) => {
  // Fetch Quiz with TanStack Query
  const {
    data: quiz,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      console.log("in query fn for quizId:", quizId);
      const res = await fetchQuizById(quizId);
      const payload = res?.data?.payload || res;

      // Ensure activeDate is cleanly formatted as YYYY-MM-DD for <input type="date" />
      const formattedDate = payload.activeDate
        ? new Date(payload.activeDate).toISOString().split("T")[0]
        : "";

      return {
        ...payload,
        activeDate: formattedDate,
        questions: payload.questions || [],
        day: res?.data?.day,
      };
    },
    enabled: Boolean(quizId),
  });
  return {
    quiz,
    isLoading,
    isError,
    error,
  };
};

export default useQuizData;
