"use client";

import React from "react";
import { HiCode } from "react-icons/hi";
import JsonFileDropzone from "./JsonFileDropzone";

interface JsonDataEntryProps {
  jsonText: string;
  setJsonText: (val: string) => void;
  onClear: () => void;
}

export default function JsonDataEntry({
  jsonText,
  setJsonText,
  onClear,
}: JsonDataEntryProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-4">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <HiCode className="text-blue-600 text-lg" />
          <span>JSON Data Entry</span>
        </div>

        <button
          onClick={onClear}
          className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Step 1: load your data */}
      <div className="flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shrink-0">
          1
        </span>
        <span className="text-sm font-semibold text-slate-600">
          Upload a .json file, or paste your quiz array in the box below
        </span>
      </div>
      <JsonFileDropzone onFileText={setJsonText} />

      {/* Step 2: review/edit the raw JSON */}
      <div className="flex items-center gap-2 pt-1">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shrink-0">
          2
        </span>
        <span className="text-sm font-semibold text-slate-600">
          Review the JSON below — edit directly here if anything needs fixing
        </span>
      </div>

      {/* Code Editor Area */}
      <div className="relative">
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={`[{"title": "Quiz Title", "day": 1, "episode": "EPISODE_1", "activeAt": "MORNING_7_9", "activeDate": "2026-01-01", "questions": [...]}, ...Custom JSON Array]`}
          className="w-full h-80 p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}
