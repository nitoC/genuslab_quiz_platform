"use client";

import React from "react";
import { HiOutlineClipboardCopy, HiUpload } from "react-icons/hi";

interface TemplatePanelProps {
  setJsonText: (val: string) => void;
}

const TEMPLATE_JSON = `[\n  {\n    "questionText": "text",\n    "options": ["a", "b"],\n    "answer": 0,\n    "answerDescription": "text",\n    "difficulty": "easy",\n    "hint": "text",\n    "rankId": "xxxxxkeyt..."\n   }\n]`;

export default function TemplatePanel({ setJsonText }: TemplatePanelProps) {
  const copyTemplate = () => {
    navigator.clipboard.writeText(TEMPLATE_JSON);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-wide">Template</span>
      </div>

      <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-cyan-400 leading-normal overflow-x-auto max-h-48">
        {TEMPLATE_JSON}
      </pre>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          onClick={copyTemplate}
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg text-white"
        >
          <HiOutlineClipboardCopy /> Copy Template
        </button>
        <button
          onClick={() => setJsonText(TEMPLATE_JSON)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg text-white"
        >
          <HiUpload /> Upload JSON
        </button>
      </div>
    </div>
  );
}
