"use client";

import { Calendar } from "@/components/ui/calendar";
import GlassCard from "@/components/ui/cards/GlassCard";
import usePerformanceStats from "@/hooks/userPerfomanceStats";
import { format } from "date-fns";
import { memo, useState } from "react";
import { FaCheckCircle, FaGraduationCap, FaTrophy } from "react-icons/fa";
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaCircleXmark,
} from "react-icons/fa6";

// Helper function to format rank numbers (e.g. 1 -> 1st, 2 -> 2nd, 12 -> 12th)
const formatOrdinal = (n: number | string) => {
  const num = Number(n);
  if (isNaN(num)) return n;
  const s = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Custom Skeleton Component matching the GlassCard design
const PerformanceCardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[1, 2].map((i) => (
        <GlassCard
          key={i}
          className="relative p-6 overflow-hidden flex justify-between items-center bg-[#0a0f24]/80 border-slate-800 animate-pulse"
        >
          <div className="flex flex-col justify-between h-full space-y-4 w-1/2">
            {/* Title Skeleton */}
            <div className="h-3 w-20 bg-slate-700/60 rounded-md" />

            {/* Main Metric Skeleton */}
            <div className="h-10 w-28 bg-slate-700/80 rounded-lg" />

            {/* Status / Trend Badge Skeleton */}
            <div className="h-3.5 w-24 bg-slate-700/50 rounded-md" />
          </div>

          {/* Icon Bubble Skeleton */}
          <div className="w-16 h-16 rounded-full bg-slate-800/60 border border-slate-700/40 flex-shrink-0" />
        </GlassCard>
      ))}
    </div>
  );
};

const Personal = ({ detailsId }: { detailsId: string }) => {
  const [date, setDate] = useState<Date>(new Date());
  const dateParam = date ? format(date.toISOString(), "dd-MM-yyyy") : "";

  const { data, isLoading } = usePerformanceStats(detailsId, dateParam);

  const averageScore = data?.averageScore;
  const isAboveAverage =
    typeof averageScore === "number" ? averageScore >= 50 : true;

  return (
    <div className="space-y-6">
      {/* Calendar Section */}
      <section>
        <GlassCard className="text-white overflow-hidden">
          <Calendar
            mode="single"
            required={true}
            selected={date}
            onSelect={(d) => d && setDate(d)}
            endMonth={new Date()}
            disabled={{ after: new Date() }}
            className="w-full"
            classNames={{
              day_button:
                "h-9 w-9 cursor-pointer p-0 font-normal aria-selected:opacity-100 aria-selected:text-blue mx-auto",
              day: "h-9 w-9 p-0 cursor-pointer hover:bg-white text-white hover:text-black flex justify-center items-center font-normal aria-selected:opacity-100 mx-auto",
            }}
            modifiersClassNames={{
              today: "border border-white/40 text-white font-bold",
            }}
          />
        </GlassCard>
      </section>

      {/* Performance Cards Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Selected Day's Performance
        </h2>

        {isLoading ? (
          <PerformanceCardSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Quiz Grade Card */}
            <GlassCard className="relative p-6 flex justify-between items-center bg-[#0a0f24]/80 border-slate-800">
              <div className="flex flex-col justify-between h-full space-y-3">
                <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                  Quiz Average Grade
                </span>

                <h3 className="text-5xl font-extrabold text-white tracking-tight">
                  {averageScore !== undefined && averageScore !== null
                    ? `${averageScore}%`
                    : "N/A"}
                </h3>

                <div
                  className={`flex items-center gap-1.5 text-sm font-medium ${
                    isAboveAverage ? "text-blue" : "text-red"
                  }`}
                >
                  {isAboveAverage ? (
                    <>
                      <FaCheckCircle className="text-sm" />
                      <span>Above average</span>
                    </>
                  ) : (
                    <>
                      <FaCircleXmark className="text-sm" />
                      <span>Below average</span>
                    </>
                  )}
                </div>
              </div>

              {/* Icon Bubble */}
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <FaGraduationCap className="text-blue text-2xl" />
              </div>
            </GlassCard>

            {/* Ranking Card */}
            <GlassCard className="relative p-6 flex justify-between items-center bg-[#0a0f24]/80 border-slate-800">
              <div className="flex flex-col justify-between h-full space-y-3">
                <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                  Ranking
                </span>

                <h3 className="text-5xl font-extrabold text-white tracking-tight">
                  {data?.rank ? formatOrdinal(data.rank) : "N/A"}
                </h3>

                <div className="flex items-center gap-1.5 text-sm font-medium text-green">
                  {data?.rankChange && data.rankChange < 0 ? (
                    <>
                      <FaArrowTrendDown className="text-sm text-red" />
                      <span className="text-red">
                        {Math.abs(data.rankChange)} positions down
                      </span>
                    </>
                  ) : (
                    <>
                      <FaArrowTrendUp className="text-sm" />
                      <span>positions</span>
                    </>
                  )}
                </div>
              </div>

              {/* Icon Bubble */}
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <FaTrophy className="text-blue text-xl" />
              </div>
            </GlassCard>
          </div>
        )}
      </section>
    </div>
  );
};

export default memo(Personal);
