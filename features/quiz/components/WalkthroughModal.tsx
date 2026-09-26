"use client";

import React, { useEffect, useState } from "react";
import { HiOutlineX, HiOutlineDownload } from "react-icons/hi";

export interface WalkthroughStep {
  title: string;
  body: React.ReactNode;
}

export interface WalkthroughModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  steps: WalkthroughStep[];
  sampleFileHref?: string;
  sampleFileLabel?: string;
}

// Step-by-step guide for the JSON upload pages.
export default function WalkthroughModal({
  open,
  onClose,
  title,
  steps,
  sampleFileHref,
  sampleFileLabel = "Download sample file",
}: WalkthroughModalProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (open) setStepIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const step = steps[stepIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="walkthrough-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
          <h2 id="walkthrough-title" className="text-lg font-bold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close walkthrough"
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <HiOutlineX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 min-h-[180px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shrink-0">
              {stepIndex + 1}
            </span>
            <h3 className="text-base font-bold text-slate-800">{step.title}</h3>
          </div>
          <div className="text-sm text-slate-600 leading-relaxed space-y-3">
            {step.body}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 pb-4 shrink-0">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to step ${i + 1}`}
              onClick={() => setStepIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === stepIndex ? "w-6 bg-blue-600" : "w-1.5 bg-slate-200 hover:bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 shrink-0">
          {sampleFileHref ? (
            <a
              href={sampleFileHref}
              download
              className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <HiOutlineDownload size={16} />
              {sampleFileLabel}
            </a>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={isFirst}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => (isLast ? onClose() : setStepIndex((i) => i + 1))}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              {isLast ? "Got it" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
