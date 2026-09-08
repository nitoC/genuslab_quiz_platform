"use client";

import React, { useRef } from "react";
import { HiCode, HiUpload } from "react-icons/hi";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm space-y-4">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-800 font-semibold">
          <HiCode className="text-blue-600 text-lg" />
          <span>JSON Data Entry</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <HiUpload className="text-sm" />
            Upload
          </button>
          <button
            onClick={onClear}
            className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Target Rank Dropdown */}
      {/* <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-500 font-medium">Target Rank:</span>
        <select
          value={targetRank}
          onChange={(e) => setTargetRank(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-medium text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
        </select>
      </div> */}

      {/* Code Editor Area */}
      <div className="relative">
        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          placeholder={`[{"title": "Quiz Title", "day": 1, "episode": "EPISODE_1", "activeAt": "SLOT_A", "questions": [...]}, ...Custom JSON Array]`}
          className="w-full h-80 p-4 font-mono text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}
