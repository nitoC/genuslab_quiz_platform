"use client";

import React from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";

export default function DataReferenceGuide() {
  return (
    <div className="bg-indigo-600 text-white rounded-xl p-5 space-y-4 shadow-sm">
      <div className="flex gap-2.5 items-start">
        <HiOutlineInformationCircle className="text-xl text-indigo-200 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Data Reference Guide</h4>
          <p className="text-xs text-indigo-100 leading-relaxed">
            Ensure your JSON uses these valid identifiers for scheduling:
          </p>
        </div>
      </div>

      {/* ACTIVESLOT Segment */}
      <div className="bg-indigo-700/50 rounded-lg p-3.5 space-y-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 block">
          ActiveSlot Values
        </span>
        <p className="font-mono text-[10px] text-indigo-100 leading-relaxed tracking-wide">
          MORNING_7_9, MORNING_9_11, MIDDAY_11_13, AFTERNOON_13_15,
          AFTERNOON_15_17, EVENING_17_19, NIGHT_19_21
        </p>
      </div>

      {/* EPISODETYPE Segment */}
      <div className="bg-indigo-700/50 rounded-lg p-3.5 space-y-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-200 block">
          EpisodeType Values
        </span>
        <p className="font-mono text-[10px] text-indigo-100 tracking-wide">
          EPISODE_0 through EPISODE_7
        </p>
      </div>
    </div>
  );
}
