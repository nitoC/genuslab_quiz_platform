"use client";

import { act, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MdArrowBack,
  MdSave,
  MdAdd,
  MdDeleteOutline,
  MdCheckCircle,
  MdErrorOutline,
} from "react-icons/md";
import { cn } from "@/lib/utils/cn";
import { fetchQuizById, updateQuizData } from "@/lib/api/apis";
import toast from "react-hot-toast";
import useQuizData from "@/hooks/useQuizData";
import AdminCard from "@/components/ui/cards/AdminCard";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";

// Types derived from Prisma Model
export type ActiveSlot =
  | "MORNING_7_9"
  | "MORNING_9_11"
  | "MIDDAY_11_13"
  | "AFTERNOON_13_15"
  | "AFTERNOON_15_17"
  | "EVENING_17_19"
  | "NIGHT_19_21";
export type QuizStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "UPCOMING";
export type EpisodeType =
  | "EPISODE_0"
  | "EPISODE_1"
  | "EPISODE_2"
  | "EPISODE_3"
  | "EPISODE_4"
  | "EPISODE_5"
  | "EPISODE_6"
  | "EPISODE_7";

export interface OptionFormData {
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface QuestionFormData {
  id?: string;
  text: string;
  points: number;
  options: OptionFormData[];
}

export interface QuizFormData {
  id: string;
  title: string;
  day: number;
  activeAt: ActiveSlot;
  status: QuizStatus;
  episode: EpisodeType;
  activeDate: string; // YYYY-MM-DD
  questions: QuestionFormData[];
}

const EPISODE_OPTIONS: EpisodeType[] = [
  "EPISODE_0",
  "EPISODE_1",
  "EPISODE_2",
  "EPISODE_3",
  "EPISODE_4",
  "EPISODE_5",
  "EPISODE_6",
  "EPISODE_7",
];

const SLOT_OPTIONS: ActiveSlot[] = [
  "MORNING_7_9",
  "MORNING_9_11",
  "MIDDAY_11_13",
  "AFTERNOON_13_15",
  "AFTERNOON_15_17",
  "EVENING_17_19",
  "NIGHT_19_21",
];
const STATUS_OPTIONS: QuizStatus[] = [
  "DRAFT",
  "UPCOMING",
  "PUBLISHED",
  "ARCHIVED",
];

export default function EditQuizPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Safely get route params on client
  const routeParams = useParams();
  const quizId = routeParams?.quizId as string;

  // Form State
  const [formData, setFormData] = useState<QuizFormData | null>(null);
  const { quiz, isLoading, isError, error } = useQuizData(quizId);
  // Sync query data to local state
  useEffect(() => {
    if (quiz) {
      setFormData(quiz);
    }
  }, [quiz]);

