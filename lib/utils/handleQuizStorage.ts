const handleQuizStorage = (attemptId?: string, data?: any, set?: boolean) => {
  if (set && attemptId && data) {
    localStorage.setItem("quiz-attempt", JSON.stringify({ attemptId, data }));
    return;
  }
  const val = localStorage.getItem("quiz-attempt");
  return JSON.parse(val ?? "null");
};

export default handleQuizStorage;
