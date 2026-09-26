"use client";

import React, { useState, useEffect, useRef } from "react";
import JsonDataEntry from "@/features/quiz/components/JsonDataEntry";
import IntegrationWorkflow from "@/features/quiz/components/IntegrationWorkflow";
import BatchSummary from "@/features/quiz/components/BatchSummary";
import DataReferenceGuide from "@/features/quiz/components/DataReferenceGuide";
import LiveQuizPreview from "@/features/quiz/components/LiveQuizPreview";
import WalkthroughModal from "@/features/quiz/components/WalkthroughModal";
import BuilderNavTabs from "@/features/quiz/components/BuilderNavTabs";
import { createQuiz, createQuizBatch, getQuizDay } from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { HiOutlineAcademicCap, HiOutlineExclamation } from "react-icons/hi";
import CodeSample from "@/features/quiz/components/CodeSample";

const LIVE_QUIZ_SAMPLE_HREF = "/samples/live-quiz-batch-sample.json";

const QUIZ_OBJECT_EXAMPLE = `{
  "title": "Morning Trivia - Episode 1",
  "day": 29,
  "episode": "EPISODE_1",
  "activeAt": "MORNING_7_9",
  "activeDate": "2026-09-26"
}`;

const QUIZ_BATCH_EXAMPLE = `[
  {
    "title": "Morning Trivia - Episode 1",
    "day": 29,
    "episode": "EPISODE_1",
    "activeAt": "MORNING_7_9",
    "activeDate": "2026-09-26"
  },
  {
    "title": "Midday Trivia - Episode 2",
    "day": 29,
    "episode": "EPISODE_2",
    "activeAt": "MORNING_9_11",
    "activeDate": "2026-09-26"
  }
]`;

