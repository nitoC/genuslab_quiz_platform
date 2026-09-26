// Mirrors the backend upload rules (server/genuslab: quiz.dto.ts,
// question.dto.ts, QuestionService.assertUploadable) so admins see every
// problem, and how to fix it, while they paste or type, instead of one
// server error at a time.

// Each episode only runs in its own slot (QuizService.slots).
export const EPISODE_SLOTS: { episode: string; activeAt: string; label: string }[] = [
  { episode: "EPISODE_1", activeAt: "MORNING_7_9", label: "7–9 AM" },
  { episode: "EPISODE_2", activeAt: "MORNING_9_11", label: "9–11 AM" },
  { episode: "EPISODE_3", activeAt: "MIDDAY_11_13", label: "11 AM–1 PM" },
  { episode: "EPISODE_4", activeAt: "AFTERNOON_13_15", label: "1–3 PM" },
  { episode: "EPISODE_5", activeAt: "AFTERNOON_15_17", label: "3–5 PM" },
  { episode: "EPISODE_6", activeAt: "EVENING_17_19", label: "5–7 PM" },
  { episode: "EPISODE_7", activeAt: "NIGHT_19_21", label: "7–9 PM" },
];

// Fields the server accepts. Anything else is "unknown": the batch upload
// ignores it, but PATCH quiz/update/seed rejects it, so strip before sending.
export const QUIZ_FIELDS = ["title", "day", "episode", "activeAt", "activeDate", "questions"] as const;
export const QUESTION_FIELDS = [
  "questionText",
  "options",
  "answer",
  "answerDescription",
  "difficulty",
  "hint",
  "rankId",
  "topic",
] as const;

export type Problem = { text: string; fix: string };

const SLOT_FOR_EPISODE = new Map(EPISODE_SLOTS.map((s) => [s.episode, s.activeAt]));
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const localToday = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// "YYYY-MM-DD" for today + offset days, in local time.
export const dateString = (offsetDays = 0) => {
  const d = localToday();
  d.setDate(d.getDate() + offsetDays);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

// The day number for a date. `currentDay` (from quiz/activity-details) is
// today's number, so tomorrow is currentDay + 1, and so on.
export const dayForDate = (date: string, currentDay: number) => {
  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const diff = Math.round((target.getTime() - localToday().getTime()) / 86_400_000);
  return currentDay + diff;
};

const pick = <T extends Record<string, any>>(obj: T, keys: readonly string[]) =>
  Object.fromEntries(Object.entries(obj ?? {}).filter(([k]) => keys.includes(k)));

export const stripQuestion = (q: any) => pick(q, QUESTION_FIELDS);

export const stripQuiz = (q: any) => {
  const out: any = pick(q, QUIZ_FIELDS);
  if (Array.isArray(out.questions)) out.questions = out.questions.map(stripQuestion);
  return out;
};

// Lists unknown fields like "Quiz #2: foo, bar".
export function unknownFields(items: unknown[], kind: "quiz" | "question"): string[] {
  const out: string[] = [];
  items.forEach((raw, i) => {
    if (!raw || typeof raw !== "object") return;
    const allowed: readonly string[] = kind === "quiz" ? QUIZ_FIELDS : QUESTION_FIELDS;
    const extra = Object.keys(raw).filter((k) => !allowed.includes(k));
    const label = kind === "quiz" ? `Quiz #${i + 1}` : `Question #${i + 1}`;
    if (extra.length) out.push(`${label}: ${extra.join(", ")}`);
    const qs = (raw as any).questions;
    if (kind === "quiz" && Array.isArray(qs)) {
      unknownFields(qs, "question").forEach((m) => out.push(`${label} ${m.charAt(0).toLowerCase()}${m.slice(1)}`));
    }
  });
  return out;
}

// Plain-language JSON syntax error with the line it happened on.
export function describeJsonError(text: string, err: unknown): Problem {
  const msg = err instanceof Error ? err.message : String(err);
  const pos = Number(/position (\d+)/i.exec(msg)?.[1]);
  const line = Number.isFinite(pos) ? text.slice(0, pos).split("\n").length : undefined;
  const smart = /[“”‘’]/.test(text);
  const trailing = /,\s*[\]}]/.test(text);
  return {
    text: `The JSON can't be read${line ? ` (around line ${line})` : ""}.`,
    fix: smart
      ? "It has curly quotes (“ ”) from a word processor. Replace them with straight quotes (\")."
      : trailing
        ? "Remove the comma after the last item in a list or object."
        : "Check for a missing comma, quote or bracket near that line, then click Format.",
  };
}

