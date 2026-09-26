"use client";

import React from "react";
import { HiOutlineInformationCircle, HiOutlineDownload } from "react-icons/hi";

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

      {/* ACTIVESLOT Segment */}
      <div className="bg-blue-700/50 rounded-lg p-3.5 space-y-1.5">
        <span className="text-[14px] uppercase font-bold tracking-wider text-blue-200 block">
          ActiveSlot Values
        </span>
        <p className="font-mono text-[14px] text-blue-100 leading-relaxed tracking-wide">
          MORNING_7_9, MORNING_9_11, MIDDAY_11_13, AFTERNOON_13_15,
          AFTERNOON_15_17, EVENING_17_19, NIGHT_19_21
        </p>
      </div>

      {/* EPISODETYPE Segment */}
      <div className="bg-blue-700/50 rounded-lg p-3.5 space-y-1.5">
        <span className="text-[14px] uppercase font-bold tracking-wider text-blue-200 block">
          EpisodeType Values
        </span>
        <p className="font-mono text-[14px] text-blue-100 tracking-wide">
          EPISODE_0 through EPISODE_7
        </p>
      </div>
    </div>
  );
}
