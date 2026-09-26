"use client";

import React from "react";

interface CodeSampleProps {
  code: string;
  label?: string;
}

// Same dark code-block style as TemplatePanel.
export default function CodeSample({ code, label }: CodeSampleProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-800">
      {label && (
        <div className="bg-slate-800 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </div>
      )}
      <pre className="bg-slate-950 text-cyan-400 font-mono text-[12px] leading-relaxed p-3 overflow-x-auto whitespace-pre">
        {code}
      </pre>
    </div>
  );
}
