export interface AnswerOption {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface IQuestion {
  id: string;
  questionText: string;
  difficulty: "easy" | "medium" | "hard";
  rankRequirement: string;
  options: AnswerOption[];
  explanation: string;
  hint: string;
}

export interface IQuestionSubmit {
  id?: string;
  answer: number;
  questionText: string;
  difficulty: "easy" | "medium" | "hard";
  rankId: string;
  options: string[];
  answerDescription: string;
  quizId?: string;
  hint: string;
}

export interface IQuiz {
  title: String;
  day: String;
  episode: String;
  activeAt: String;
}
