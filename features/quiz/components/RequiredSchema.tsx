"use client";

import React from "react";
import { HiOutlineDocumentText, HiOutlineDownload } from "react-icons/hi";

interface RequiredSchemaProps {
  sampleHref?: string;
  sampleLabel?: string;
}

export default function RequiredSchema({
  sampleHref,
  sampleLabel = "Download sample file",
}: RequiredSchemaProps) {
  const schemaRules = [
    {
      field: "questionText",
      required: true,
      desc: "The string containing the question text.",
    },
    {
      field: "options",
      required: true,
      desc: "An array of 2-5 strings representing possible answers.",
    },
    {
      field: "answer",
      required: true,
      desc: "The number (0, 1, 2...) of the correct option's position in \"options\" — never a letter like \"A\" and never the answer text itself.",
    },
    {
      field: "answerDescription",
      required: true,
      desc: "Detailed explanation shown after submission.",
    },
    {
      field: "difficulty",
      required: true,
      desc: "Enum: 'easy', 'medium', or 'hard'.",
    },
    { field: "hint", required: false, desc: "A helpful tip for the student." },
    {
      field: "rankId",
      required: true,
      desc: "The rank this question belongs to. You don't need to type this — pick a rank from the dropdown above and it's filled in for you.",
    },
    {
      field: "topic",
      required: false,
      desc: "Must match one of the selected rank's topics. Falls back to the Topic dropdown above when omitted.",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <HiOutlineDocumentText className="text-slate-600 text-lg" />
          <span>Required Schema</span>
        </div>
        {sampleHref && (
          <a
            href={sampleHref}
            download
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <HiOutlineDownload size={14} />
            {sampleLabel}
          </a>
        )}
      </div>

      <div className="rounded-lg bg-amber-50 border border-amber-200/70 px-3 py-2.5">
        <p className="text-[13px] text-amber-800 leading-relaxed">
          <span className="font-bold">Answer index example:</span> if the
          correct answer is <span className="font-mono">"const"</span> and it
          sits third in your <span className="font-mono">options</span> array
          (position 0, 1, <span className="underline">2</span>, 3), then{" "}
          <span className="font-mono font-bold">answer</span> must be{" "}
          <span className="font-mono font-bold">2</span>.
        </p>
      </div>

      <ul className="space-y-3.5 text-sm">
        {schemaRules.map((rule, idx) => (
          <li key={idx} className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-slate-800">{rule.field}</span>{" "}
              <span
                className={`text-[14px] font-bold ${rule.required ? "text-red-600" : "text-slate-400"}`}
              >
                ({rule.required ? "Required" : "Optional"})
              </span>
              <p className="text-slate-500 mt-0.5 leading-normal">
                {rule.desc}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
