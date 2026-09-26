"use client";

import { createQuestion, getRankData } from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { HiCode } from "react-icons/hi";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import JsonFileDropzone from "./JsonFileDropzone";

interface JsonInputCanvasProps {
  jsonText: string;
  setJsonText: (val: string) => void;
  questionRank: string;
  setQuestionRank: (val: string) => void;
  questionTopic: string;
  setQuestionTopic: (val: string) => void;
  onFormat: () => void;
  onClear: () => void;
  handleSubmit: () => void;
  handlePreview: () => void;
  submitting: boolean;
}

export default function JsonInputCanvas({
  jsonText,
  setJsonText,
  questionRank,
  setQuestionRank,
  questionTopic,
  setQuestionTopic,
  onFormat,
  onClear,
  handleSubmit,
  submitting,
  handlePreview,
}: JsonInputCanvasProps) {
  // Remembers the last few ranks used in this session so switching back to
  // one you were just working with is a single click instead of re-opening
  // the (searchable, but still 20-items-deep) dropdown every time.
  const [recentRankIds, setRecentRankIds] = useState<string[]>([]);

  const {
    isLoading: ranksLoading,
    data: ranksData = [],
    isError: ranksError,
  } = useQuery({
    queryKey: ["fetchRanks"],
    queryFn: async () => {
      const res = await getRankData();

      console.log(res, "fetch ranks response");
      return res.data.payload;
    },
  });

  // Topics are scoped per rank (Rank.topics in the schema) — only offer
  // topics that belong to whichever rank is currently selected above.
  const selectedRank = ranksData.find((a: any) => a.id === questionRank);
  const topicOptions: string[] = Array.isArray(selectedRank?.topics)
    ? selectedRank.topics.filter((t: unknown): t is string => typeof t === "string")
    : [];

  // Writes the dropdown selections into every question object already
  // pasted in the textarea, so what's submitted is exactly what's shown —
  // not a silent fallback applied only at submit time. Leaves the textarea
  // untouched if it's empty or not valid JSON yet, so it never clobbers a
  // payload the admin is still mid-edit on.
  const applyDropdownValuesToJson = (nextRank: string, nextTopic: string) => {
    if (!jsonText.trim()) return;

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return;
    }
    if (!Array.isArray(parsed)) return;

    const updated = parsed.map((q: any) => {
      const next = { ...q };
      if (nextRank) {
        next.rankId = nextRank;
      }
      if (nextTopic) {
        next.topic = nextTopic;
      } else {
        delete next.topic;
      }
      return next;
    });
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const selectRank = (nextRankId: string) => {
    setQuestionRank(nextRankId);
    // Topics are scoped per rank — a topic chosen for the previous rank
    // won't necessarily be valid for the new one.
    setQuestionTopic("");
    applyDropdownValuesToJson(nextRankId, "");
    setRecentRankIds((prev) =>
      [nextRankId, ...prev.filter((id) => id !== nextRankId)].slice(0, 6),
    );
  };

  const recentRanks = recentRankIds
    .map((id) => ranksData.find((a: any) => a.id === id))
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Top action toolbar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
            <HiCode className="text-blue-600 text-sm" />
            <span>JSON Input Canvas</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onFormat}
              className="px-2.5 py-1 text-sm font-medium bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
            >
              Format
            </button>
            <button
              onClick={onClear}
              className="px-2.5 py-1 text-sm font-medium bg-rose-50 text-rose-600 rounded-md hover:bg-rose-100 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Step 1: load your data */}
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shrink-0">
              1
            </span>
            <span className="text-sm font-semibold text-slate-600">
              Upload a .json file, or paste your questions in the box below
            </span>
          </div>
          <JsonFileDropzone onFileText={setJsonText} />

          {/* Step 2: selector row */}
          <div className="flex items-center gap-2 pt-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shrink-0">
              2
            </span>
            <span className="text-sm font-semibold text-slate-600">
              Choose the rank & topic these questions belong to
            </span>
          </div>
          <div className="flex flex-col gap-1.5 max-w-xs">
            <label className="text-sm font-semibold text-slate-500">
              Select Question Rank
            </label>
            <CustomSelect
              value={questionRank}
              loading={ranksLoading}
              searchable
              onChange={selectRank}
              placeholder="Search or select a rank..."
              ariaLabel="Question Rank"
              options={(ranksData ?? [])
                .slice()
                .sort((a: any, b: any) => b.rank - a.rank)
                .map((a: any) => ({
                  label: `#${a.rank} — ${a.rankName}`,
                  value: a.id,
                }))}
            />
            {selectedRank && (
              <span className="w-fit rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                Building for: #{selectedRank.rank} — {selectedRank.rankName}
              </span>
            )}
          </div>

          {/* One-click switching between ranks you've used already this
              session, instead of re-opening the dropdown every time. */}
          {recentRanks.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Recently used ranks
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recentRanks.map((rank: any) => (
                  <button
                    key={rank.id}
                    type="button"
                    onClick={() => selectRank(rank.id)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                      questionRank === rank.id
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    #{rank.rank} {rank.rankName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Topic — applied to every question in the batch below, unless a
              question in the pasted JSON sets its own `topic` field. */}
          <div className="flex flex-col gap-1.5 max-w-xs">
            <label className="text-sm font-semibold text-slate-500">
              Select Question Topic
            </label>
            <CustomSelect
              value={questionTopic}
              onChange={(value: string) => {
                setQuestionTopic(value);
                applyDropdownValuesToJson(questionRank, value);
              }}
              disabled={topicOptions.length === 0}
              placeholder={topicOptions.length ? "Select Topic" : "Select a rank first"}
              ariaLabel="Question Topic"
              options={topicOptions.map((topic) => ({ label: topic, value: topic }))}
            />
          </div>

          {/* Step 3: review/edit the raw JSON */}
          <div className="flex items-center gap-2 pt-1">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shrink-0">
              3
            </span>
            <span className="text-sm font-semibold text-slate-600">
              Review the JSON below — edit directly here if anything needs fixing
            </span>
          </div>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder={`[\n  {\n    "questionText": "What is the primary color of EduFlow?",\n    "options": ["Blue", "Red", "Green", "Yellow"],\n    "answer": 0,\n    "answerDescription": "Blue represents trust...",\n    "difficulty": "easy",\n    "rankId": "xxxkeyt...",\n    "topic": "Optional — overrides the Topic selected above"\n  }\n]`}
            className="w-full h-96 p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 resize-none leading-relaxed"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 px-1">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shrink-0">
          4
        </span>
        <span className="text-sm font-semibold text-slate-600">
          Preview to double-check, then submit
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-center">
        <button
          onClick={handleSubmit}
          className="cursor-pointer rounded-xl bg-blue-600 text-white px-4 py-2 w-full max-100"
        >
          {submitting ? "submitting..." : "Submit Questions"}
        </button>
        <button
          onClick={handlePreview}
          className="bg-green  cursor-pointer rounded-xl px-4 py-2 w-full max-100 text-white"
        >
          See Preview
        </button>
      </div>
    </div>
  );
}
