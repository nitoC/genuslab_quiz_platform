"use client";

import React from "react";

// One "wrong → right" pair for the upload walkthroughs.
export default function MistakeExample({
  title,
  wrong,
  right,
  why,
}: {
  title: string;
  wrong: string;
  right: string;
  why: string;
}) {
  return (
    <div className="space-y-1.5 rounded-lg border border-slate-200 p-3">
      <p className="text-[13px] font-bold text-slate-800">{title}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
            Rejected
          </span>
          <pre className="mt-0.5 overflow-x-auto rounded-md bg-rose-50 p-2 font-mono text-[12px] leading-relaxed text-rose-900">
            {wrong}
          </pre>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Accepted
          </span>
          <pre className="mt-0.5 overflow-x-auto rounded-md bg-emerald-50 p-2 font-mono text-[12px] leading-relaxed text-emerald-900">
            {right}
          </pre>
        </div>
      </div>
      <p className="text-[12px] text-slate-500">{why}</p>
    </div>
  );
}
