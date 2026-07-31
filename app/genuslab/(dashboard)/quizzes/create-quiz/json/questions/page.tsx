"use client";

import React, { useState, useEffect, Suspense } from "react";
import JsonInputCanvas from "@/features/quiz/components/JsonInputCanvas";
import RequiredSchema from "@/features/quiz/components/RequiredSchema";
import QuizPreview from "@/features/quiz/components/QuizPreview";
import TemplatePanel from "@/features/quiz/components/TemplatePanel";
import { createQuestion, updateQuiz } from "@/lib/api/apis";
import { IQuestionSubmit } from "@/interfaces";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import useQuizData from "@/hooks/useQuizData";

export interface QuestionObject {
  questionText: string;
  options: string[];
  answer: number;
  answerDescription: string;
  difficulty: "easy" | "medium" | "hard";
  hint?: string;
  rankId: string;
}

function JsonBuilderPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [jsonText, setJsonText] = useState<string>("");
  const [questionRank, setQuestionRank] = useState<string>("");
  const [parsedQuestions, setParsedQuestions] = useState<QuestionObject[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  const { quiz, isLoading, isError, error } = useQuizData(id ?? "");

  // Parse and validate incoming JSON structure
  useEffect(() => {
    // console.log(jsonText, "jsonte");
    // console.log(jsonText.trim(), "jsonte trim tr");
    // console.log(!jsonText.trim(), "jsonte trim");

    if (!jsonText.trim()) {
      setIsValid(false);
      setParsedQuestions([]);
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      console.log(parsed, "parsed");
      console.log(jsonText, " not parsed");
      const targetArray = Array.isArray(parsed) ? parsed : [parsed];

      // Basic structural validation
      const validQuestions = targetArray.filter(
        (q) =>
          q && typeof q.questionText === "string" && Array.isArray(q.options),
      );

      if (validQuestions.length > 0) {
        setParsedQuestions(validQuestions);
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } catch (e) {
      console.log(e, "e");
      setIsValid(false);
    }
  }, [jsonText]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // Keep unformatted text if it's invalid JSON
      console.log(e, "error");
    }
  };

  const handleSubmit = async () => {
    // toast.error("fhdlf");
    // console.log("hely sumb");
    // return;
    console.log(parsedQuestions, "parsed questions");
    if (submitting) return;
    try {
      if (!questionRank) return toast.error("select question rank");
      if (!parsedQuestions || parsedQuestions.length < 1)
        return toast.error("incomplete or empty question field");
      setSubmitting(true);
      const payload: IQuestionSubmit[] = parsedQuestions.map((a) => {
        if (id) {
          return {
            ...a,
            rankId: questionRank,
            quizId: id,
          } as IQuestionSubmit;
        }
        return {
          ...a,
          rankId: questionRank,
        } as IQuestionSubmit;
      });
      const res = id
        ? await updateQuiz(id, payload)
        : await createQuestion(payload);
      if (res) toast.success("questions has been uploaded");
      setJsonText("");
    } catch (err) {
      toast.error("oops! something went wrong");
      if (err instanceof Error) {
        console.log(err.message, "error in catch");
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const responseError = err as { response?: { data?: unknown } };
        console.log(responseError.response?.data, "error in catch");
      } else {
        console.log(err, "error in catch");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
        containerStyle={{
          zIndex: 99999,
        }}
      /> */}
      <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-800">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              JSON Builder: {id ? "Quiz Questions" : "Demo Quiz"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Paste your question array below to quickly generate a practice
              assessment.
            </p>
          </div>
          <h3>
            QUIZ TITLE:{" "}
            <span className="text-blue-400">{quiz && quiz.title}</span>
          </h3>
          {/* Top Grid Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <JsonInputCanvas
                jsonText={jsonText}
                setJsonText={setJsonText}
                questionRank={questionRank}
                setQuestionRank={setQuestionRank}
                onFormat={handleFormat}
                handleSubmit={handleSubmit}
                onClear={() => setJsonText("")}
                submitting={submitting}
                handlePreview={() => setPreview(true)}
              />
            </div>
            <div className="space-y-6">
              <RequiredSchema />
              <TemplatePanel setJsonText={setJsonText} />
            </div>
          </div>
          {/* Bottom Preview Framework */}
          {preview && (
            <QuizPreview
              questions={parsedQuestions}
              isValid={isValid}
              handlePreview={() => setPreview(false)}
            />
          )}{" "}
        </div>
      </div>
    </>
  );
}

export default function page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <JsonBuilderPage />
    </Suspense>
  );
}