  // Update Quiz Mutation
  const updateMutation = useMutation<void, Error, QuizFormData>({
    mutationFn: async (data: QuizFormData) => {
      const quizData = { ...data };
      // if (quizData.questions.length < 1) {
      delete (quizData as Partial<QuizFormData>).questions;
      // }

      await updateQuizData(quizData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      router.push("/genuslab/quizzes");
    },
    onError: (err: Error) => {
      alert(`Error updating quiz: ${err.message}`);
    },
  });

  const handleMetaChange = (
    field: keyof QuizFormData,
    value: string | number,
  ) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const addQuestion = () => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            questions: [
              ...(prev.questions || []),
              {
                text: "",
                points: 10,
                options: [
                  { text: "", isCorrect: true },
                  { text: "", isCorrect: false },
                ],
              },
            ],
          }
        : null,
    );
  };

  const removeQuestion = (qIndex: number) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            questions: prev.questions.filter((_, idx) => idx !== qIndex),
          }
        : null,
    );
  };

  const handleQuestionChange = (
    qIndex: number,
    field: keyof QuestionFormData,
    value: any,
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = [...prev.questions];
      updated[qIndex] = { ...updated[qIndex], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    field: keyof OptionFormData,
    value: any,
  ) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedQuestions = [...prev.questions];
      const updatedOptions = [...updatedQuestions[qIndex].options];

      if (field === "isCorrect" && value === true) {
        updatedOptions.forEach((opt, idx) => {
          opt.isCorrect = idx === oIndex;
        });
      } else {
        updatedOptions[oIndex] = { ...updatedOptions[oIndex], [field]: value };
      }

      updatedQuestions[qIndex].options = updatedOptions;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const addOption = (qIndex: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIndex].options.push({ text: "", isCorrect: false });
      return { ...prev, questions: updatedQuestions };
    });
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedQuestions = [...prev.questions];
      updatedQuestions[qIndex].options = updatedQuestions[
        qIndex
      ].options.filter((_, idx) => idx !== oIndex);
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const date = new Date();
    const dateTime = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    if (formData?.status === "UPCOMING" && formData?.activeDate) {
      const active = new Date(formData.activeDate);
      const activeDateTime = active.getDate();
      const activeMonth = active.getMonth();
      const activeYear = active.getFullYear();

      if (
        dateTime !== activeDateTime &&
        activeMonth !== month &&
        year !== activeYear
      )
        return toast.error("for quiz to be upcoming active date must be today");
    }
    if (formData) {
      updateMutation.mutate(formData);
    }
  };

  // Error State
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 p-6">
        <MdErrorOutline className="text-4xl text-rose-500" />
        <p className="text-slate-800 font-bold text-sm">
          {(error as Error)?.message || "Failed to load quiz."}
        </p>
        <button
          onClick={() => router.back()}
          className="text-sm font-bold text-blue-600 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  // Loading State
  if (isLoading || !formData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3 p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <p className="text-slate-500 text-sm font-medium">
          Loading quiz details...
        </p>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8 space-y-6 max-w-[1000px] mx-auto pb-24">
      {/* Page Heading & Actions Bar */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-bold cursor-pointer mb-1"
          >
            <MdArrowBack className="text-base" /> Back to Quizzes
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">
            Edit Quiz
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm md:text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer"
        >
          <MdSave className="text-lg" />
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
      <div className="flex flex-wrap gap-8">
        <h3 className="text-[1.1rem] text-red-400">Past Day: {quiz.day - 1}</h3>
        <h3 className="text-[1.1rem] text-blue-400">Current Day: {quiz.day}</h3>
      </div>
      {/* Main Admin Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Metadata Card */}
        <AdminCard className="space-y-5">
          <h2 className="text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
            Quiz Overview & Metadata
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">
                Quiz Title
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleMetaChange("title", e.target.value)}
                placeholder="e.g. Understanding Browser History and Cache"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Episode
                </label>
                <CustomSelect
                  value={formData.episode}
                  onChange={(value: string) => handleMetaChange("episode", value)}
                  options={EPISODE_OPTIONS.map((ep) => ({ label: ep, value: ep }))}
                  placeholder="Select episode"
                  ariaLabel="Episode"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Day Number
                </label>
                <input
                  type="number"
                  value={formData.day ?? 0}
                  onChange={(e) =>
                    handleMetaChange("day", parseInt(e.target.value) || 0)
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                  min={0}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Active Slot
                </label>
                <CustomSelect
                  value={formData.activeAt}
                  onChange={(value: string) => handleMetaChange("activeAt", value)}
                  options={SLOT_OPTIONS.map((slot) => ({ label: slot, value: slot }))}
                  placeholder="Select active slot"
                  ariaLabel="Active Slot"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Status
                </label>
                <CustomSelect
                  value={formData.status}
                  onChange={(value: string) => handleMetaChange("status", value)}
                  options={STATUS_OPTIONS.map((st) => ({ label: st, value: st }))}
                  placeholder="Select status"
                  ariaLabel="Status"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Active Date
                </label>
                <input
                  type="date"
                  value={formData.activeDate || ""}
                  onChange={(e) =>
                    handleMetaChange("activeDate", e.target.value)
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </AdminCard>

        {/* Dynamic Questions Builder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-900 font-bold text-base">
              Questions ({formData.questions?.length || 0})
            </h2>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-4 py-2 rounded-lg transition-all cursor-pointer border border-slate-200"
            >
              <MdAdd className="text-base text-blue-600" /> Add Question
            </button>
          </div>

          {(formData.questions || []).map((q, qIndex) => (
            <AdminCard key={qIndex} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  Question #{qIndex + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                  title="Remove Question"
                >
                  <MdDeleteOutline className="text-xl" />
                </button>
              </div>

              <input
                type="text"
                value={q.text || ""}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "text", e.target.value)
                }
                placeholder="Enter question prompt..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-900 font-medium outline-none focus:border-blue-600 focus:bg-white transition-all"
                required
              />

              <div className="space-y-2 pt-1">
                <label className="block text-[14px] font-bold text-slate-500 uppercase tracking-wider">
                  Options (Select correct answer)
                </label>

                {(q.options || []).map((opt, oIndex) => (
                  <div
                    key={oIndex}
                    className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleOptionChange(qIndex, oIndex, "isCorrect", true)
                      }
                      className={cn(
                        "p-1.5 rounded-md transition-colors cursor-pointer",
                        opt.isCorrect
                          ? "text-emerald-600 bg-emerald-50 border border-emerald-200"
                          : "text-slate-300 hover:text-slate-400",
                      )}
                    >
                      <MdCheckCircle className="text-xl" />
                    </button>

                    <input
                      type="text"
                      value={opt.text || ""}
                      onChange={(e) =>
                        handleOptionChange(
                          qIndex,
                          oIndex,
                          "text",
                          e.target.value,
                        )
                      }
                      placeholder={`Option ${oIndex + 1}`}
                      className="flex-1 bg-transparent text-sm text-slate-800 outline-none font-medium"
                      required
                    />

                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <MdDeleteOutline className="text-lg" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="text-sm font-bold text-blue-600 hover:underline pt-2 inline-block cursor-pointer"
                >
                  + Add Option
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      </form>
    </main>
  );
}