// Errors block the upload (the server would reject them). Warnings don't:
// the server only requires day >= currentDay - 1, so a day that doesn't
// line up with its date is allowed but usually a mistake.
export function validateQuizBatch(
  quizzes: any[],
  opts: { currentDay?: number; fallbackDate?: string },
): { errors: Problem[]; warnings: Problem[] } {
  const errors: Problem[] = [];
  const warnings: Problem[] = [];
  const seen = new Set<string>();
  const minDay = opts.currentDay !== undefined ? opts.currentDay - 1 : undefined;
  const today = dateString(0);

  quizzes.forEach((q, i) => {
    const n = `Quiz #${i + 1}`;
    if (!q || typeof q !== "object" || Array.isArray(q)) {
      errors.push({ text: `${n} isn't a quiz object.`, fix: 'Each item must look like { "title": ..., "episode": ... }.' });
      return;
    }
    if (typeof q.title !== "string" || !q.title.trim())
      errors.push({ text: `${n} has no title.`, fix: 'Add "title": "Your quiz name".' });

    const slot = typeof q.episode === "string" ? SLOT_FOR_EPISODE.get(q.episode) : undefined;
    if (!slot) {
      errors.push({
        text: `${n}: "${String(q.episode ?? "")}" isn't a valid episode.`,
        fix: "Use EPISODE_1 to EPISODE_7 (EPISODE_0 isn't accepted).",
      });
    } else if (q.activeAt !== slot) {
      errors.push({
        text: `${n}: ${q.episode} runs at ${slot}, not ${String(q.activeAt ?? "(missing)")}.`,
        fix: `Set "activeAt": "${slot}".`,
      });
    }

    const date = String(q.activeDate || opts.fallbackDate || "").slice(0, 10);
    if (!DATE_RE.test(date)) {
      errors.push({
        text: `${n} has no valid activeDate.`,
        fix: 'Pick a date with Today / Tomorrow / the date box above, or add "activeDate": "YYYY-MM-DD".',
      });
    } else if (date < today) {
      errors.push({
        text: `${n} is dated ${date}, which is in the past.`,
        fix: "Pick Today, Tomorrow or a later date above; it replaces the dates in the JSON.",
      });
    }

    if (!Number.isInteger(q.day) || q.day < 1) {
      errors.push({ text: `${n} has no valid day number.`, fix: 'Pick a date above, or click "Fill in day numbers".' });
    } else if (minDay !== undefined && q.day < minDay) {
      errors.push({
        text: `${n}: day ${q.day} is in the past (today is day ${opts.currentDay}).`,
        fix: 'Pick a date above, or click "Fill in day numbers".',
      });
    } else if (opts.currentDay !== undefined && DATE_RE.test(date) && dayForDate(date, opts.currentDay) !== q.day) {
      warnings.push({
        text: `${n}: day ${q.day} doesn't match ${date} (that date is day ${dayForDate(date, opts.currentDay)}).`,
        fix: 'Click "Fill in day numbers" unless you meant this.',
      });
    }

    const key = `${q.day}-${q.activeAt}`;
    if (seen.has(key))
      errors.push({
        text: `${n}: another quiz in this file already uses day ${q.day} at ${q.activeAt}.`,
        fix: "Only one quiz per day and time slot. Change the episode, or give it another date.",
      });
    seen.add(key);
  });

  const extra = unknownFields(quizzes, "quiz");
  if (extra.length)
    warnings.push({
      text: `Unknown fields will be ignored: ${extra.slice(0, 5).join("; ")}${extra.length > 5 ? "…" : ""}.`,
      fix: 'Click "Strip unknown fields" to remove them.',
    });
  return { errors, warnings };
}

