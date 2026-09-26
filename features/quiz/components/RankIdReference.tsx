"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getRankData } from "@/lib/api/apis";

// Rank ids and their allowed topics, for JSON where each question carries
// its own rankId (the live quiz batch upload has no rank picker).
export default function RankIdReference() {
  const [open, setOpen] = useState(false);
  const { data: ranks = [], isLoading } = useQuery({
    queryKey: ["fetchRanks"],
    queryFn: async () => (await getRankData()).data.payload,
  });

  const copy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("Rank id copied");
    } catch {
      toast.error("Couldn't copy; select the id instead");
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-sm font-bold text-slate-700"
        aria-expanded={open}
      >
        Rank ids &amp; topics
        <span className="text-slate-400">{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div className="mt-3 max-h-96 space-y-2 overflow-y-auto">
          {isLoading && <p className="text-sm text-slate-400">Loading ranks…</p>}
          {[...ranks]
            .sort((a: any, b: any) => b.rank - a.rank)
            .map((r: any) => (
              <div key={r.id} className="rounded-lg bg-slate-50 p-2.5 text-[13px]">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-slate-700">
                    #{r.rank} {r.rankName}
                  </span>
                  <button
                    type="button"
                    onClick={() => copy(r.id)}
                    className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-blue-600 border border-slate-200 hover:bg-blue-50"
                  >
                    Copy id
                  </button>
                </div>
                <code className="block select-all break-all font-mono text-slate-500">
                  {r.id}
                </code>
                {Array.isArray(r.topics) && r.topics.length > 0 && (
                  <p className="mt-1 text-slate-500">Topics: {r.topics.join(", ")}</p>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
