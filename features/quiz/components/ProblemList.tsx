"use client";

import React from "react";
import type { Problem } from "@/features/quiz/validation";

// The "what's wrong and how to fix it" panel under the JSON boxes.
export default function ProblemList({
  errors,
  warnings = [],
}: {
  errors: Problem[];
  warnings?: Problem[];
}) {
  if (!errors.length && !warnings.length) return null;
  const row = (p: Problem, i: number, tone: "rose" | "amber") => (
    <li key={`${i}-${p.text}`} className="space-y-0.5">
      <p className={tone === "rose" ? "text-rose-700" : "text-amber-800"}>{p.text}</p>
      <p className="text-slate-600">
        <span className="font-semibold">Fix: </span>
        {p.fix}
      </p>
    </li>
  );
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 text-sm" role="status" aria-live="polite">
      {errors.length > 0 && (
        <div>
          <p className="font-bold text-rose-600">
            {errors.length} problem{errors.length === 1 ? "" : "s"} to fix before uploading
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5">{errors.slice(0, 25).map((p, i) => row(p, i, "rose"))}</ul>
          {errors.length > 25 && <p className="mt-1 text-slate-500">…and {errors.length - 25} more.</p>}
        </div>
      )}
      {warnings.length > 0 && (
        <div>
          <p className="font-bold text-amber-600">Worth checking</p>
          <ul className="mt-2 list-disc space-y-2 pl-5">{warnings.slice(0, 15).map((p, i) => row(p, i, "amber"))}</ul>
        </div>
      )}
    </div>
  );
}
