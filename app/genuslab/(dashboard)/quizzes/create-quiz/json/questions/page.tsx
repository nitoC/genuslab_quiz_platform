"use client";

import React, { useState, useEffect, Suspense } from "react";
import JsonInputCanvas from "@/features/quiz/components/JsonInputCanvas";
import RequiredSchema from "@/features/quiz/components/RequiredSchema";
import QuizPreview from "@/features/quiz/components/QuizPreview";
import TemplatePanel from "@/features/quiz/components/TemplatePanel";
import WalkthroughModal from "@/features/quiz/components/WalkthroughModal";
import BuilderNavTabs from "@/features/quiz/components/BuilderNavTabs";
import { createQuestion, updateQuiz } from "@/lib/api/apis";
import PageLoader from "@/components/ui/PageLoader";
import { IQuestionSubmit } from "@/interfaces";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import useQuizData from "@/hooks/useQuizData";
import { HiOutlineAcademicCap, HiOutlineCheckCircle } from "react-icons/hi";
import CodeSample from "@/features/quiz/components/CodeSample";

const QUESTION_OBJECT_EXAMPLE = `{
  "questionText": "Which keyword declares a constant in JavaScript?",
  "options": ["var", "let", "const", "static"],
  "answer": 2,
  "answerDescription": "\`const\` declares a variable whose value cannot be reassigned.",
  "difficulty": "easy",
  "hint": "It also means \\"unchanging\\" in everyday English."
}`;

