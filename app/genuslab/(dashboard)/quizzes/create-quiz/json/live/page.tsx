"use client";

import React, { useState, useEffect, useRef } from "react";
import JsonDataEntry from "@/features/quiz/components/JsonDataEntry";
import IntegrationWorkflow from "@/features/quiz/components/IntegrationWorkflow";
import BatchSummary from "@/features/quiz/components/BatchSummary";
import DataReferenceGuide from "@/features/quiz/components/DataReferenceGuide";
import LiveQuizPreview from "@/features/quiz/components/LiveQuizPreview";
import { createQuiz, createQuizBatch } from "@/lib/api/apis";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useRank from "@/hooks/useRank";

import { FaChevronDown, FaLock } from "react-icons/fa";

type Rank = {
  id: string;
  rank: number;
  rankName: string;
  unlockXp: number;
  unlocked: boolean;
  unlockedAt: string | null;
  createdAt: string;
  reward: number;
};

type RankDropdownProps = {
  ranks?: Rank[];
  activeRank?: Rank | null;
  setActiveRank: (rank: Rank) => void;
};

export interface QuizObject {
  title?: string;
  day?: number;
  episode?: string;
  activeAt?: string;
  activeDate?: string;
  questions?: any[];
}

export default function BulkQuizCreator() {
  const { data, isLoading, isError, error } = useRank();

  // 🟢 FIX 1: Safely handle activeRank state initialization when data is undefined
  const [activeRank, setActiveRank] = useState<Rank | null>(null);

  // Synchronize activeRank when rank data becomes available
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0 && !activeRank) {
      const unlockedRank = data.find((rank: Rank) => rank.unlocked);
      setActiveRank(unlockedRank ?? data[data.length - 1]);
    }
  }, [data, activeRank]);

  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const router = useRouter();
  const [jsonText, setJsonText] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<boolean>(false);
  const [QParsed, setQParsed] = useState<QuizObject[] | undefined>();
  const [validationStatus, setValidationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const [activeDate, setActiveDate] = useState<string>("");

  const [summary, setSummary] = useState({
    totalQuizzes: 0,
    questionsPerQuiz: 0,
    totalCapacity: 0,
    titles: [] as string[],
  });

  // Parse and validate JSON dynamically when input changes
  useEffect(() => {
    if (!jsonText.trim()) {
      setValidationStatus("idle");
      setSummary({
        totalQuizzes: 0,
        questionsPerQuiz: 0,
        totalCapacity: 0,
        titles: [],
      });
      setQParsed(undefined);
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      if (Array.isArray(parsed)) {
        setValidationStatus("success");

        const totalQuizzes = parsed.length;
        const firstQuizQuestions = parsed[0]?.questions?.length || 0;
        const totalCapacity = parsed.reduce(
          (acc, curr) => acc + (curr.questions?.length || 0),
          0,
        );
        const titles = parsed
          .map((q: QuizObject) => q.title || "Untitled Quiz")
          .filter(Boolean);

        setSummary({
          totalQuizzes,
          questionsPerQuiz: firstQuizQuestions,
          totalCapacity,
          titles,
        });
        setQParsed(parsed);
      } else {
        setValidationStatus("error");
      }
    } catch (e) {
      setValidationStatus("error");
    }
  }, [jsonText]);

  // 🟢 FIX 2: Correct timer cleanup effect dependency array
  useEffect(() => {
    const timers = timerRef.current;
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);

  const handleClear = () => {
    setJsonText("");
    setActiveDate("");
  };

  const handleSubmit = async () => {
    if (submitting) return;
    try {
      if (!QParsed || QParsed.length < 1) return toast.error("empty quiz data");

      if (!(activeDate || QParsed.every((a) => a.activeDate)))
        return toast.error(
          "Please select an activation date before submitting",
        );

      setSubmitting(true);

      const finalizedPayload = QParsed.map((quiz) => ({
        ...quiz,
        ...(activeRank?.id && { rank: activeRank.id }),
      }));

      const res = await createQuizBatch(finalizedPayload);
      console.log(res, "data in batch upload");
      toast.success("quizzes saved in draft, proceed to add questions");
      setJsonText("");
      setActiveDate("");

      const timeout = setTimeout(() => {
        router.push("/genuslab/quizzes");
      }, 1500);
      timerRef.current.push(timeout);
    } catch (err: any) {
      console.log(err);
      if (err?.response?.status === 403) {
        return;
      }
      if (err?.response?.status === 409) {
        return toast.error(
          "Some episodes have already been scheduled. Create for other episodes",
        );
      }
      toast.error(
        `Could not submit quiz\n ${err?.response?.data?.message || ""}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const previewData = QParsed?.map((quiz) => ({
    ...quiz,
    activeDate: quiz.activeDate || activeDate,
  }));

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-12 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Bulk Live Quiz Creator
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Scale your assessments by importing multiple quizzes simultaneously.
            Paste your JSON array below. Each quiz object should include a
            title, day, episode (e.g., EPISODE_1), activeAt slot, and an array
            of questions.
          </p>
        </div>

        {/* Activation Configuration Field Block */}
        <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Target Schedule Date (activeDate)
          </label>
          <div className="flex flex-wrap justify-between gap-4">
            <input
              type="date"
              value={activeDate}
              onChange={(e) => setActiveDate(e.target.value)}
              className="w-full max-w-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
            />
            {!isLoading && data && (
              <RankDropdown
                ranks={data}
                activeRank={activeRank}
                setActiveRank={setActiveRank}
              />
            )}
          </div>
          <p className="mt-1.5 text-slate-400 text-xs">
            This value will be dynamically injected into every array block item
            payload upon creation.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <JsonDataEntry
              jsonText={jsonText}
              setJsonText={setJsonText}
              onClear={handleClear}
            />
            <IntegrationWorkflow status={validationStatus} />
          </div>

          <div className="space-y-6">
            <BatchSummary
              handlePreview={() => setPreview(true)}
              summary={summary}
            />
            <DataReferenceGuide />
          </div>
        </div>
      </div>

      {preview && (
        <LiveQuizPreview
          quizzes={previewData}
          isValid={validationStatus === "success"}
          handlePreview={() => setPreview(false)}
          submitting={submitting}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function RankDropdown({
  ranks = [],
  setActiveRank,
  activeRank,
}: RankDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectRank = (rank: Rank) => {
    setActiveRank(rank);
    setIsOpen(false);
  };

  if (!activeRank) return null;

  return (
    <div className="relative w-full max-w-md">
      {/* Selected Rank */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:border-blue-600"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
            {activeRank.rank}
          </div>

          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">
              {activeRank.rankName}
            </p>

            <p className="text-xs text-gray-500">
              {activeRank.unlockXp?.toLocaleString()} XP
            </p>
          </div>
        </div>

        <FaChevronDown
          className={`text-sm text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          {ranks?.map((rank) => {
            const isActive = activeRank.id === rank.id;

            return (
              <button
                key={rank.id}
                type="button"
                onClick={() => handleSelectRank(rank)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-left transition ${
                  isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {rank.rank}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {rank.rankName}
                    </p>

                    <p className="text-xs text-gray-500">
                      {rank.unlockXp?.toLocaleString()} XP
                    </p>
                  </div>
                </div>

                {!rank.unlocked && <FaLock className="text-xs text-gray-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
