"use client";

import { IQuestion, IQuestionSubmit, IQuiz } from "@/interfaces";
import {
  createQuestion,
  fetchQuizDetails,
  getRankData,
  updateQuiz,
} from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast, { ToastBar } from "react-hot-toast";
import {
  FiClock,
  FiUsers,
  FiEdit,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";
import {
  FiSearch,
  FiMoreVertical,
  FiChevronDown,
  FiInfo,
} from "react-icons/fi";
// components/QuizSidebar.tsx

export const BasicInfoCard = ({ quiz }: { quiz: IQuiz }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
        Basic Info
      </h3>
      <button className="text-blue-600 font-bold text-sm hover:underline">
        Edit
      </button>
    </div>

    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[14px] font-bold uppercase tracking-widest mb-3">
      Live Quiz
    </span>

    <h2 className="text-xl font-bold text-slate-800 mb-1 leading-tight">
      {quiz.title}
    </h2>
    <p className="text-slate-400 text-sm mb-6">
      Day {quiz.day} — Episode {quiz.episode}
    </p>

    <div className="space-y-4">
      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
          <FiClock size={20} />
        </div>
        <div>
          <p className="text-[14px] font-bold text-slate-400 uppercase">
            Midday Slot
          </p>
          <p className="text-sm font-bold text-slate-700">
            {quiz.activeAt}{" "}
            <span className="font-normal text-slate-400">(Local Time)</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm overflow-hidden border border-slate-200">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Team"
            alt="avatar"
          />
        </div>
        {/* <div>
          <p className="text-[14px] font-bold text-slate-400 uppercase">
            Assigned to:
          </p>
          <p className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">
            Architecture Team
          </p>
        </div> */}
      </div>
    </div>
  </div>
);

export const ChecklistCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
    <h3 className="text-sm font-bold text-slate-800 mb-6">
      Ready to Publish Checklist
    </h3>
    <div className="space-y-5">
      {[
        "All 10 questions have correct answers",
        "Explanations populated for all questions",
        "Time slot scheduled & confirmed",
        "Metadata tags correctly applied",
      ].map((item, idx) => (
        <div key={idx} className="flex items-start gap-3 group cursor-pointer">
          <FiCheckCircle className="mt-0.5 text-blue-600 shrink-0" size={18} />
          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
            {item}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// components/QuestionItem.tsx

interface QuestionProps {
  number: string;
  question: string;
  difficulty: "easy" | "medium" | "hard";
  role: string;
  options: { isCorrect: boolean; text: string }[];
}

export const QuestionItem = ({
  number,
  question,
  difficulty,
  role,
  options,
}: QuestionProps) => {
  const [isOpen, setIsOpen] = useState(number === "01"); // Auto-expand first one

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
      {/* Header - Always visible */}
      <div
        className="p-6 flex items-start justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-blue-600 font-bold text-sm tracking-tight">
              Question {number}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[14px] font-bold border ${
                difficulty === "hard"
                  ? "bg-red-50 text-red-600 border-red-100"
                  : difficulty === "medium"
                    ? "bg-blue-50 text-blue-600 border-blue-100"
                    : "bg-emerald-50 text-emerald-600 border-emerald-100"
              }`}
            >
              {difficulty}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[14px] font-bold border border-slate-200 uppercase">
              {role}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-800 leading-snug">
            {question}
          </h3>
        </div>
        <div className="ml-4 text-slate-400">
          <FiChevronDown
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            size={20}
          />
        </div>
      </div>

      {/* Expandable Body */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-2">
            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {options.map((ans, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 transition-all"
                >
                  <span className="text-sm text-slate-700">{ans.text}</span>
                  {ans.isCorrect && (
                    <span className="px-2 py-1 bg-blue-600 text-white text-[14px] font-bold rounded uppercase tracking-wider">
                      Correct
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Answer Explanation Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm uppercase tracking-wider mb-2">
                <FiInfo className="text-blue-600" />
                <span>Answer Explanation</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                The Saga pattern is an architectural pattern for managing
                distributed transactions in a microservices architecture. It
                provides a mechanism for maintaining data consistency across
                multiple services without requiring long-lived locks, which can
                hinder performance in large-scale systems. It uses compensating
                transactions to roll back state if a step fails.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function QuizDetailsPage({
  questions,
  // quiz,
  handler,
  reset,
  id,
}: {
  questions: IQuestion[];
  // quiz?: IQuiz;
  handler: (option?: string) => void;
  reset: () => void;
  id?: string;
}) {
  // Fetch Quiz Item
  const {
    data: quiz,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get quiz", id],
    queryFn: async () => {
      const res = await fetchQuizDetails(id as string);
      console.log(res.data, "data in publish");
      return res.data;
    },
  });

  const {
    isLoading: ranksLoading,
    data: ranksData,
    isError: ranksError,
  } = useQuery({
    queryKey: ["fetchRanks"],
    queryFn: async () => {
      console.log(id);
      const res = await getRankData();

      console.log(res, "fetch ranks response");
      return res.data.payload;
    },
  });

  // interface IQuestion {
  //   id: string;
  //   questionText: string;
  //   difficulty: "Easy" | "Medium" | "Hard";
  //   rankRequirement: string;
  //   options: AnswerOption[];
  //   explanation: string;
  //   hint: string;
  // }

  const handleQuestionTransform = () => {
    const res = questions.map((a, _) => {
      return {
        answer: a.options.findIndex((a) => a.isCorrect),
        questionText: a.questionText,
        difficulty: a.difficulty.toLocaleLowerCase() as
          | "easy"
          | "medium"
          | "hard",
        rankId: ranksData.find((b: any) => b.rankName === a.rankRequirement).id,
        options: a.options.map((a) => a.text),
        answerDescription: a.explanation,
        quizId: id,
        hint: a.hint,
      };
    });
    // console.log(res, "res");
    return res;
  };

  const handleSubmit = async () => {
    const payload = handleQuestionTransform();
    try {
      console.log(payload, "transformed");
      if (id) {
        await updateQuiz(id, payload);
      } else {
        await createQuestion(payload);
      }
      toast.success("Quiz created");
      setTimeout(() => {
        reset();
      }, 400);
    } catch (err) {
      console.log("err", err);
      toast.error("oops! something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 antialiased">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
        {/* Left Sidebar */}
        <aside>
          {quiz && <BasicInfoCard quiz={quiz} />}
          <ChecklistCard />
        </aside>

        {/* Main Content Area */}
        <main>
          {/* List Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <h1 className="text-lg font-bold text-slate-800">
              Question Set{" "}
              <span className="text-slate-400 font-normal">
                ({questions.length})
              </span>
            </h1>
            <div className="flex items-center gap-4 text-slate-400">
              <FiSearch
                size={20}
                className="cursor-pointer hover:text-slate-600"
              />
              <FiMoreVertical
                size={20}
                className="cursor-pointer hover:text-slate-600"
              />
            </div>
          </div>

          {/* Question List */}

          {questions &&
            questions.map((a, b) => {
              return (
                <QuestionItem
                  number={a.id}
                  difficulty={a.difficulty}
                  role={a.rankRequirement}
                  question={a.questionText}
                  options={a.options}
                />
              );
            })}
          {/* <QuestionItem
            number="01"
            difficulty="Medium"
            role="SENIOR DEVELOPER"
            question="What is the primary benefit of using a Saga Pattern in distributed microservices transactions?"
          />
          <QuestionItem
            number="02"
            difficulty="HARD"
            role="LEAD ARCHITECT"
            question="How does Event Sourcing differ from traditional CRUD operations in state management?"
          />
          <QuestionItem
            number="03"
            difficulty="EASY"
            role="JUNIOR DEVELOPER"
            question="Which protocol is typically used for high-performance service-to-service communication?"
          /> */}
        </main>
      </div>
      <div className="flex items-center justify-between pt-4 pb-10">
        <button
          type="button"
          onClick={() => handler("qb")}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-5">
          {/* <button
            type="button"
            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
          >
            Save as Draft
          </button> */}

          <button
            onClick={handleSubmit}
            // onClick={handler}
            // className={clsx(
            //   "rounded-xl px-5 py-3 text-sm font-medium text-white shadow-sm transition-all",
            //   question.length > 0
            //     ? "bg-blue-600 hover:bg-blue-700"
            //     : "cursor-not-allowed bg-slate-300",
            // )}
            className="rounded-xl px-5 py-3 text-sm font-medium text-white shadow-sm transition-all bg-blue-600 hover:bg-blue-700"
          >
            Review & Publish Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