export interface RankInfo {
  id: string;
  topics?: unknown;
}

// Same checks as QuestionDto + assertUploadable, after the rank/topic
// pickers have been applied.
export function validateQuestions(questions: unknown[], ranks: RankInfo[]): Problem[] {
  const errors: Problem[] = [];
  const topicsByRank = new Map(
    ranks.map((r) => [r.id, Array.isArray(r.topics) ? r.topics.map(String) : []]),
  );

  questions.forEach((raw, i) => {
    const n = `Question #${i + 1}`;
    const q = raw as Record<string, any>;
    if (!q || typeof q !== "object" || Array.isArray(q)) {
      errors.push({ text: `${n} isn't a question object.`, fix: 'Each item must look like { "questionText": ..., "options": [...] }.' });
      return;
    }
    if (typeof q.questionText !== "string" || !q.questionText.trim())
      errors.push({ text: `${n} has no questionText.`, fix: 'Add "questionText": "The question?".' });

    const options = q.options;
    const optionsOk =
      Array.isArray(options) &&
      options.length >= 2 &&
      options.length <= 5 &&
      options.every((o: unknown) => typeof o === "string" && o.trim());
    if (!optionsOk)
      errors.push({
        text: `${n}: options must be 2 to 5 answers.`,
        fix: 'Use a list of text answers, e.g. "options": ["Yes", "No"]. No empty ones.',
      });

    if (!Number.isInteger(q.answer) || q.answer < 0) {
      errors.push({
        text: `${n}: answer ${JSON.stringify(q.answer ?? null)} isn't a position.`,
        fix: 'Use the correct option\'s position counting from 0 (first option = 0). Not a letter like "C".',
      });
    } else if (optionsOk && q.answer >= options.length) {
      errors.push({
        text: `${n}: answer ${q.answer} is past the last option.`,
        fix: `With ${options.length} options, use 0 to ${options.length - 1}.`,
      });
    }

    if (typeof q.answerDescription !== "string" || !q.answerDescription.trim())
      errors.push({ text: `${n} has no answerDescription.`, fix: 'Add "answerDescription": "Why the answer is right."' });

    const difficulty = typeof q.difficulty === "string" ? q.difficulty.trim().toLowerCase() : "";
    if (!["easy", "medium", "hard"].includes(difficulty))
      errors.push({ text: `${n}: difficulty "${String(q.difficulty ?? "")}" isn't allowed.`, fix: 'Use "easy", "medium" or "hard".' });

    if (q.hint !== undefined && typeof q.hint !== "string")
      errors.push({ text: `${n}: hint must be text.`, fix: "Put the hint in quotes, or remove it (it's optional)." });

    const topics = topicsByRank.get(q.rankId);
    if (!q.rankId)
      errors.push({ text: `${n} has no rank.`, fix: "Pick the rank from the dropdown; it's filled into every question." });
    else if (!topics)
      errors.push({ text: `${n}: rankId "${q.rankId}" doesn't exist.`, fix: "Pick the rank from the dropdown instead of typing the id." });
    else if (q.topic && !topics.includes(q.topic))
      errors.push({
        text: `${n}: topic "${q.topic}" doesn't belong to this rank.`,
        fix: "Pick a topic from the dropdown, or remove the topic field.",
      });
  });

  const extra = unknownFields(questions, "question");
  if (extra.length)
    errors.push({
      text: `Unknown fields: ${extra.slice(0, 5).join("; ")}${extra.length > 5 ? "…" : ""}.`,
      fix: 'Click "Strip unknown fields". Adding questions to a quiz fails if they\'re sent.',
    });
  return errors;
}

// Backend 400s come back as { message, errors? } or { message: string[] }.
export function serverErrorText(err: any): string {
  if (!err?.response) return "Can't reach the server. Check your connection and try again.";
  const data = err.response.data;
  const list: string[] = Array.isArray(data?.errors)
    ? data.errors
    : Array.isArray(data?.message)
      ? data.message
      : [];
  const head = typeof data?.message === "string" ? data.message : "";
  return [head, ...list.slice(0, 5)].filter(Boolean).join("\n") || "Upload failed. Please try again.";
}
