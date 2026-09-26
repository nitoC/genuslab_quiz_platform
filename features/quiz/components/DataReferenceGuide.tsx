"use client";

import React from "react";
import { HiOutlineInformationCircle, HiOutlineDownload } from "react-icons/hi";
import { EPISODE_SLOTS } from "@/features/quiz/validation";

interface DataReferenceGuideProps {
  sampleHref?: string;
  sampleLabel?: string;
}

export default function DataReferenceGuide({
  sampleHref,
  sampleLabel = "Download sample batch file",
}: DataReferenceGuideProps) {
  return (
    <div className="bg-blue-600 text-white rounded-xl p-5 space-y-4 shadow-sm">
      <div className="flex gap-2.5 items-start">
        <HiOutlineInformationCircle className="text-xl text-blue-200 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Data Reference Guide</h4>
          <p className="text-sm text-blue-100 leading-relaxed">
            Ensure your JSON uses these valid identifiers for scheduling:
          </p>
        </div>
      </div>

      {sampleHref && (
        <a
          href={sampleHref}
          download
          className="flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-700/50 hover:bg-blue-700/70 rounded-lg px-3.5 py-2 transition-colors w-fit"
        >
          <HiOutlineDownload size={15} />
          {sampleLabel}
        </a>
      )}

      {/* Each episode has exactly one slot; the server rejects any other
          pairing, and EPISODE_0 isn't accepted. */}
      <div className="bg-blue-700/50 rounded-lg p-3.5 space-y-1.5">
        <span className="text-[14px] uppercase font-bold tracking-wider text-blue-200 block">
          episode → activeAt
        </span>
        <ul className="font-mono text-[13px] text-blue-100 leading-relaxed space-y-0.5">
          {EPISODE_SLOTS.map((s) => (
            <li key={s.episode}>
              {s.episode} → {s.activeAt}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-blue-700/50 rounded-lg p-3.5 space-y-1.5">
        <span className="text-[14px] uppercase font-bold tracking-wider text-blue-200 block">
          day &amp; activeDate
        </span>
        <p className="text-[13px] text-blue-100 leading-relaxed">
          One day number per date: today&apos;s is the Available Day, tomorrow
          is +1. activeDate is &quot;YYYY-MM-DD&quot;.
        </p>
      </div>
    </div>
  );
}
