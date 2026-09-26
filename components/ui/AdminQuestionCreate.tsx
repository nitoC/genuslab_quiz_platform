"use client";

import React, { useRef, useState } from "react";
import {
  FiTrash2,
  FiCopy,
  FiGrid,
  FiPlus,
  FiPlusCircle,
  FiX,
  FiHelpCircle,
  FiArrowLeft,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import clsx from "clsx";

import AdminTextArea from "./FormItems/AdminTextArea";
import CustomSelect from "./FormItems/CustomSelect";
import { IQuestion } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { fetchQuestionDetails, getRankData } from "@/lib/api/apis";
import { useRouter } from "next/navigation";

export default function QuestionBuilder({
  handler,
  question,
  setQuestion,
  id,
  quizId,
}: {
  handler: (option?: string) => void;
  question: IQuestion[];
  id?: string;
  quizId: string | undefined;
  setQuestion: React.Dispatch<React.SetStateAction<IQuestion[]>>;
}) {
  const router = useRouter();
  const {
    isLoading: ranksLoading,
    data: ranksData,
    isError: ranksError,
  } = useQuery({
    queryKey: ["fetchRanks"],
    queryFn: async () => {
      const res = await getRankData();

      return res.data.payload;
    },
  });

  const toggleCorrect = (id: string) => {
    setQuestion(
      question.map((q) => ({
        ...q,
        options: q.options.map((o) =>
          o.id === id ? { ...o, isCorrect: !o.isCorrect } : o,
        ),
      })),
    );
  };

  const deleteOption = (id: string) => {
    setQuestion(
      question.map((q) => ({
        ...q,
        options: q.options.filter((o) => o.id !== id),
      })),
    );
  };

  const addQuestion = () => {
    if (question.length >= 10) return;

    setQuestion([
      ...question,
      {
        id: (question.length + 1).toString(),
        questionText: "",
        difficulty: "medium",
        rankRequirement: "Fresh Mind",
        topic: "",
        options: [],
        explanation: "",
        hint: "",
      },
    ]);
  };

  const deleteQuestion = (id: string) => {
    setQuestion(question.filter((q) => q.id !== id));
  };

  const updateQuestion = (
    questionItem: IQuestion,
    field: string,
    value: string,
  ) => {
    const updatedQuestion = {
      ...questionItem,
      [field]: value,
    };

    // console.log(updatedQuestion, "updated");

    // console.log(question, "question");
    // console.log(questionItem, "question");

    setQuestion(
      question.map((q) => (q.id === questionItem.id ? updatedQuestion : q)),
    );
  };

  const addOption = (questionItem: IQuestion) => {
    const newId = crypto.randomUUID();

    if (questionItem.options.length >= 4) return;

    const updatedOptions = [
      ...questionItem.options,
      {
        id: newId,
        text: "",
        isCorrect: false,
      },
    ];

    setQuestion(
      question.map((q) =>
        q.id === questionItem.id ? { ...q, options: updatedOptions } : q,
      ),
    );
  };

  const updateOption = (
    questionItem: IQuestion,
    optionId: string,
    value: string,
  ) => {
    setQuestion(
      question.map((q) =>
        q.id === questionItem.id
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, text: value } : o,
              ),
            }
          : q,
      ),
    );
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8 text-slate-700 antialiased">
      <div className="space-y-5">
        {ranksData &&
          question.map((q) => (
            <AdminQuestionCard
              key={q.id}
              question={q}
              rank={ranksData}
              toggleCorrect={toggleCorrect}
              deleteOption={deleteOption}
              deleteQuestion={deleteQuestion}
              addOption={addOption}
              updateOption={updateOption}
              updateQuestion={updateQuestion}
            />
          ))}

        {/* Add Question */}
        {quizId
          ? question.length < 10
          : question.length < 4 && (
              <button
                onClick={addQuestion}
                className="group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-7 transition-all hover:bg-slate-100"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors group-hover:bg-blue-50">
                  <FiPlus className="text-lg text-slate-500 group-hover:text-blue-600" />
                </div>

                <span className="text-sm font-medium text-slate-600">
                  Add Question {question.length + 1}
                </span>
              </button>
            )}

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-4 pb-10"
        >
          <button
            type="button"
            onClick={() => {
              !quizId ? router.push("/genuslab/quizzes") : handler("bi");
            }}
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
              onClick={() => handler()}
              className={clsx(
                "px-5 py-3 text-sm font-medium text-white shadow-sm transition-all",
                question.length > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-300",
              )}
            >
              Review & Publish Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const AdminQuestionCard = ({
  question,
  toggleCorrect,
  deleteOption,
  updateOption,
  addOption,
  updateQuestion,
  rank,
  deleteQuestion,
}: {
  question: IQuestion;
  rank: any;
  toggleCorrect: (id: string) => void;
  deleteOption: (id: string) => void;
  addOption: (questionItem: IQuestion) => void;
  updateOption: (
    questionItem: IQuestion,
    optionId: string,
    value: string,
  ) => void;
  deleteQuestion: (id: string) => void;
  updateQuestion: (
    questionItem: IQuestion,
    field: string,
    value: string,
  ) => void;
}) => {
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Medium",
  );

  const [drop, setDrop] = useState(false);

  let filteredRank = rank.map((a: any) => ({
    label: a.rankName,
    value: a.id,
  }));

    // Topics belong to the selected rank.
  const selectedRank = rank.find(
    (a: any) => a.rankName === question.rankRequirement,
  );
  const topicOptions: { label: string; value: string }[] = Array.isArray(
    selectedRank?.topics,
  )
    ? selectedRank.topics
        .filter((t: unknown): t is string => typeof t === "string")
        .map((t: string) => ({ label: t, value: t }))
    : [];


  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={contentRef}
      style={{
        height: drop ? `${contentRef.current?.scrollHeight}px` : "72px",
      }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-2">
          <FiGrid className="cursor-grab text-slate-400 active:cursor-grabbing" />

          <span className="text-sm font-semibold text-blue-600">
            Question {question.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrop(!drop)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            {drop ? (
              <FiChevronDown className="text-lg" />
            ) : (
              <FiChevronUp className="text-lg" />
            )}
          </button>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <FiCopy className="text-lg" />
          </button>

          <button
            onClick={() => deleteQuestion(question.id)}
            type="button"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <FiTrash2 className="text-lg" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 p-7">
        {/* Question */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Question Content
          </label>

          <AdminTextArea
            handler={(value) => updateQuestion(question, "questionText", value)}
            h="24"
            value={question.questionText}
            placeholder="Type your question here..."
          />
        </div>

        {/* Difficulty + Rank */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Difficulty */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Difficulty Level
            </label>

            <div className="flex rounded-xl">
              {(["Easy", "Medium", "Hard"] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={clsx(
                    "flex-1 rounded-lg py-2.5 text-sm font-medium transition-all",
                    difficulty === level
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800",
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Rank */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Rank Requirement
            </label>

            <CustomSelect
              options={rank && filteredRank}
              placeholder="Select rank requirement..."
              label={question.rankRequirement}
              // value={question.rankRequirement}
              onChange={(value: string) =>
                                // Reset topic — it belonged to the previous rank.
                updateQuestion(
                  { ...question, rankRequirement: value },
                  "topic",
                  "",
                )
              }
            />
          </div>
        </div>

        {/* Topic */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Topic
          </label>

          <CustomSelect
            options={topicOptions}
            placeholder={
              topicOptions.length
                ? "Select topic..."
                : "Select a rank first..."
            }
            disabled={topicOptions.length === 0}
            label={question.topic}
            onChange={(value: string) =>
              updateQuestion(question, "topic", value)
            }
          />
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Answer Options
            </label>

            <span className="text-sm text-slate-500">
              Toggle switch for correct answer
            </span>
          </div>

          <div className="space-y-3">
            {question.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition-all hover:border-slate-300"
              >
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) =>
                    updateOption(question, option.id as string, e.target.value)
                  }
                  placeholder="Enter answer choice text..."
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

                <div className="flex shrink-0 items-center gap-4">
                  {/* Toggle */}
                  <div className="flex items-center gap-2">
                    <span
                      className={clsx(
                        "text-sm font-semibold",
                        option.isCorrect ? "text-blue-600" : "text-slate-400",
                      )}
                    >
                      CORRECT
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleCorrect(option.id as string)}
                      className={clsx(
                        "flex h-5 w-10 items-center rounded-full p-0.5 transition-colors",
                        option.isCorrect ? "bg-blue-600" : "bg-slate-300",
                      )}
                    >
                      <div
                        className={clsx(
                          "flex h-4 w-4 items-center justify-center rounded-full bg-white text-[14px] font-bold text-blue-600 shadow-sm transition-transform",
                          option.isCorrect ? "translate-x-5" : "translate-x-0",
                        )}
                      >
                        {option.isCorrect && "✓"}
                      </div>
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => deleteOption(option.id as string)}
                    className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Option */}
          {question.options.length < 4 && (
            <button
              type="button"
              onClick={() => addOption(question)}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              <FiPlusCircle className="text-base" />
              <span>Add Another Option</span>
            </button>
          )}
        </div>

        {/* Explanation */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Answer Explanation
          </label>

          <AdminTextArea
            handler={(value) => updateQuestion(question, "explanation", value)}
            h="16"
            value={question.explanation}
            placeholder="Provide a detailed explanation for the correct answer..."
          />
        </div>

        {/* Hint */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Question Hint / Clue
          </label>

          <div className="relative">
            <FiHelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-blue-600" />

            <input
              type="text"
              value={question.hint}
              onChange={(e) => updateQuestion(question, "hint", e.target.value)}
              placeholder="Enter a helpful hint (optional)..."
              className="h-11 w-full rounded-xl border border-transparent bg-slate-100 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
