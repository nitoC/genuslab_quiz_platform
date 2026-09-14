import { create } from "zustand";

export type DifficultyType = "easy" | "medium" | "hard" | "expert";

// 2. Define the payload schema for creating a new question
export interface CreateQuestionPayload {
  difficulty: DifficultyType;
  rankId: string;
  // Matches one of the target rank's `topics` entries (Rank.topics in the
  // Prisma schema); optional to mirror `Question.topic String?`.
  topic?: string;
  questionText: string;
  quizId?: string;
  options: string[];
  answer: number; // Index of the correct option
  answerDescription: string;
}

// id: (question.length + 1).toString(),
//         questionText: "",
//         difficulty: "Medium",
//         rankRequirement: "Fresh Mind",
//         options: [],
//         explanation: "",
//         hint: "",

export const useQuestion = create((set) => {
  ({
    questions: [],
    addQuestions: (newQuestions: CreateQuestionPayload) =>
      set((state: { questions: CreateQuestionPayload[] }) => ({
        questions: [...state.questions, newQuestions],
      })),
  });
});