const LIVE_QUIZ_WALKTHROUGH_STEPS = [
  {
    title: "What this page actually creates",
    body: (
      <>
        <p>
          This page creates the <span className="font-semibold">quiz slots themselves</span> —
          think of them as empty containers: a title, which day, which
          episode, and what time they go live. It does{" "}
          <span className="font-bold">not</span> attach any questions, even
          if you include a <span className="font-mono">questions</span> array
          in your JSON — that field is ignored by this particular upload.
        </p>
        <p>
          Every quiz you create here is saved with{" "}
          <span className="font-semibold text-amber-700">Draft</span> status
          and has <span className="font-semibold">zero questions</span> until
          you complete the second step covered later in this guide.
        </p>
        <div className="flex gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-amber-800">
          <HiOutlineExclamation className="text-lg shrink-0 mt-0.5" />
          <p className="text-[13px] leading-relaxed">
            <span className="font-bold">This is a two-step process:</span>{" "}
            (1) create the quiz slots here, then (2) go add real questions to
            each one from the Quizzes page. Step 5 of this guide shows
            exactly how.
          </p>
        </div>
      </>
    ),
  },
  {
    title: "Example: a single quiz object",
    body: (
      <>
        <p>
          Each item in your array needs exactly these five fields. Here's
          one fully valid quiz object:
        </p>
        <CodeSample code={QUIZ_OBJECT_EXAMPLE} label="One quiz object" />
        <ul className="list-disc pl-5 space-y-1 text-[13px]">
          <li>
            <span className="font-mono font-semibold">title</span> — any
            readable name, shown to admins (not to students directly).
          </li>
          <li>
            <span className="font-mono font-semibold">day</span> — the
            internal day counter (see step 3 for the safe value to use).
          </li>
          <li>
            <span className="font-mono font-semibold">episode</span> — one of{" "}
            <span className="font-mono">EPISODE_1</span> through{" "}
            <span className="font-mono">EPISODE_7</span>.
          </li>
          <li>
            <span className="font-mono font-semibold">activeAt</span> — the
            time slot, e.g. <span className="font-mono">MORNING_7_9</span>{" "}
            (full list in the Data Reference Guide card on the right).
          </li>
          <li>
            <span className="font-mono font-semibold">activeDate</span> — an{" "}
            <span className="font-mono">"YYYY-MM-DD"</span> date string.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Example: a full batch (multiple quizzes at once)",
    body: (
      <>
        <p>
          The page expects an <span className="font-semibold">array</span> —
          you can create several episodes for the same day in one upload:
        </p>
        <CodeSample code={QUIZ_BATCH_EXAMPLE} label="Batch of 2 quiz objects" />
        <p>
          Grab the full sample file below (2 ready-to-use quiz objects) if
          you'd rather start from a working file than type this by hand.
        </p>
      </>
    ),
  },
  {
    title: "Picking a safe day number",
    body: (
      <>
        <p>
          The <span className="text-blue-600 font-semibold">Available Day</span>{" "}
          number shown further down this page (next to{" "}
          <span className="text-red-500 font-semibold">Previous Day</span> and{" "}
          <span className="text-emerald-600 font-semibold">Next Day</span>) is
          the safe value to put in every quiz object's{" "}
          <span className="font-mono">day</span> field right now.
        </p>
        <p>
          Example: if the page shows{" "}
          <span className="font-mono font-semibold">
            Available Day (use now): 29
          </span>
          , every quiz object you upload in this batch should use{" "}
          <span className="font-mono">"day": 29</span>. Reusing an
          already-scheduled day/episode/slot combination gets the whole batch
          rejected with a conflict error.
        </p>
        <p>
          If you don't set <span className="font-mono">activeDate</span> on
          a quiz object, pick a date using the{" "}
          <span className="font-semibold">Target Schedule Date</span> field
          above — it gets applied to every quiz object that's missing one.
        </p>
      </>
    ),
  },
  {
    title: "Upload it in",
    body: (
      <p>
        Drag your <span className="font-mono">.json</span> file onto the
        upload box, or paste the array straight into the text box. The
        summary card on the right updates live as you type, showing how many
        quizzes were detected.
      </p>
    ),
  },
  {
    title: "Submit — then check the Integration Workflow",
    body: (
      <p>
        Click <span className="font-semibold">"Create and Assign Questions"</span>{" "}
        to preview the batch, then confirm. The three-step tracker on this
        page (JSON Validation → Quiz Creation → Question Assignment) reflects
        what actually happened — but remember: "Question Assignment" here
        only means the quiz rows were created, not that real questions were
        attached. That's the next step.
      </p>
    ),
  },
  {
    title: "⚠️ Now go add the actual questions",
    body: (
      <>
        <p>
          Your quizzes were just created as{" "}
          <span className="font-semibold text-amber-700">Drafts</span> with{" "}
          <span className="font-semibold">no questions attached yet</span>.
          A quiz in this state won't go live for students. To finish it:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-[13px]">
          <li>
            Open <span className="font-semibold">Quizzes</span> in the sidebar.
          </li>
          <li>
            Click the{" "}
            <span className="font-semibold">Drafts</span> filter tab to find
            the quiz(zes) you just created.
          </li>
          <li>
            On that quiz's card, click the small{" "}
            <span className="font-semibold">+ (Insert Questions)</span> icon
            in the top-right corner — it's the small circled plus sign next
            to the archive/delete icons.
          </li>
          <li>
            That click takes you to the same JSON builder used for demo
            questions, but with this quiz's ID already carried in the URL (
            <span className="font-mono">?id=...</span>). Paste or upload your
            array of question objects there.
          </li>
          <li>
            <span className="font-bold">
              You don't need to add a{" "}
              <span className="font-mono">quizId</span> field to your
              questions yourself
            </span>{" "}
            — because you arrived via that Insert Questions link, the page
            automatically stamps the correct{" "}
            <span className="font-mono">quizId</span> onto every question the
            moment you click "Submit Questions" there.
          </li>
          <li>
            See the{" "}
            <span className="font-semibold">
              "New here? Take the walkthrough"
            </span>{" "}
            button on that page for its own detailed guide with more
            examples.
          </li>
        </ol>
        <p>
          Repeat this for every quiz in your batch — each one needs its own
          questions added separately.
        </p>
      </>
    ),
  },
];

