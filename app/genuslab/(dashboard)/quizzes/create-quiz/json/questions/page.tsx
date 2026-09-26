"use client";

import React, { useState, useEffect, Suspense } from "react";
import JsonInputCanvas from "@/features/quiz/components/JsonInputCanvas";
import RequiredSchema from "@/features/quiz/components/RequiredSchema";
import QuizPreview from "@/features/quiz/components/QuizPreview";
import TemplatePanel from "@/features/quiz/components/TemplatePanel";
import WalkthroughModal from "@/features/quiz/components/WalkthroughModal";
import { createQuestion, updateQuiz } from "@/lib/api/apis";
import PageLoader from "@/components/ui/PageLoader";
import { IQuestionSubmit } from "@/interfaces";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import useQuizData from "@/hooks/useQuizData";
import { HiOutlineAcademicCap } from "react-icons/hi";

export interface QuestionObject {
  questionText: string;
  options: string[];
  answer: number;
  answerDescription: string;
  difficulty: "easy" | "medium" | "hard";
  hint?: string;
  rankId: string;
  // Optional per-question override — must be one of the selected rank's
  // `topics` entries. Falls back to the batch-level topic picker below if
  // the pasted JSON doesn't set one itself.
  topic?: string;
}

function JsonBuilderPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [jsonText, setJsonText] = useState<string>("");
  const [questionRank, setQuestionRank] = useState<string>("");
  const [questionTopic, setQuestionTopic] = useState<string>("");
  const [parsedQuestions, setParsedQuestions] = useState<QuestionObject[]>([]);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  const { quiz, isLoading, isError, error } = useQuizData(id ?? "");

  const sampleHref = id
    ? "/samples/live-questions-sample.json"
    : "/samples/demo-questions-sample.json";

  const walkthroughSteps = id
    ? [
        {
          title: "What is this page for?",
          body: (
            <p>
              You're adding the questions students will actually be asked
              inside <span className="font-semibold">this specific quiz</span>{" "}
              (shown as "Quiz Title" below). Every question you upload here
              gets attached to that quiz automatically.
            </p>
          ),
        },
        {
          title: "Get your JSON ready",
          body: (
            <>
              <p>
                Prepare an array of question objects — each one needs{" "}
                <span className="font-mono">questionText</span>,{" "}
                <span className="font-mono">options</span>,{" "}
                <span className="font-mono">answer</span> (a number, not a
                letter), <span className="font-mono">answerDescription</span>,
                and <span className="font-mono">difficulty</span>.
              </p>
              <p>
                Not sure of the exact shape? Grab the sample file below and
                open it in any text editor to see a real, working example.
              </p>
            </>
          ),
        },
        {
          title: "Load it in",
          body: (
            <p>
              Drag your <span className="font-mono">.json</span> file onto
              the upload box, or paste the array straight into the text box.
              Then pick the <span className="font-semibold">Rank</span> (and
              optionally a <span className="font-semibold">Topic</span>) this
              quiz's questions belong to — that fills{" "}
              <span className="font-mono">rankId</span> /{" "}
              <span className="font-mono">topic</span> into every question
              for you.
            </p>
          ),
        },
        {
          title: "Check & submit",
          body: (
            <p>
              Click <span className="font-semibold">"See Preview"</span> to
              review every question exactly as a student would see it —
              including which option is marked correct. Once it looks right,
              click <span className="font-semibold">"Submit Questions"</span>{" "}
              to attach them to this quiz.
            </p>
          ),
        },
      ]
    : [
        {
          title: "What is this page for?",
          body: (
            <p>
              This uploads the pool of <span className="font-semibold">demo questions</span>{" "}
              shown to users trying a practice quiz — they aren't tied to any
              specific live quiz.
            </p>
          ),
        },
        {
          title: "Get your JSON ready",
          body: (
            <>
              <p>
                Prepare an array of question objects — each one needs{" "}
                <span className="font-mono">questionText</span>,{" "}
                <span className="font-mono">options</span>,{" "}
                <span className="font-mono">answer</span> (a number, not a
                letter), <span className="font-mono">answerDescription</span>,
                and <span className="font-mono">difficulty</span>.
              </p>
              <p>
                Not sure of the exact shape? Grab the sample file below and
                open it in any text editor to see a real, working example.
              </p>
            </>
          ),
        },
        {
          title: "Load it in",
          body: (
            <p>
              Drag your <span className="font-mono">.json</span> file onto
              the upload box, or paste the array straight into the text box.
              Then pick the <span className="font-semibold">Rank</span> (and
              optionally a <span className="font-semibold">Topic</span>)
              these demo questions belong to — that fills{" "}
              <span className="font-mono">rankId</span> /{" "}
              <span className="font-mono">topic</span> into every question
              for you.
            </p>
          ),
        },
        {
          title: "Check & submit",
          body: (
            <p>
              Click <span className="font-semibold">"See Preview"</span> to
              review every question exactly as a student would see it —
              including which option is marked correct. Once it looks right,
              click <span className="font-semibold">"Submit Questions"</span>{" "}
              to save them to the demo pool.
            </p>
          ),
        },
      ];

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
        // A question's own `topic` (from the pasted JSON) wins; otherwise
        // fall back to the batch-level topic picked alongside the rank.
        const topic = a.topic || questionTopic || undefined;
        if (id) {
          return {
            ...a,
            rankId: questionRank,
            topic,
            quizId: id,
          } as IQuestionSubmit;
        }
        return {
          ...a,
          rankId: questionRank,
          topic,
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
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                JSON Builder: {id ? "Quiz Questions" : "Demo Quiz"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Upload or paste your question array below to quickly generate
                a {id ? "quiz's questions" : "practice assessment"}.
              </p>
            </div>
            <button
              onClick={() => setWalkthroughOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm font-bold text-blue-600 shadow-sm hover:bg-blue-50 transition-colors shrink-0"
            >
              <HiOutlineAcademicCap size={18} />
              New here? Take the walkthrough
            </button>
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
                questionTopic={questionTopic}
                setQuestionTopic={setQuestionTopic}
                onFormat={handleFormat}
                handleSubmit={handleSubmit}
                onClear={() => setJsonText("")}
                submitting={submitting}
                handlePreview={() => setPreview(true)}
              />
            </div>
            <div className="space-y-6">
              <RequiredSchema sampleHref={sampleHref} />
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
      <WalkthroughModal
        open={walkthroughOpen}
        onClose={() => setWalkthroughOpen(false)}
        title={id ? "Uploading Quiz Questions" : "Uploading Demo Questions"}
        steps={walkthroughSteps}
        sampleFileHref={sampleHref}
      />
    </>
  );
}

export default function page() {
  return (
    <Suspense fallback={<PageLoader theme="light" />}>
      <JsonBuilderPage />
    </Suspense>
  );
}
