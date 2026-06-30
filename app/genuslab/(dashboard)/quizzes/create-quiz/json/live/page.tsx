"use client";

import React, { useState, useEffect, useRef } from "react";
import JsonDataEntry from "@/features/quiz/components/JsonDataEntry";
import IntegrationWorkflow from "@/features/quiz/components/IntegrationWorkflow";
import BatchSummary from "@/features/quiz/components/BatchSummary";
import DataReferenceGuide from "@/features/quiz/components/DataReferenceGuide";
import LiveQuizPreview from "@/features/quiz/components/LiveQuizPreview";
import { createQuiz, createQuizBatch } from "@/lib/api/apis";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export interface QuizObject {
  title?: string;
  day?: number;
  episode?: string;
  activeAt?: string;
}

export default function BulkQuizCreator() {
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const router = useRouter();
  const [jsonText, setJsonText] = useState<string>("");
  // const [targetRank, setTargetRank] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<boolean>(false);
  const [QParsed, setQParsed] = useState<QuizObject[] | undefined>();
  const [validationStatus, setValidationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

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

  useEffect(() => {
    return () => timerRef.current.forEach((timer) => clearTimeout(timer));
  });
  const handleClear = () => {
    setJsonText("");
  };

  const handleSubmit = async () => {
    if (submitting) return;
    try {
      if (!QParsed || QParsed.length < 1) return toast.error("empty quiz data");
      setSubmitting(true);
      const res = await createQuizBatch(QParsed);
      console.log(res, "data in batch upload");
      toast.success("quizzes saved in draft proceed to add questions");
      setJsonText("");
      const timeout = setTimeout(() => {
        router.push("/genuslab/quizzes");
      }, 1500);
      timerRef.current.push(timeout);
      timerRef.current = [];
    } catch (err: any) {
      console.log(err);
      if (err?.response?.status === 403) {
        return;
      }
      if (err?.response?.status === 409) {
        return toast.error(
          "some episodes has already been scheduled. create for other episodes",
        );
      }
      toast.error("could not submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Bulk Live Quiz Creator
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">
            Scale your assessments by importing multiple quizzes simultaneously.
            Paste your JSON array below. Each quiz object should include a
            title, day, episode (e.g., EPISODE_1), activeAt slot, and an array
            of questions.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Input & Workflow */}
          <div className="lg:col-span-2 space-y-6">
            <JsonDataEntry
              jsonText={jsonText}
              setJsonText={setJsonText}
              onClear={handleClear}
            />
            <IntegrationWorkflow status={validationStatus} />
          </div>

          {/* Right Column: Actions, Status & Reference */}
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
          quizzes={QParsed}
          isValid={validationStatus === "success"}
          handlePreview={() => setPreview(false)}
          submitting={submitting}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
