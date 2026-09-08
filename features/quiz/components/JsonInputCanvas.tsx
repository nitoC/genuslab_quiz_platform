"use client";

import { createQuestion, getRankData } from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { HiCode, HiUpload } from "react-icons/hi";

interface JsonInputCanvasProps {
  jsonText: string;
  setJsonText: (val: string) => void;
  questionRank: string;
  setQuestionRank: (val: string) => void;
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
  onFormat,
  onClear,
  handleSubmit,
  submitting,
  handlePreview,
}: JsonInputCanvasProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rankId, setRankId] = useState<string>("");

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        setJsonText(result);
      }
    };
    reader.readAsText(file);
  };

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
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1 text-sm font-medium bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            >
              <HiUpload /> Upload
            </button>
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
          {/* Selector row */}
          <div className="flex flex-col gap-1.5 max-w-xs">
            <label className="text-sm font-semibold text-slate-500">
              Select Question Rank
            </label>
            <select
              value={questionRank}
              defaultValue={"Select Rank"}
              onChange={(e) => {
                setQuestionRank(e.target.value);
                setRankId(e.target.value);
              }}
              className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
              {ranksData &&
                [...ranksData, { rankName: "Select Rank", id: "" }]
                  .reverse()
                  .map((a: any) => {
                    return (
                      <option value={a.id} key={a.id}>
                        {a.rankName}
                      </option>
                    );
                  })}
            </select>
            <input
              className="text-sm text-slate-300"
              type="text"
              value={rankId}
              disabled
            />
          </div>

          {/* Textarea Workspace */}
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder={`[\n  {\n    "questionText": "What is the primary color of EduFlow?",\n    "options": ["Blue", "Red", "Green", "Yellow"],\n    "answer": 0,\n    "answerDescription": "Blue represents trust...",\n    "difficulty": "easy",\n    "rankId": "xxxkeyt..."\n  }\n]`}
            className="w-full h-96 p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 resize-none leading-relaxed"
          />
        </div>
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
