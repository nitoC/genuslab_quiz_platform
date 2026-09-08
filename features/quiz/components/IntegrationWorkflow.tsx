"use client";

import React from "react";
import { HiCheck, HiOutlineDatabase, HiOutlineLink } from "react-icons/hi";

interface IntegrationWorkflowProps {
  status: "idle" | "success" | "error";
}

export default function IntegrationWorkflow({
  status,
}: IntegrationWorkflowProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm">
      <h3 className="text-sm uppercase font-bold tracking-wider text-slate-400 mb-6">
        Integration Workflow
      </h3>

      <div className="relative flex items-center justify-between max-w-xl mx-auto">
        {/* Connecting Line Track */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-slate-100 -z-0" />

        {/* Step 1: Validation */}
        <div className="z-10 flex flex-col items-center text-center flex-1">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
              status === "success"
                ? "bg-emerald-50 border-emerald-500 text-emerald-600"
                : status === "error"
                  ? "bg-rose-50 border-rose-500 text-rose-600"
                  : "bg-white border-slate-200 text-slate-400"
            }`}
          >
            {status === "success" ? (
              <HiCheck className="text-lg" />
            ) : (
              <span className="text-sm font-bold">1</span>
            )}
          </div>
          <span className="text-sm font-bold text-slate-800 mt-2">
            JSON Validation
          </span>
          <span className="text-[14px] text-slate-400">
            Syntax & Schema check
          </span>
        </div>

        {/* Step 2: Entity Generation */}
        <div className="z-10 flex flex-col items-center text-center flex-1">
          <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white border-slate-200 text-slate-400">
            <HiOutlineDatabase className="text-lg" />
          </div>
          <span className="text-sm font-bold text-slate-400 mt-2">
            Quiz Creation
          </span>
          <span className="text-[14px] text-slate-400">Entity generation</span>
        </div>

        {/* Step 3: Mapping */}
        <div className="z-10 flex flex-col items-center text-center flex-1">
          <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white border-slate-200 text-slate-400">
            <HiOutlineLink className="text-lg" />
          </div>
          <span className="text-sm font-bold text-slate-400 mt-2">
            Question Assignment
          </span>
          <span className="text-[14px] text-slate-400">Mapping & linking</span>
        </div>
      </div>
    </div>
  );
}