export interface QuizObject {
  title?: string;
  day?: number;
  episode?: string;
  activeAt?: string;
  activeDate?: string;
  questions?: any[];
}

export default function BulkQuizCreator() {
  // The "day" counter every quiz's `day` field must satisfy (> currentDay -
  // 2 for a batch to be accepted) — surfaced so admins don't have to guess
  // or hit a 409 to find out what value is safe to use.
  const { data: dayInfo } = useQuery({
    queryKey: ["quiz-activity-details"],
    queryFn: async () => {
      const res = await getQuizDay();
      return res?.data?.payload as
        | { pastDay: number; currentDay: number; nextDay: number }
        | undefined;
    },
  });

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
  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  const [summary, setSummary] = useState({
    totalQuizzes: 0,
    questionsPerQuiz: 0,
    totalCapacity: 0,
    titles: [] as string[],
  });

  // const {data, isLoading, isError, error} = useQuery({

  // })
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

  //  Correct timer cleanup effect dependency array
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
        // ...(activeRank?.id && { rank: activeRank.id }),
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
        <BuilderNavTabs />

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Bulk Live Quiz Creator
            </h1>
            <p className="mt-2 text-sm sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Scale your assessments by importing multiple quizzes
              simultaneously. Upload or paste your JSON array below — each
              quiz object needs a title, day, episode (e.g., EPISODE_1),
              activeAt slot, and activeDate.
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

        {/* Always-visible notice — not just inside the optional walkthrough
            — since forgetting this step leaves a quiz permanently stuck in
            Draft with zero questions and no obvious error to point at why. */}
        <div className="flex gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3.5">
          <HiOutlineExclamation className="text-xl text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            <span className="font-bold">This only creates the quiz slots</span>{" "}
            (title, day, episode, time) — it does <span className="font-bold">not</span>{" "}
            attach questions, even if your JSON includes a{" "}
            <span className="font-mono">questions</span> field. After
            submitting, go to{" "}
            <span className="font-semibold">Quizzes → Drafts</span> and click
            the <span className="font-semibold">+ (Insert Questions)</span>{" "}
            icon on each quiz to add its actual question set. See the
            walkthrough above for a full example.
          </p>
        </div>

        {/* Previous / available-now / next day — same styling as the quiz
            edit page. dayInfo.currentDay is the value that's safe to use
            right now in each quiz object's `day` field. */}
        {dayInfo && (
          <div className="flex flex-wrap gap-8">
            <h3 className="text-[1.1rem] text-red-400">
              Previous Day: {dayInfo.pastDay}
            </h3>
            <h3 className="text-[1.1rem] text-blue-400">
              Available Day (use now): {dayInfo.currentDay}
            </h3>
            <h3 className="text-[1.1rem] text-emerald-500">
              Next Day: {dayInfo.nextDay}
            </h3>
          </div>
        )}

        {/* Activation Configuration Field Block */}
        <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
            Target Schedule Date (activeDate)
          </label>
          <div className="flex flex-wrap justify-between gap-4">
            <input
              type="date"
              value={activeDate}
              onChange={(e) => setActiveDate(e.target.value)}
              className="w-full max-w-xs px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
            />
          </div>
          <p className="mt-1.5 text-slate-400 text-sm">
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
            <DataReferenceGuide sampleHref={LIVE_QUIZ_SAMPLE_HREF} />
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

      <WalkthroughModal
        open={walkthroughOpen}
        onClose={() => setWalkthroughOpen(false)}
        title="Creating Live Quizzes in Bulk"
        steps={LIVE_QUIZ_WALKTHROUGH_STEPS}
        sampleFileHref={LIVE_QUIZ_SAMPLE_HREF}
      />
    </div>
  );
}