const QUESTION_ARRAY_EXAMPLE = `[
  {
    "questionText": "Which keyword declares a constant in JavaScript?",
    "options": ["var", "let", "const", "static"],
    "answer": 2,
    "answerDescription": "\`const\` declares a variable whose value cannot be reassigned.",
    "difficulty": "easy",
    "hint": "It also means \\"unchanging\\" in everyday English."
  },
  {
    "questionText": "What does \\"HTML\\" stand for?",
    "options": [
      "Hyper Transfer Markup Language",
      "HyperText Markup Language",
      "High Text Modern Language",
      "Home Tool Markup Language"
    ],
    "answer": 1,
    "answerDescription": "HTML stands for HyperText Markup Language, used to structure web pages.",
    "difficulty": "easy"
  }
]`;

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

  const contextIntro = id ? (
    <>
      <p>
        You're adding the questions students will actually be asked inside{" "}
        <span className="font-semibold">this specific quiz</span> (shown as
        "Quiz Title" below). Every question you upload here gets attached to
        that quiz automatically via its <span className="font-mono">quizId</span>.
      </p>
      <div className="flex gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2.5 text-blue-800">
        <HiOutlineCheckCircle className="text-lg shrink-0 mt-0.5" />
        <div className="text-[13px] leading-relaxed space-y-1.5">
          <p>
            <span className="font-bold">How you got here:</span> Quizzes →
            click the <span className="font-semibold">Drafts</span> filter
            tab → click the small{" "}
            <span className="font-semibold">+ (Insert Questions)</span> icon
            in the top-right corner of a quiz's card. That click carried this
            quiz's ID in the page's URL (
            <span className="font-mono">?id=...</span>).
          </p>
          <p>
            <span className="font-bold">You don't need to add a{" "}
            <span className="font-mono">quizId</span> field yourself</span> —
            because you arrived via that link, this page already knows which
            quiz you're working on and automatically stamps the correct{" "}
            <span className="font-mono">quizId</span> onto every question the
            moment you click "Submit Questions" below.
          </p>
          <p>
            Once you submit, this quiz stops being an empty draft and can go
            live.
          </p>
        </div>
      </div>
    </>
  ) : (
    <p>
      This uploads the pool of <span className="font-semibold">demo questions</span>{" "}
      shown to users trying a practice quiz — they aren't tied to any
      specific live quiz, so there's no quiz ID involved here.
    </p>
  );

  const walkthroughSteps = [
    {
      title: "What is this page for?",
      body: contextIntro,
    },
    {
      title: "Example: a single question object",
      body: (
        <>
          <p>Every question needs these five required fields:</p>
          <CodeSample code={QUESTION_OBJECT_EXAMPLE} label="One question object" />
          <ul className="list-disc pl-5 space-y-1 text-[13px]">
            <li>
              <span className="font-mono font-semibold">questionText</span> —
              the question itself, as a plain string.
            </li>
            <li>
              <span className="font-mono font-semibold">options</span> — an
              array of 2 to 5 possible answers, in any order you like.
            </li>
            <li>
              <span className="font-mono font-semibold">answer</span> — the{" "}
              <span className="font-bold">position</span> of the correct
              option, counting from 0. In the example above,{" "}
              <span className="font-mono">"const"</span> is the 3rd item
              (index <span className="font-mono">2</span>), so{" "}
              <span className="font-mono">"answer": 2</span>. Never use a
              letter like <span className="font-mono">"C"</span> here.
            </li>
            <li>
              <span className="font-mono font-semibold">answerDescription</span>{" "}
              — shown to the student after they answer, explaining why.
            </li>
            <li>
              <span className="font-mono font-semibold">difficulty</span> —
              must be exactly <span className="font-mono">"easy"</span>,{" "}
              <span className="font-mono">"medium"</span>, or{" "}
              <span className="font-mono">"hard"</span>.
            </li>
          </ul>
          <p className="text-[13px] text-slate-500">
            <span className="font-mono font-semibold text-slate-600">hint</span>{" "}
            is optional. You don't need to set{" "}
            <span className="font-mono font-semibold text-slate-600">rankId</span>{" "}
            or <span className="font-mono font-semibold text-slate-600">topic</span>{" "}
            in your JSON at all — step 3 below fills those in for you from
            the dropdowns.
            {id && (
              <>
                {" "}
                You also don't need a{" "}
                <span className="font-mono font-semibold text-slate-600">
                  quizId
                </span>{" "}
                field — it's added automatically for you on submit, as
                explained in step 1.
              </>
            )}
          </p>
        </>
      ),
    },
    {
      title: "Example: uploading several at once",
      body: (
        <>
          <p>
            The page also accepts an{" "}
            <span className="font-semibold">array</span> of question objects
            — this is the normal way to upload a full batch:
          </p>
          <CodeSample code={QUESTION_ARRAY_EXAMPLE} label="Array of 2 questions" />
          <p>
            Grab the full sample file below if you'd rather start from a
            working file than type this by hand.
          </p>
        </>
      ),
    },
    {
      title: "Load it in, then pick a Rank & Topic",
      body: (
        <>
          <p>
            Drag your <span className="font-mono">.json</span> file onto the
            upload box, or paste the array straight into the text box.
          </p>
          <p>
            Then use the{" "}
            <span className="font-semibold">Select Question Rank</span>{" "}
            search box to pick which rank{" "}
            {id ? "this quiz's questions" : "these demo questions"} belong to
            — try typing a rank name or number to filter the list of 20
            ranks quickly. Once picked, a{" "}
            <span className="font-mono">rankId</span> gets written into
            every question in the box automatically, and you'll see a
            "Building for: #20 — Fresh Mind"-style badge confirming it.
          </p>
          <p>
            If you're building several batches in a row for different ranks,
            the <span className="font-semibold">Recently used ranks</span>{" "}
            chips that appear let you jump back to one with a single click.
          </p>
          <p>
            The <span className="font-semibold">Select Question Topic</span>{" "}
            dropdown is optional — it only lists topics that belong to the
            rank you picked, since a topic must match one of that rank's own
            topics.
          </p>
        </>
      ),
    },
    {
      title: "Check & submit",
      body: (
        <p>
          Click <span className="font-semibold">"See Preview"</span> to
          review every question exactly as a student would see it —
          including which option is marked correct, so you can catch a wrong{" "}
          <span className="font-mono">answer</span> index before it goes
          live. Once it looks right, click{" "}
          <span className="font-semibold">"Submit Questions"</span> to{" "}
          {id
            ? "attach them to this quiz — it can now go live."
            : "save them to the demo pool."}
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
          <BuilderNavTabs />

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
