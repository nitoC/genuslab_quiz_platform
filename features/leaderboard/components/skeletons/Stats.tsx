"use client";

import GlassCard from "@/components/ui/cards/GlassCard";

const StatsSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* TOP ROW: Weekly Analytics + Top Quiz Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Analytics Card */}
        <GlassCard className="lg:col-span-2 p-6 flex flex-col justify-between min-h-[320px]">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              {/* Category label skeleton */}
              <div className="h-4 w-32 bg-slate-700/60 rounded" />
              {/* Title / Metric skeleton */}
              <div className="h-9 w-24 bg-slate-700/80 rounded-md" />
              {/* Trend line skeleton */}
              <div className="h-4 w-40 bg-slate-700/50 rounded" />
            </div>
            {/* Optional circular metric skeleton */}
            <div className="h-12 w-12 rounded-full bg-slate-700/60" />
          </div>

          {/* Area Chart Skeleton Placeholder */}
          <div className="h-[220px] w-full mt-4 bg-slate-800/40 rounded-xl flex items-end p-4 gap-2">
            <div className="w-full bg-slate-700/30 rounded-t h-[40%]" />
            <div className="w-full bg-slate-700/30 rounded-t h-[65%]" />
            <div className="w-full bg-slate-700/30 rounded-t h-[45%]" />
            <div className="w-full bg-slate-700/30 rounded-t h-[80%]" />
            <div className="w-full bg-slate-700/30 rounded-t h-[60%]" />
          </div>
        </GlassCard>

        {/* Top Quiz Performers Card */}
        <GlassCard className="p-6 min-h-[320px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="h-4 w-36 bg-slate-700/60 rounded" />
            <div className="h-9 w-9 rounded-full bg-slate-700/70" />
          </div>

          {/* Record Score Header */}
          <div className="h-7 w-48 bg-slate-700/80 rounded mb-6" />

          {/* Performer Rows Skeleton */}
          <div className="space-y-6 flex-1">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                {/* Circular score progress skeleton */}
                <div className="h-[45px] w-[45px] rounded-full bg-slate-700/70 shrink-0" />

                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-24 bg-slate-700/60 rounded" />
                    <div className="h-4 w-12 bg-slate-700/60 rounded" />
                  </div>
                  {/* Progress bar skeleton */}
                  <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-700/60 rounded-full w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* MIDDLE ROW: Personal Performance + Activity Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Performance Card */}
        <GlassCard className="p-6 flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-3 w-36 bg-slate-700/60 rounded" />
              <div className="h-8 w-28 bg-slate-700/80 rounded" />
            </div>
            {/* Circular progress badge */}
            <div className="h-[80px] w-[80px] rounded-full bg-slate-700/60 shrink-0" />
          </div>

          {/* Chart placeholder */}
          <div className="h-30 w-full mt-4 bg-slate-800/30 rounded-lg" />
        </GlassCard>

        {/* Activity Leaderboard Card */}
        <GlassCard className="p-6 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="h-3 w-36 bg-slate-700/60 rounded mb-2" />
            <div className="h-8 w-24 bg-slate-700/80 rounded mb-6" />
          </div>

          {/* Bar chart columns skeleton */}
          <div className="h-[120px] w-full flex items-end justify-between px-2 gap-2">
            {[40, 70, 50, 90, 60, 30, 80].map((heightPct, idx) => (
              <div
                key={idx}
                className="w-8 bg-slate-700/40 rounded-t-md"
                style={{ height: `${heightPct}%` }}
              />
            ))}
          </div>

          {/* User avatars footer */}
          <div className="flex justify-between items-center mt-4 px-2">
            {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-slate-700/60" />
                <div className="h-2 w-6 bg-slate-700/40 rounded" />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* BOTTOM ROW: Referral Ranking Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 h-[200px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-3 w-32 bg-slate-700/60 rounded" />
              <div className="h-8 w-24 bg-slate-700/80 rounded" />
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-700/60" />
          </div>

          {/* Bar Chart skeleton */}
          <div className="h-20 w-full mt-4 flex items-end justify-between gap-3">
            {[60, 30, 20, 45, 15].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-slate-700/40 rounded-t-md"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default StatsSkeleton;
