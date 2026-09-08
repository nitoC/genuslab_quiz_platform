"use client";

import React from "react";
import { HiOutlineDocumentText } from "react-icons/hi";

export default function RequiredSchema() {
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
      desc: "Integer index (0-based) of the correct option.",
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
      desc: "The unique identifier for the question rank (e.g., 'bronze', 'gold').",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
        <HiOutlineDocumentText className="text-teal-600 text-lg" />
        <span>Required Schema</span>
      </div>

      <ul className="space-y-3.5 text-sm">
        {schemaRules.map((rule, idx) => (
          <li key={idx} className="flex gap-2.5 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
            <div>
              <span className="font-semibold text-slate-800">{rule.field}</span>{" "}
              <span
                className={`text-[14px] font-bold ${rule.required ? "text-rose-500" : "text-slate-400"}`}
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
