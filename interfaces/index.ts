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
  // Must be one of the strings in the selected rank's `topics` list
  // (Rank.topics in the Prisma schema) — see AdminQuestionCreate.tsx.
  topic: string;
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
  // Optional to match `Question.topic String?` in the Prisma schema —
  // used server-side to draw rank/topic-matched quiz questions.
  topic?: string;
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

export interface IUserDetails {
  id?: string;
  avatar?: string;
  userId?: string;
  rewardBalance?: number;
  rankId?: string;
  xp?: number;
  _count?: any;
  rankName?: any;
}

export interface ISubscription {
  id: string;
  name: "FREE" | "PREMIUM";
  userId: string;
  price: number;
  createdAt: string;
  startAt: string;
  endAt: string;
}

export interface IUser {
  id?: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
  status?: string;
  role?: string;
  isSubscribed?: boolean;
  referralCode?: string;
  verified: boolean;
  referrals: any[];
  accounts?: any[];
  details: IUserDetails;
  subscriptions?: ISubscription[];
  transactions?: any[];
  notifications: any[];
}
