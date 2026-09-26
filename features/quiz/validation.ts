// Mirrors the backend upload rules (server/genuslab: quiz.dto.ts,
// question.dto.ts, QuestionService.assertUploadable) so admins see every
// problem before submitting instead of one server error at a time.

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

const SLOT_FOR_EPISODE = new Map(EPISODE_SLOTS.map((s) => [s.episode, s.activeAt]));
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const localToday = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// The day number for a date. `currentDay` (from quiz/activity-details) is
// today's number, so tomorrow is currentDay + 1, and so on.
export const dayForDate = (date: string, currentDay: number) => {
  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const diff = Math.round((target.getTime() - localToday().getTime()) / 86_400_000);
  return currentDay + diff;
};

export interface QuizDraft {
  title?: unknown;
  day?: unknown;
  episode?: unknown;
  activeAt?: unknown;
  activeDate?: unknown;
}

// Errors block the upload (the server would reject them). Warnings don't:
// the server only requires day >= currentDay - 1, so a day that doesn't
// line up with its date is allowed but usually a mistake.
export function validateQuizBatch(
  quizzes: QuizDraft[],
  opts: { currentDay?: number; fallbackDate?: string },
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();
  const minDay = opts.currentDay !== undefined ? opts.currentDay - 1 : undefined;

  quizzes.forEach((q, i) => {
    const n = `Quiz #${i + 1}`;
    if (!q || typeof q !== "object") {
      errors.push(`${n}: must be an object`);
      return;
    }
    if (typeof q.title !== "string" || !q.title.trim()) errors.push(`${n}: title is required`);

    const slot = typeof q.episode === "string" ? SLOT_FOR_EPISODE.get(q.episode) : undefined;
    if (!slot) {
      errors.push(`${n}: episode must be EPISODE_1 to EPISODE_7`);
    } else if (q.activeAt !== slot) {
      errors.push(`${n}: ${q.episode} runs at ${slot}, not ${String(q.activeAt ?? "(missing)")}`);
    }

    const date = (q.activeDate as string) || opts.fallbackDate;
    if (!date || typeof date !== "string" || !DATE_RE.test(date.slice(0, 10))) {
      errors.push(`${n}: activeDate must look like "2026-09-26" (or pick a Target Schedule Date)`);
    }

    if (!Number.isInteger(q.day) || (q.day as number) < 1) {
      errors.push(`${n}: day must be a whole number (use "Fill in day numbers")`);
    } else if (minDay !== undefined && (q.day as number) < minDay) {
      errors.push(`${n}: day ${q.day} is in the past; use ${opts.currentDay} or later`);
    } else if (
      opts.currentDay !== undefined &&
      date &&
      DATE_RE.test(date.slice(0, 10)) &&
      dayForDate(date.slice(0, 10), opts.currentDay) !== q.day
    ) {
      warnings.push(
        `${n}: day ${q.day} doesn't line up with ${date.slice(0, 10)} (expected day ${dayForDate(date.slice(0, 10), opts.currentDay)})`,
      );
    }

    const key = `${q.day}-${q.activeAt}`;
    if (seen.has(key)) errors.push(`${n}: another quiz in this file uses day ${q.day} at ${q.activeAt}`);
    seen.add(key);
  });
  return { errors, warnings };
}

export interface RankInfo {
  id: string;
  topics?: unknown;
}

// Same checks as QuestionDto + assertUploadable, after the rank/topic
// pickers have been applied.
export function validateQuestions(questions: unknown[], ranks: RankInfo[]): string[] {
  const errors: string[] = [];
  const topicsByRank = new Map(
    ranks.map((r) => [r.id, Array.isArray(r.topics) ? r.topics.map(String) : []]),
  );

  questions.forEach((raw, i) => {
    const n = `Question #${i + 1}`;
    const q = raw as Record<string, any>;
    if (!q || typeof q !== "object") {
      errors.push(`${n}: must be an object`);
      return;
    }
    if (typeof q.questionText !== "string" || !q.questionText.trim())
      errors.push(`${n}: questionText is required`);

    const options = q.options;
    const optionsOk =
      Array.isArray(options) &&
      options.length >= 2 &&
      options.length <= 5 &&
      options.every((o: unknown) => typeof o === "string" && o.trim());
    if (!optionsOk) errors.push(`${n}: options must be 2 to 5 non-empty strings`);

    if (!Number.isInteger(q.answer) || q.answer < 0) {
      errors.push(`${n}: answer must be the option's position, counting from 0`);
    } else if (optionsOk && q.answer >= options.length) {
      errors.push(`${n}: answer ${q.answer} is out of range (0 to ${options.length - 1})`);
    }

    if (typeof q.answerDescription !== "string" || !q.answerDescription.trim())
      errors.push(`${n}: answerDescription is required`);

    const difficulty = typeof q.difficulty === "string" ? q.difficulty.trim().toLowerCase() : "";
    if (!["easy", "medium", "hard"].includes(difficulty))
      errors.push(`${n}: difficulty must be "easy", "medium" or "hard"`);

    if (q.hint !== undefined && typeof q.hint !== "string") errors.push(`${n}: hint must be text`);

    const topics = topicsByRank.get(q.rankId);
    if (!q.rankId) errors.push(`${n}: pick a rank`);
    else if (!topics) errors.push(`${n}: rankId ${q.rankId} doesn't exist`);
    else if (q.topic && !topics.includes(q.topic))
      errors.push(`${n}: topic "${q.topic}" isn't one of this rank's topics`);
  });
  return errors;
}

// Backend 400s come back as { message, errors? } or { message: string[] }.
export function serverErrorText(err: any): string {
  const data = err?.response?.data;
  const list: string[] = Array.isArray(data?.errors)
    ? data.errors
    : Array.isArray(data?.message)
      ? data.message
      : [];
  const head = typeof data?.message === "string" ? data.message : "";
  return [head, ...list.slice(0, 5)].filter(Boolean).join("\n") || err?.message || "Upload failed";
}
