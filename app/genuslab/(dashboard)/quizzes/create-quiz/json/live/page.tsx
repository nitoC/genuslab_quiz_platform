"use client";

import React, { useState, useEffect, useRef } from "react";
import JsonDataEntry from "@/features/quiz/components/JsonDataEntry";
import IntegrationWorkflow from "@/features/quiz/components/IntegrationWorkflow";
import BatchSummary from "@/features/quiz/components/BatchSummary";
import DataReferenceGuide from "@/features/quiz/components/DataReferenceGuide";
import LiveQuizPreview from "@/features/quiz/components/LiveQuizPreview";
import WalkthroughModal from "@/features/quiz/components/WalkthroughModal";
import BuilderNavTabs from "@/features/quiz/components/BuilderNavTabs";
import { createQuizBatch, getQuizDay, getRankData } from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { HiOutlineAcademicCap, HiOutlineExclamation } from "react-icons/hi";
import CodeSample from "@/features/quiz/components/CodeSample";
import RankIdReference from "@/features/quiz/components/RankIdReference";
import MistakeExample from "@/features/quiz/components/MistakeExample";
import {
  EPISODE_SLOTS,
  Problem,
  RankInfo,
  dateString,
  dayForDate,
  describeJsonError,
  serverErrorText,
  stripQuiz,
  validateQuestions,
  validateQuizBatch,
} from "@/features/quiz/validation";
import ProblemList from "@/features/quiz/components/ProblemList";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";

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
    "title": "Morning Trivia - Episode 2",
    "day": 29,
    "episode": "EPISODE_2",
    "activeAt": "MORNING_9_11",
    "activeDate": "2026-09-26"
  }
]`;

const QUIZ_WITH_QUESTIONS_EXAMPLE = `{
  "title": "Morning Trivia - Episode 1",
  "day": 29,
  "episode": "EPISODE_1",
  "activeAt": "MORNING_7_9",
  "activeDate": "2026-09-26",
  "questions": [
    {
      "questionText": "What does \\"CPU\\" stand for?",
      "options": ["Central Processing Unit", "Computer Personal Unit", "Core Program Utility"],
      "answer": 0,
      "answerDescription": "The CPU executes a program's instructions.",
      "difficulty": "easy",
      "rankId": "<rank id>",
      "topic": "Basic computer literacy"
    }
  ]
}`;

const EpisodeSlotTable = () => (
  <table className="w-full text-[13px] border border-slate-200 rounded-lg overflow-hidden">
    <thead className="bg-slate-50 text-slate-500">
      <tr>
        <th className="text-left px-3 py-1.5 font-semibold">episode</th>
        <th className="text-left px-3 py-1.5 font-semibold">activeAt</th>
        <th className="text-left px-3 py-1.5 font-semibold">Time</th>
      </tr>
    </thead>
    <tbody className="font-mono">
      {EPISODE_SLOTS.map((s) => (
        <tr key={s.episode} className="border-t border-slate-100">
          <td className="px-3 py-1">{s.episode}</td>
          <td className="px-3 py-1">{s.activeAt}</td>
          <td className="px-3 py-1 font-sans text-slate-500">{s.label}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const LIVE_QUIZ_WALKTHROUGH_STEPS = [
  {
    title: "What this page actually creates",
    body: (
      <>
        <p>
          This page creates the <span className="font-semibold">quiz slots</span>:
          a title, which day, which episode, and what time they go live.
        </p>
        <p>
          Each quiz can <span className="font-semibold">optionally</span>{" "}
          include a <span className="font-mono">questions</span> array. Those
          questions are saved with the quiz in the same upload, and the quiz
          starts as <span className="font-semibold">Upcoming</span>. A quiz
          without questions is saved as a{" "}
          <span className="font-semibold text-amber-700">Draft</span> and
          won&apos;t go live until you add them.
        </p>
        <div className="flex gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-amber-800">
          <HiOutlineExclamation className="text-lg shrink-0 mt-0.5" />
          <p className="text-[13px] leading-relaxed">
            Here each question must include its own{" "}
            <span className="font-mono">rankId</span> (there&apos;s no rank
            picker on this page), and players only get questions for their own
            rank. The last step of this guide shows how to add questions
            later instead.
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
            time slot. Each episode has exactly one slot (table below); any
            other pairing is rejected.
          </li>
          <li>
            <span className="font-mono font-semibold">activeDate</span> — an{" "}
            <span className="font-mono">"YYYY-MM-DD"</span> date string. You
            can leave it out and pick a Target Schedule Date instead.
          </li>
        </ul>
        <EpisodeSlotTable />
      </>
    ),
  },
  {
    title: "Optional: questions in the same upload",
    body: (
      <>
        <p>
          Add a <span className="font-mono">questions</span> array to any quiz
          object. Each question uses the same fields as the question builder,
          plus its own <span className="font-mono">rankId</span>:
        </p>
        <CodeSample code={QUIZ_WITH_QUESTIONS_EXAMPLE} label="Quiz with questions" />
        <ul className="list-disc pl-5 space-y-1 text-[13px]">
          <li>
            <span className="font-mono">options</span>: 2 to 5 answers;{" "}
            <span className="font-mono">answer</span>: the correct option&apos;s
            position, counting from 0.
          </li>
          <li>
            <span className="font-mono">difficulty</span>: easy, medium or
            hard. Each player gets up to 10 questions for their rank, aiming
            for 7 easy, 2 medium and 1 hard.
          </li>
          <li>
            <span className="font-mono">topic</span> (optional) must be one of
            that rank&apos;s topics; <span className="font-mono">hint</span> is
            optional.
          </li>
        </ul>
        <p>
          If any question is wrong, nothing in the batch is saved and every
          problem is listed.
        </p>
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
          The sample file below has two quizzes: one with 3 questions attached
          and one without. Its <span className="font-mono">day</span> and{" "}
          <span className="font-mono">activeDate</span> values are only
          placeholders: change the dates, then click{" "}
          <span className="font-semibold">Fill in day numbers</span>, or the
          server will reject them as past days.
        </p>
        <p>
          Faster: pick a Target Schedule Date and click{" "}
          <span className="font-semibold">Add missing episodes</span>. It adds
          any of the 7 episodes that date doesn&apos;t have yet, with the right
          day number and slot, below what&apos;s already in the box. It never
          changes your existing quizzes. The new ones have an empty title for
          you to fill in.
        </p>
      </>
    ),
  },
  {
    title: "Picking the day number",
    body: (
      <>
        <p>
          <span className="font-mono">day</span> is a running counter: one
          number per calendar date. The{" "}
          <span className="text-blue-600 font-semibold">Available Day</span>{" "}
          shown on this page is <span className="font-semibold">today's</span>{" "}
          number. Tomorrow is that number + 1, the day after + 2, and so on.
        </p>
        <p>
          Example: if the page shows{" "}
          <span className="font-mono font-semibold">Available Day (use now): 29</span>{" "}
          and today is 26 Sep, quizzes dated 26 Sep use{" "}
          <span className="font-mono">"day": 29</span> and quizzes dated 28 Sep
          use <span className="font-mono">"day": 31</span>.
        </p>
        <p>
          You don't have to work it out: click{" "}
          <span className="font-semibold">Fill in day numbers</span> and every
          quiz gets the day that matches its date. The server rejects days
          older than yesterday's, and a day + time slot that's already taken
          fails the whole batch with a conflict error.
        </p>
        <p>
          If a quiz object has no <span className="font-mono">activeDate</span>,
          the <span className="font-semibold">Target Schedule Date</span> above
          is used for it.
        </p>
      </>
    ),
  },
  {
    title: "Common mistakes (and the fix)",
    body: (
      <div className="space-y-3">
        <p>
          These are the usual reasons an upload is rejected. The page lists
          any of them under the JSON box before you submit.
        </p>
        <MistakeExample
          title="Episode and time slot don't match"
          wrong={`"episode": "EPISODE_2",\n"activeAt": "MORNING_7_9"`}
          right={`"episode": "EPISODE_2",\n"activeAt": "MORNING_9_11"`}
          why="Each episode has one fixed slot (see the table in step 2). EPISODE_0 isn't accepted."
        />
        <MistakeExample
          title="Day copied from the sample"
          wrong={`"day": 1,\n"activeDate": "2026-01-01"`}
          right={`"day": 29,\n"activeDate": "2026-09-26"`}
          why='Days older than yesterday are rejected. Set the date, then click "Fill in day numbers".'
        />
        <MistakeExample
          title="Wrong date format"
          wrong={`"activeDate": "26/09/2026"`}
          right={`"activeDate": "2026-09-26"`}
          why="Always year-month-day with dashes."
        />
        <MistakeExample
          title="Same day and slot twice"
          wrong={`{ "day": 29, "activeAt": "MORNING_7_9", ... },\n{ "day": 29, "activeAt": "MORNING_7_9", ... }`}
          right={`{ "day": 29, "activeAt": "MORNING_7_9", ... },\n{ "day": 30, "activeAt": "MORNING_7_9", ... }`}
          why="Only one quiz per day + slot, in the file and in what's already scheduled. A clash rejects the whole batch."
        />
        <MistakeExample
          title="One object instead of a list"
          wrong={`{ "title": "Morning Trivia", ... }`}
          right={`[\n  { "title": "Morning Trivia", ... }\n]`}
          why="This page always expects an array, even for one quiz."
        />
        <MistakeExample
          title="Question answer as a letter or counted from 1"
          wrong={`"options": ["var", "let", "const"],\n"answer": "C"`}
          right={`"options": ["var", "let", "const"],\n"answer": 2`}
          why="answer is the position of the correct option, counting from 0."
        />
        <MistakeExample
          title="Question without a rankId"
          wrong={`{ "questionText": "...", "difficulty": "easy" }`}
          right={`{ "questionText": "...", "difficulty": "easy",\n  "rankId": "cmnlmyirb0000rog6i4843zlm" }`}
          why='On this page every attached question needs a rankId. Copy it from "Rank ids & topics"; a topic must be one of that rank&apos;s topics.'
        />
        <MistakeExample
          title="Invalid JSON from a word processor"
          wrong={`{ “title”: “Quiz”, }`}
          right={`{ "title": "Quiz" }`}
          why="Use straight quotes and no comma after the last item. Paste into the box and click Format to check."
        />
      </div>
    ),
  },
  {
    title: "Upload it in",
    body: (
      <p>
        Drag your <span className="font-mono">.json</span> file onto the
        upload box, or paste the array straight into the text box. The
        summary card on the right updates live as you type, and any problem
        the server would reject (missing field, wrong episode/slot pair, past
        day, duplicate slot) is listed under the box before you submit.
      </p>
    ),
  },
  {
    title: "Submit — then check the Integration Workflow",
    body: (
      <p>
        Click <span className="font-semibold">"Review and Create Quizzes"</span>{" "}
        to preview the batch, then confirm. The tracker on this page (JSON
        Validation → Quiz Creation → Add Questions) shows where you are; the
        last step happens separately for each quiz, as the next step
        explains. The whole batch is saved or none of it is.
      </p>
    ),
  },
  {
    title: "Adding questions later (or for more ranks)",
    body: (
      <>
        <p>
          Quizzes uploaded without questions are{" "}
          <span className="font-semibold text-amber-700">Drafts</span> and
          won&apos;t go live for students until they have some. You also use
          this to add questions for more ranks to a quiz:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-[13px]">
          <li>
            Open <span className="font-semibold">Quizzes</span> in the sidebar.
          </li>
          <li>
            Click the{" "}
            <span className="font-semibold">Drafts</span> filter tab to find
            the quiz(zes) you just created. (After its first questions are
            added a quiz moves to <span className="font-semibold">Upcoming</span>;
            add the other ranks' questions from there.)
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
          Repeat this for every quiz in your batch, and for{" "}
          <span className="font-semibold">every rank</span> that should play
          it: each player only gets questions uploaded for their own rank.
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
    // Batch days must be > currentDay - 2. Shown so admins know what's allowed.
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

  // Ranks are needed to check attached questions' rankId and topic.
  const { data: ranks = [] } = useQuery({
    queryKey: ["fetchRanks"],
    queryFn: async () => (await getRankData()).data.payload as RankInfo[],
  });

  // Rank/topic for attached questions: when picked, written into every
  // question (overwriting what the JSON had), also on paste.
  const [qRank, setQRank] = useState("");
  const [qTopic, setQTopic] = useState("");
  const [parseProblem, setParseProblem] = useState<Problem | null>(null);
  const rankTopics: string[] = (() => {
    const r: any = ranks.find((x: any) => x.id === qRank);
    return Array.isArray(r?.topics) ? r.topics.map(String) : [];
  })();

  // Same rules the server applies (see features/quiz/validation.ts).
  const check: { errors: Problem[]; warnings: Problem[] } = QParsed
    ? validateQuizBatch(QParsed, {
        currentDay: dayInfo?.currentDay,
        fallbackDate: activeDate,
      })
    : { errors: parseProblem ? [parseProblem] : [], warnings: [] };
  QParsed?.forEach((quiz, i) => {
    if (quiz.questions === undefined) return;
    if (!Array.isArray(quiz.questions)) {
      check.errors.push({
        text: `Quiz #${i + 1}: "questions" must be a list.`,
        fix: 'Use "questions": [ { ... }, { ... } ], or remove it to add questions later.',
      });
      return;
    }
    validateQuestions(quiz.questions, ranks).forEach((e) =>
      check.errors.push({
        ...e,
        text: `Quiz #${i + 1} ${e.text.charAt(0).toLowerCase()}${e.text.slice(1)}`,
        fix: e.fix.replace("Pick the rank from the dropdown", 'Pick "Rank for attached questions" above'),
      }),
    );
  });

  // Applies the picked date (and its day number) and the picked rank/topic
  // to whatever is in the box. Runs shortly after each paste or edit, so
  // typing isn't interrupted; only rewrites when something changes.
  useEffect(() => {
    if (!jsonText.trim()) return;
    const t = setTimeout(() => {
      let parsed: any;
      try {
        parsed = JSON.parse(jsonText);
      } catch {
        return;
      }
      if (!Array.isArray(parsed)) return;
      const currentDay = dayInfo?.currentDay;
      const next = parsed.map((q: any) => {
        if (!q || typeof q !== "object") return q;
        const n = { ...q };
        if (activeDate) {
          n.activeDate = activeDate;
          if (currentDay !== undefined) n.day = dayForDate(activeDate, currentDay);
        }
        if (qRank && Array.isArray(n.questions)) {
          n.questions = n.questions.map((x: any) =>
            x && typeof x === "object" ? { ...x, rankId: qRank, ...(qTopic ? { topic: qTopic } : {}) } : x,
          );
        }
        return n;
      });
      if (JSON.stringify(next) !== JSON.stringify(parsed)) {
        setJsonText(JSON.stringify(next, null, 2));
      }
    }, 500);
    return () => clearTimeout(t);
  }, [jsonText, activeDate, qRank, qTopic, dayInfo?.currentDay]);

  const stripUnknown = () => {
    if (!QParsed) return toast.error("Fix the JSON first so it can be read");
    const before = JSON.stringify(QParsed);
    const after = QParsed.map(stripQuiz);
    if (JSON.stringify(after) === before) return toast("No unknown fields found");
    rewrite(after);
    toast.success("Unknown fields removed");
  };

  const rewrite = (quizzes: QuizObject[]) =>
    setJsonText(JSON.stringify(quizzes, null, 2));

  // Sets each quiz's day from its own date (or the target date).
  const fillDays = () => {
    if (!QParsed || dayInfo?.currentDay === undefined) return;
    rewrite(
      QParsed.map((q) => {
        const date = (q.activeDate || activeDate || "").slice(0, 10);
        return date ? { ...q, day: dayForDate(date, dayInfo.currentDay) } : q;
      }),
    );
  };

  // Adds the episodes the target date doesn't have yet. Never touches what's
  // already in the box (it used to replace it, titles and all). New entries
  // get an empty title so the checker below asks for a real one.
  const insertFullDay = () => {
    if (!activeDate) return toast.error("Pick a Target Schedule Date first");
    if (dayInfo?.currentDay === undefined) return;
    if (jsonText.trim() && !QParsed) {
      return toast.error("Fix the JSON in the box first, so nothing in it is lost");
    }
    const day = dayForDate(activeDate, dayInfo.currentDay);
    const existing = QParsed ?? [];
    const taken = new Set(
      existing
        .filter((q) => (q.activeDate || activeDate || "").slice(0, 10) === activeDate)
        .map((q) => q.episode),
    );
    const added = EPISODE_SLOTS.filter((s) => !taken.has(s.episode)).map((s) => ({
      title: "",
      day,
      episode: s.episode,
      activeAt: s.activeAt,
      activeDate,
    }));
    if (!added.length) return toast("Every episode for that date is already in the box");
    rewrite([...existing, ...added]);
    toast.success(`Added ${added.length} episode(s). Give each one a title.`);
  };

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
      setParseProblem(null);
      if (!Array.isArray(parsed)) {
        setParseProblem({
          text: "The JSON is a single object, not a list.",
          fix: "Wrap it in square brackets: [ { ... } ]. This page always takes a list, even for one quiz.",
        });
        setQParsed(undefined);
      }
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
      setQParsed(undefined);
      setParseProblem(describeJsonError(jsonText, e));
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
    setParseProblem(null);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    try {
      if (!QParsed || QParsed.length < 1) return toast.error("empty quiz data");

      if (check.errors.length)
        return toast.error(
          `Fix ${check.errors.length} problem(s) listed under the JSON box first`,
        );

      setSubmitting(true);

      // Unknown fields are always stripped; empty question lists are left
      // out so those quizzes stay drafts.
      const finalizedPayload = QParsed.map((raw) => {
        const { questions, ...quiz } = stripQuiz(raw);
        return {
          ...quiz,
          activeDate: quiz.activeDate || activeDate,
          ...(questions?.length ? { questions } : {}),
        };
      });

      const res = await createQuizBatch(finalizedPayload);
      const added = res?.data?.payload?.questions ?? 0;
      toast.success(
        added
          ? `Quizzes saved with ${added} question(s)`
          : "Quizzes saved as drafts; add their questions next",
      );
      setJsonText("");
      setActiveDate("");

      const timeout = setTimeout(() => {
        router.push("/genuslab/quizzes");
      }, 1500);
      timerRef.current.push(timeout);
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 403) {
        return;
      }
      if (err?.response?.status === 409) {
        return toast.error(
          "Some of these day + time slots are already scheduled. Nothing was saved; change those and try again.",
        );
      }
      toast.error(`Could not submit quiz\n${serverErrorText(err)}`);
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

        {/* Always visible: a quiz uploaded without questions stays a Draft
            and never goes live, with no error to explain why. */}
        <div className="flex gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3.5">
          <HiOutlineExclamation className="text-xl text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            Questions are <span className="font-bold">optional</span> here.
            Quizzes that include a <span className="font-mono">questions</span>{" "}
            array are saved with them and start as Upcoming. Quizzes without
            stay <span className="font-semibold">Drafts</span>: add their
            questions later from{" "}
            <span className="font-semibold">Quizzes → Drafts → + (Insert Questions)</span>.
            Players only get questions for their own rank.
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
          <label
            htmlFor="schedule-date"
            className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2"
          >
            Schedule date
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "Today", date: dateString(0) },
              { label: "Tomorrow", date: dateString(1) },
            ].map((b) => (
              <button
                key={b.label}
                type="button"
                onClick={() => setActiveDate(b.date)}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold border transition-colors ${
                  activeDate === b.date
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {b.label}
                {dayInfo?.currentDay !== undefined && (
                  <span className="ml-1.5 font-normal opacity-80">
                    (day {dayForDate(b.date, dayInfo.currentDay)})
                  </span>
                )}
              </button>
            ))}
            {/* Past dates are disabled. */}
            <input
              id="schedule-date"
              type="date"
              min={dateString(0)}
              value={activeDate}
              onChange={(e) => {
                const v = e.target.value;
                if (v && v < dateString(0)) return toast.error("Past dates can't be scheduled");
                setActiveDate(v);
              }}
              aria-label="Pick a later date"
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
            />
            {activeDate && (
              <button
                type="button"
                onClick={() => setActiveDate("")}
                className="text-sm font-semibold text-slate-500 hover:text-slate-800"
              >
                Use the dates in my JSON instead
              </button>
            )}
          </div>
          <p className="mt-1.5 text-slate-500 text-sm">
            {activeDate
              ? `Every quiz in the box is set to ${activeDate}${
                  dayInfo?.currentDay !== undefined ? ` (day ${dayForDate(activeDate, dayInfo.currentDay)})` : ""
                }, replacing the dates and day numbers in the JSON.`
              : "Pick a date to set it (and the matching day number) on every quiz. Otherwise each quiz's own activeDate is used."}
          </p>
        </div>

        {/* Rank for questions attached in the JSON (optional) */}
        <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm">
          <p className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
            Rank for attached questions (optional)
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-72">
              <CustomSelect
                value={qRank}
                searchable
                placeholder="Keep each question's rankId"
                ariaLabel="Rank for attached questions"
                onChange={(v: string) => {
                  setQRank(v);
                  setQTopic("");
                }}
                options={[...(ranks as any[])]
                  .sort((a, b) => b.rank - a.rank)
                  .map((r) => ({ label: `#${r.rank} — ${r.rankName}`, value: r.id }))}
              />
            </div>
            <div className="w-full sm:w-64">
              <CustomSelect
                value={qTopic}
                disabled={!rankTopics.length}
                placeholder={qRank ? "Keep each question's topic" : "Pick a rank first"}
                ariaLabel="Topic for attached questions"
                onChange={(v: string) => setQTopic(v)}
                options={rankTopics.map((t) => ({ label: t, value: t }))}
              />
            </div>
            {qRank && (
              <button
                type="button"
                onClick={() => {
                  setQRank("");
                  setQTopic("");
                }}
                className="text-sm font-semibold text-slate-500 hover:text-slate-800"
              >
                Clear
              </button>
            )}
          </div>
          <p className="mt-1.5 text-slate-500 text-sm">
            When picked, the rank (and topic) is written into every attached
            question, including ones you paste later.
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
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={insertFullDay}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Add missing episodes for the date
              </button>
              <button
                type="button"
                onClick={fillDays}
                disabled={!QParsed?.length}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                Fill in day numbers
              </button>
              <button
                type="button"
                onClick={stripUnknown}
                disabled={!QParsed?.length}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                Strip unknown fields
              </button>
            </div>
            <ProblemList errors={check.errors} warnings={check.warnings} />
            <IntegrationWorkflow
              status={
                validationStatus === "success" && check.errors.length
                  ? "error"
                  : validationStatus
              }
            />
          </div>

          <div className="space-y-6">
            <BatchSummary
              handlePreview={() => setPreview(true)}
              summary={summary}
            />
            <DataReferenceGuide sampleHref={LIVE_QUIZ_SAMPLE_HREF} />
            <RankIdReference />
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
